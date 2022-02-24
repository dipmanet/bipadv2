/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';

import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
    listToMap,
} from '@togglecorp/fujs';
import { adToBs, bsToAd, calculateAge } from '@sbmdkl/nepali-date-converter';
import Loading from '#components/Loading';

import {
    sum,
    saveChart,
    encodeDate,
} from '#utils/common';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    incidentListSelectorIP,
    filtersSelector,
    hazardTypesSelector,
    regionsSelector,
    bulletinEditDataSelector,
} from '#selectors';
import { setBulletinYearlyDataAction } from '#actionCreators';
import styles from './styles.scss';
import NepaliDate from '../../NepaliDate';

const lossMetrics = [
    { key: 'count', label: 'Incidents' },
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'estimatedLoss', label: 'Estimated loss (NPR)' },
    { key: 'infrastructureDestroyedRoadCount', label: 'Road destroyed' },
    { key: 'livestockDestroyedCount', label: 'Livestock destroyed' },
    { key: 'peopleMissingCount', label: 'People missing' },
    { key: 'peopleInjuredCount', label: 'People injured' },
    { key: 'peopleDeathFemaleCount', label: 'Female death' },
    { key: 'peopleDeathMaleCount', label: 'Male death' },
    { key: 'peopleDeathOtherCount', label: 'Other death' },
];


const lossMetricsHazard = [
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'count', label: 'Incidents' },
    { key: 'peopleMissingCount', label: 'People missing' },
    { key: 'peopleInjuredCount', label: 'People injured' },
    { key: 'estimatedLoss', label: 'Economic loss' },
    { key: 'familyAffectedCount', label: 'Families affected' },
];


interface Props {
    setBulletinLossAction: () => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinYearlyData: params => dispatch(setBulletinYearlyDataAction(params)),

});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
});

const months = {
    1: 'बैशाख',
    2: 'जेठ',
    3: 'असार',
    4: 'श्रावण',
    5: 'भदौ',
    6: 'आश्विन',
    7: 'कार्तिक',
    8: 'मंसिर',
    9: 'पुष',
    10: 'माघ',
    11: 'फाल्गुन',
    12: 'चैत्,',
};

const a = new Date();
const b = a.toLocaleString();
const ourDate = b.split(',')[0].split('/');
const dateString = `${ourDate[2]}-${ourDate[0]}-${ourDate[1]}`;
const bsDate = adToBs(dateString);
const year = bsDate.split('-')[0];
const month = months[Number(bsDate.split('-')[1])];
const day = bsDate.split('-')[2];
const today = new Date();
const baisakh1 = bsToAd(`${year}-01-01`);
const DEFAULT_END_DATE = today;


const requestQuery = ({
    params: {
        // startDate = DEFAULT_START_DATE.toISOString(),
        // endDate = DEFAULT_END_DATE.toISOString(),
        startDate = `${baisakh1}T00:00:00+05:45`,
        endDate = `${DEFAULT_END_DATE.toISOString().split('T')[0]}T23:59:59+05:45`,
    } = {},
}) => ({
    expand: ['loss.peoples', 'wards'],
    limit: -1,
    incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
    incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
    ordering: '-incident_on',
    // lnd: true,
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: requestQuery,
        onMount: true,
        onSuccess: ({ response, params, props: { setIncidentList } }) => {
            if (params && params.setLossData) {
                params.setLossData(response.results);
            }
        },
    },
};

const YearlyData = (props: Props) => {
    const [summaryData, setSummaryData] = useState();
    const [lossData, setLossData] = useState([]);
    const [cumulative, setCumulative] = useState([]);
    const { requests: { incidentsGetRequest }, hazardTypes, setBulletinYearlyData } = props;
    incidentsGetRequest.setDefaultParams({ setLossData });

    const calculateSummary = (data) => {
        const stat = lossMetrics.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;
        return stat;
    };

    const calculateSummaryHazard = (data) => {
        const stat = lossMetricsHazard.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;

        return stat;
    };


    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (lossData && lossData.length > 0) {
            const newhazardData = {};
            const uniqueHazards = [...new Set(lossData.map(h => h.hazard))];
            console.log('lossData', lossData);
            const hD = uniqueHazards.map((h) => {
                const summaryCalc = calculateSummaryHazard(lossData.filter(l => l.hazard === h));
                newhazardData[hazardTypes[h].titleNe] = {
                    deaths: summaryCalc.peopleDeathCount || 0,
                    incidents: summaryCalc.count || 0,
                    missing: summaryCalc.peopleMissingCount || 0,
                    injured: summaryCalc.peopleInjuredCount || 0,
                    coordinates: [0, 0],
                    estimatedLoss: summaryCalc.estimatedLoss || 0,
                    familiesAffected: summaryCalc.familyAffectedCount || 0,

                };
                return null;
            });
            setBulletinYearlyData({ yearlyData: newhazardData });

            if (Object.keys(newhazardData).length > 0) {
                const cumulativeData = Object.keys(newhazardData)
                    .map(item => newhazardData[item])
                    .reduce((acc, cur) => ({
                        deaths: acc.deaths + Number(cur.deaths || 0),
                        incidents: acc.incidents + Number(cur.incidents || 0),
                        missing: acc.missing + Number(cur.missing || 0),
                        injured: acc.injured + Number(cur.injured || 0),
                        estimatedLoss: acc.estimatedLoss + Number(cur.estimatedLoss || 0),
                        familiesAffected: acc.familiesAffected + Number(cur.familiesAffected || 0),
                    }));
                console.log('cumulative', cumulativeData);
                setCumulative(cumulativeData);
            }
            setSummaryData(newhazardData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossData]);

    return (
        <>
            <Loading pending={incidentsGetRequest.pending} />
            <div className={styles.pratikriyas}>
                <h3>
                    {
                        `${year} बैशाख १ देखि `
                    }

                    {
                        `${month} ${day} गते सम्मका विपद्का प्रमुख घटनाहरुको विवरण`
                    }

                </h3>
                {
                    summaryData && Object.keys(summaryData).length > 0
                && cumulative && Object.keys(cumulative).length > 0
            && (
                <table className={styles.responseTable}>
                    <tr>

                        <th>
                        घटना
                        </th>
                        <th>
                        घटना
                        </th>
                        <th>
                        म्रितक
                        </th>
                        <th>
                        बेपता
                        </th>
                        <th>
                        घाइते
                        </th>
                        <th>
                        प्रभावित पररिार
                        </th>
                        <th>
                        अिमुानित
                        </th>
                    </tr>
                    {
                        summaryData && Object.keys(summaryData).map((hwL, i) => (
                            <>
                                <tr>

                                    <td>
                                        {hwL}
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].incidents.toLocaleString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].deaths.toLocaleString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].injured.toLocaleString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].missing.toLocaleString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].familiesAffected.toLocaleString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            summaryData[hwL].estimatedLoss.toLocaleString()
                                        }
                                    </td>


                                </tr>
                            </>
                        ))
                    }
                    <tr className={styles.lastRow}>

                        <td>जम्मा</td>
                        <td>
                            {
                                cumulative.incidents.toLocaleString()
                            }
                        </td>
                        <td>
                            {
                                cumulative.deaths.toLocaleString()
                            }
                        </td>
                        <td>
                            {
                                cumulative.injured.toLocaleString()
                            }
                        </td>
                        <td>
                            {
                                cumulative.missing.toLocaleString()
                            }
                        </td>
                        <td>
                            {
                                cumulative.familiesAffected.toLocaleString()
                            }
                        </td>
                        <td>
                            {
                                cumulative.estimatedLoss.toLocaleString()
                            }
                        </td>
                    </tr>
                </table>
            )
                }
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            YearlyData,
        ),
    ),
);
