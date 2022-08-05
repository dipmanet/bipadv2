/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import produce from 'immer';
import { Translation } from 'react-i18next';

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
    languageSelector,
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
    language: languageSelector(state),
});

const months = {
    1: 'बैशाख',
    2: 'जेठ',
    3: 'असार',
    4: 'साउन',
    5: 'भदौ',
    6: 'असोज',
    7: 'कार्तिक',
    8: 'मंसिर',
    9: 'पुष',
    10: 'माघ',
    11: 'फागुन',
    12: 'चैत',
};
const monthsEn = {
    1: 'Baisakh',
    2: 'Jestha',
    3: 'Ashadh',
    4: 'Shrawan',
    5: 'Bhadra',
    6: 'Ashwin',
    7: 'Kartik',
    8: 'Mangsir',
    9: 'Poush',
    10: 'Magh',
    11: 'Falgun',
    12: 'Chaitra',
};

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: ({ params }) => ({
            summary: params.summary,
            summary_type: params.summary_type,
            // incident_on__lt: params.filterDateType === 'incident_on' ? params.date_lt : '',
            // incident_on__gt: params.filterDateType === 'incident_on' ? params.date_gt : '',
            // reported_on__lt: params.filterDateType === 'reported_on' ? params.date_lt : '',
            // reported_on__gt: params.filterDateType === 'reported_on' ? params.date_gt : '',
            incident_on__lt: params.date_lt,
            incident_on__gt: params.date_gt,
            data_source: 'drr_api',

        }),
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
    const { requests: { incidentsGetRequest }, hazardTypes, setBulletinYearlyData, language: { language }, bulletinEditData, endDate, endTime, filterDateType } = props;


    const a = new Date(endDate);
    const b = a.toLocaleString();
    const ourDate = b.split(',')[0].split('/');
    const dateString = `${ourDate[2]}-${ourDate[0]}-${ourDate[1]}`;
    const bsDate = adToBs(dateString);
    const year = bsDate.split('-')[0];
    const month = months[Number(bsDate.split('-')[1])];
    const monthEn = monthsEn[Number(bsDate.split('-')[1])];
    const day = bsDate.split('-')[2];
    const today = new Date(endDate);
    const baisakh1 = bsToAd(`${year}-01-01`);
    const DEFAULT_END_DATE = today;
    useEffect(() => {
        incidentsGetRequest.do({
            filterDateType,
            setLossData,
            summary: true,
            summary_type: 'bulletin_loss_total', // eslint-disable-line @typescript-eslint/camelcase
            date_gt: `${baisakh1}T00:00:00+05:45`, // eslint-disable-line @typescript-eslint/camelcase
            date_lt: `${DEFAULT_END_DATE.toISOString().split('T')[0]}T${endTime}:59+05:45`,
        });
    }, []);

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
        if (Object.keys(bulletinEditData).length > 0) {
            if (bulletinEditData.language === 'nepali') {
                setSummaryData(bulletinEditData.yearlyDataNe);
            } else {
                setSummaryData(bulletinEditData.yearlyData);
            }
        } if (lossData && Object.keys(lossData).length > 0) {
            const newhazardData = {};
            // const uniqueHazards = [...new Set(lossData.map(h => h.hazard))];

            Object.keys(lossData).map((item) => {
                if (language === 'np') {
                    newhazardData[lossData[item].titleNe] = {
                        deaths: lossData[item].totalPeopleDeath || 0,
                        incidents: lossData[item].totalIncidents || 0,
                        missing: lossData[item].totalPeopleMissing || 0,
                        injured: lossData[item].totalPeopleInjured || 0,
                        coordinates: [0, 0],
                        estimatedLoss: lossData[item].totalEstimatedLoss || 0,
                        familiesAffected: lossData[item].totalFamilyAffected || 0,
                    };
                } else {
                    newhazardData[item] = {
                        deaths: lossData[item].totalPeopleDeath || 0,
                        incidents: lossData[item].totalIncidents || 0,
                        missing: lossData[item].totalPeopleMissing || 0,
                        injured: lossData[item].totalPeopleInjured || 0,
                        coordinates: [0, 0],
                        estimatedLoss: lossData[item].totalEstimatedLoss || 0,
                        familiesAffected: lossData[item].totalFamilyAffected || 0,
                    };
                }
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
                setCumulative(cumulativeData);
            }
            setSummaryData(newhazardData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lossData, language]);
    return (
        <>
            <Loading pending={incidentsGetRequest.pending} />
            <div className={styles.pratikriyas}>
                <div className={styles.nobreak}>
                    {
                        language === 'np'
                            ? (
                                <h3>
                                    {
                                        `${year} बैशाख १ देखि `
                                    }

                                    {
                                        `${month} ${day} गते सम्मका विपद्का प्रमुख घटनाहरुको विवरण`
                                    }

                                </h3>
                            )
                            : (
                                <h3>
                                    {
                                        `Disaster incidents form Baisakh 1, ${year} to`
                                    }

                                    {
                                        ` ${monthEn} ${day}, ${year}`
                                    }

                                </h3>
                            )
                    }
                </div>
                {
                    summaryData && Object.keys(summaryData).length > 0
                    && cumulative && Object.keys(cumulative).length > 0
                    && (
                        <table className={styles.responseTable}>
                            <tr>

                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('Hazard')}</span>
                                        }
                                    </Translation>
                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('No. of Incidents')}</span>
                                        }
                                    </Translation>

                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('death')}</span>
                                        }
                                    </Translation>
                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('missing')}</span>
                                        }
                                    </Translation>
                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('injured')}</span>
                                        }
                                    </Translation>
                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('Families Affected')}</span>
                                        }
                                    </Translation>

                                </th>
                                <th>
                                    <Translation>
                                        {
                                            t => <span>{t('Estimated loss (NPR)')}</span>
                                        }
                                    </Translation>
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
                                                    summaryData[hwL].missing.toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    summaryData[hwL].injured.toLocaleString()
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

                                <td>
                                    <Translation>
                                        {
                                            t => <span>{t('Total')}</span>
                                        }
                                    </Translation>
                                </td>
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
                                        cumulative.missing.toLocaleString()
                                    }
                                </td>
                                <td>
                                    {
                                        cumulative.injured.toLocaleString()
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
