/* eslint-disable no-useless-concat */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
    listToMap,
} from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
} from 'recharts';
import { Translation } from 'react-i18next';

import DateInput from '#rsci/DateInput';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';

import { lossMetrics } from '#utils/domain';
import {
    sum,
    saveChart,
    encodeDate,
    convertDateAccToLanguage,
} from '#utils/common';
import {
    hazardTypesSelector,
    hazardFilterSelector,
    regionFilterSelector,
    regionsSelector,
    languageSelector,
    filtersSelector,
} from '#selectors';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Loading from '#components/Loading';
import Page from '#components/Page';

import {
    getResults,
    getPending,
} from '#utils/request';
import {
    transformDataRangeToFilter,
    transformRegionToFilter,
    transformDataRangeLocaleToFilter,
    pastDaysToDateRange,
} from '#utils/transformations';
import { setFiltersAction, setIncidentListActionIP } from '#actionCreators';
import Spinner from '#rscv/Spinner';
import TabularView from './TabularView';
import { getSanitizedIncidents } from './common';
import Overview from './Overview';
import Dropdown from './DropDown';
import BarChartVisual from './Barchart';
import AreaChartVisual from './AreaChart';
import HazardWise from './HazardWise';
import DataTable from './DataTable';
import FilterRadio from './FilterRadio';
import NewCompare from './NewCompare';

import styles from './styles.scss';
import DataCount from './DataCount';


const ModalButton = modalize(Button);

const IncidentTableModal = ({
    closeModal,
    incidentList,
}) => (
    <Modal className={styles.lossAndDamageTableModal}>
        <Translation>
            {
                t => (
                    <ModalHeader
                        title={t('Incidents')}
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                )
            }
        </Translation>

        <ModalBody className={styles.body}>
            <TabularView
                className={styles.table}
                lossAndDamageList={incidentList}
            />
        </ModalBody>
    </Modal>
);

interface State {
}

interface ComponentProps {
}

interface Params {
}

type Props = NewProps<ComponentProps, Params>;

const chartMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setMonth(today.getMonth() - 6);

const DEFAULT_START_DATE = oneYearAgo;
const DEFAULT_END_DATE = today;

const transformFilters = ({
    dataDateRange,
    region,
    ...otherFilters
}) => ({
    ...otherFilters,
    // ...transformDataRangeToFilter(dataDateRange, 'incident_on'),
    ...transformDataRangeLocaleToFilter(dataDateRange, 'incident_on'),
    ...transformRegionToFilter(region),
});


const requestOptions: { [key: string] } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
            expand: ['loss', 'event', 'wards'],
            ordering: '-incident_on',
            limit: -1,
        }),
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters },
                prevProps: { filters: prevFilters },
            }) => {
                const shouldRequest = filters !== prevFilters;

                return shouldRequest;
            },
        },
        // extras: { schemaName: 'incidentResponse' },
    },
};


const getDatesInIsoString = (startDate: string, endDate: string) => ({
    startDate: startDate ? (new Date(startDate)).toISOString() : undefined,
    endDate: endDate ? (new Date(endDate)).toISOString() : undefined,
});

const getDatesInLocaleTime = (startDate: string, endDate: string) => ({
    startDate: startDate ? `${startDate}T00:00:00+05:45` : undefined,
    endDate: endDate ? `${endDate}T23:59:59+05:45` : undefined,
});

const timeTickFormatter = (timestamp: number, language: string) => {
    const date = new Date();
    date.setTime(timestamp);
    return convertDateAccToLanguage(`${date.getFullYear()}-${date.getMonth() + 1}`, language);
};
class LossAndDamage extends React.PureComponent<Props, State> {
    public state = {
        startDate: encodeDate(DEFAULT_START_DATE),
        endDate: encodeDate(DEFAULT_END_DATE),
        submittedStartDate: encodeDate(DEFAULT_START_DATE),
        submittedEndDate: encodeDate(DEFAULT_END_DATE),
        Null_check_estimatedLoss: false,
        selectOption: { name: 'Incidents', key: 'count' },
        valueOnclick: { value: 'count', index: 0 },
        regionRadio: { name: 'province', id: 1 },
    }


    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    componentDidMount() {
        const { filters, setFilters } = this.props;
        const sixMonths = {
            dataDateRange: {
                rangeInDays: 183,
                startDate: undefined,
                endDate: undefined,
            },
            hazard: [],
            region: {},
        };

        setFilters({ filters: sixMonths });
    }


    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    componentDidUpdate(prevProps, prevState) {
        const { filters } = this.props;
        const { rangeInDays } = filters.dataDateRange;
        if (prevProps.filters.dataDateRange.rangeInDays !== rangeInDays) {
            if (rangeInDays !== 'custom') {
                const { startDate: startDateFromFilter, endDate: endDateFromFilter } = pastDaysToDateRange(rangeInDays);
                this.handleStartDateChange(encodeDate(startDateFromFilter));
                this.handleEndDateChange(encodeDate(endDateFromFilter));
            } else {
                const { startDate: startDateFromFilter, endDate: endDateFromFilter } = filters.dataDateRange;
                this.handleStartDateChange(startDateFromFilter);
                this.handleEndDateChange(endDateFromFilter);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    componentWillUnmount(): void {
        const { filters, setFilters } = this.props;
        const sixMonths = {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            hazard: [],
            region: {},
        };

        setFilters({ filters: sixMonths });
    }

    private handleSaveClick = (domId, saveName) => {
        saveChart(domId, saveName);
    }

    private calculateSummary = (data) => {
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

    private getHazardsCount = (data, hazardTypes) => {
        const counts = Object.keys(hazardTypes).reduce((acc, hazard) => {
            const dataForCurrentHazard = data.filter(i => String(i.hazard) === String(hazard));
            const hazardCount = dataForCurrentHazard.length;

            if (hazardCount === 0) {
                return acc;
            }

            return {
                ...acc,
                [hazard]: {
                    hazardDetail: hazardTypes[hazard],
                    summary: this.calculateSummary(dataForCurrentHazard),
                },
            };
        }, {});

        return counts;
    }

    private filterByRegion = (sanitizedIncidents, regionFilter) => {
        if (!regionFilter.adminLevel) {
            return sanitizedIncidents;
        }

        const regionNameMap = {
            1: 'province',
            2: 'district',
            3: 'municipality',
            4: 'ward',
        };

        const filterableProperty = regionNameMap[regionFilter.adminLevel];
        const filteredIncidents = sanitizedIncidents
            .filter(d => d[filterableProperty] === regionFilter.geoarea);

        return filteredIncidents;
    }

    private getFilteredData = memoize((data, hazardTypes, hazardFilter, regionFilter, regions) => {
        const hazardFilterMap = listToMap(hazardFilter, d => d, () => true);
        const sanitizedIncidents = getSanitizedIncidents(data, regions, hazardTypes);
        const regionFilteredData = this.filterByRegion(sanitizedIncidents, regionFilter);

        const filteredData = hazardFilter.length > 0
            ? regionFilteredData.filter(d => hazardFilterMap[d.hazard])
            : regionFilteredData;
        const null_check_estimatedLoss = filteredData.map(item => (item.loss
            ? item.loss.estimatedLoss : undefined))
            .filter(item => item === undefined);
        if (filteredData.length > 0 && (filteredData.length === null_check_estimatedLoss.length)) {
            this.setState({ Null_check_estimatedLoss: true });
        }
        return filteredData;
    })

    private getDataAggregatedByYear = memoize((data) => {
        const dataWithYear = data.map((d) => {
            const incidentDate = new Date(d.incidentOn);
            incidentDate.setDate(1);
            incidentDate.setHours(0);
            incidentDate.setMinutes(0);
            incidentDate.setSeconds(0);

            return {
                ...d,
                incidentMonthTimestamp: incidentDate.getTime(),
            };
        });

        const dateGroupedData = listToGroupList(
            dataWithYear,
            d => d.incidentMonthTimestamp,
            d => d,
        );
        const dateList = Object.keys(dateGroupedData);

        const aggregatedData = dateList.map((date) => {
            const dataListForCurrentYear = dateGroupedData[date].filter(d => !!d.loss);
            const summaryForCurrentYear = this.calculateSummary(dataListForCurrentYear);
            // const hazardSummary = this.getHazardsCount(dataListForCurrentYear, hazardTypes);

            return {
                incidentMonthTimestamp: date,
                summary: summaryForCurrentYear,
                // hazardSummary,
            };
        });

        return aggregatedData.sort(
            (a, b) => (a.incidentMonthTimestamp - b.incidentMonthTimestamp),
        );
    })

    private handleStartDateChange = (startDate) => {
        // const { endDate } = this.state;
        // const { requests: { incidentsGetRequest } } = this.props;

        // incidentsGetRequest.do({
        //     ...getDatesInIsoString(startDate, endDate),
        // });
        const { language: { language } } = this.props;
        const newConvertedStartDate = convertDateAccToLanguage(startDate, language, true);
        this.setState({ startDate: newConvertedStartDate });
    }

    private handleEndDateChange = (endDate) => {
        // const { startDate } = this.state;
        // const { requests: { incidentsGetRequest } } = this.props;

        // incidentsGetRequest.do({
        //     ...getDatesInIsoString(startDate, endDate),
        // });
        const { language: { language } } = this.props;
        const newConvertedEndDate = convertDateAccToLanguage(endDate, language, true);

        this.setState({ endDate: newConvertedEndDate });
    }

    private handleSubmitClick = () => {
        const { startDate, endDate } = this.state;

        if (startDate > endDate) {
            return;
        }

        const { requests: { incidentsGetRequest } } = this.props;
        incidentsGetRequest.do({
            ...getDatesInLocaleTime(startDate, endDate),
        });
        this.setState({
            submittedStartDate: startDate,
            submittedEndDate: endDate,
        });
    }

    public render() {
        const {
            requests,
            hazardTypes,
            hazardFilter,
            regionFilter,
            regions,
            language: { language },
            filters,
        } = this.props;

        const {
            startDate,
            endDate,
            submittedStartDate,
            submittedEndDate,
            Null_check_estimatedLoss,
            valueOnclick,
            selectOption,
            regionRadio,
        } = this.state;

        const incidentList = getResults(requests, 'incidentsGetRequest');
        const pending = getPending(requests, 'incidentsGetRequest');

        const filteredData = this.getFilteredData(
            incidentList,
            hazardTypes,
            hazardFilter,
            regionFilter,
            regions,
        );
        const chartData = this.getDataAggregatedByYear(filteredData);

        const setVAlueOnClick = (dat) => {
            this.setState({ valueOnclick: dat });
        };

        const setSelectOption = (name, key) => {
            this.setState({ selectOption: { name, key } });
        };

        const setRegionRadio = (val, id) => {
            this.setState({ regionRadio: { name: val, id } });
        };

        const hazardSummary = this.getHazardsCount(filteredData, hazardTypes);
        const dropDownClickHandler = (item, index) => {
            const { label, key } = item;
            setVAlueOnClick({ value: key, index });
            setSelectOption(label, key);
        };


        return (
            <>
                <Loading
                    pending={pending}
                    text={language === 'en'
                        ? 'Please wait, the system is loading data'
                        : 'कृपया पर्खनुहोस्, प्रणाली डेटा लोड गर्दैछ'}
                />
                <Page
                    leftContentContainerClassName={styles.left}
                    leftContent={(
                        <>
                            <div className={styles.dataDetails}>
                                <div className={styles.dateDetails}>
                                    <div className={styles.infoIconContainer}>
                                        <Icon
                                            className={styles.infoIcon}
                                            name="info"
                                        />
                                    </div>
                                    {language === 'en'
                                    && (
                                        <div className={styles.label}>
                                        Showing Data From
                                        </div>
                                    )
                                    }
                                    <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={'startDateInput'}
                                        value={convertDateAccToLanguage(startDate, language)}
                                        onChange={this.handleStartDateChange}
                                        language={language}
                                    />
                                    <div className={styles.label}>
                                        <div className={styles.label}>
                                            {language === 'en'
                                                ? <span>to</span>
                                                : <span>देखि</span>
                                            }
                                        </div>
                                    </div>
                                    <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={'endDateInput'}
                                        value={convertDateAccToLanguage(endDate, language)}
                                        onChange={this.handleEndDateChange}
                                        language={language}
                                    />
                                    {language === 'np'
                                        && (
                                            <span>
                                                सम्‍मको डाटा
                                                {' '}
                                                {''}
                                            </span>
                                        )
                                    }
                                    <div
                                        className={styles.submitButton}
                                        onClick={this.handleSubmitClick}
                                        role="presentation"
                                    >
                                        <Translation>
                                            {
                                                t => <span>{t('Submit')}</span>
                                            }
                                        </Translation>
                                    </div>
                                </div>
                                {startDate > endDate
                                    && (
                                        <div className={styles.warningText}>
                                            WARNING! Start date cannot be greater than End Date
                                        </div>
                                    )
                                }
                                <div className={styles.sourceDetails}>
                                    <div className={styles.infoIconContainer}>
                                        <Icon
                                            className={styles.infoIcon}
                                            name="info"
                                        />
                                    </div>
                                    <div className={styles.label}>
                                        <Translation>
                                            {
                                                t => <span>{t('Data sources')}</span>
                                            }
                                        </Translation>
                                        :
                                    </div>
                                    <div className={styles.value}>
                                        <div className={styles.source}>
                                            <Translation>
                                                {
                                                    t => <span>{t('Nepal Police')}</span>
                                                }
                                            </Translation>
                                        </div>
                                        <div className={styles.source}>
                                            <div className={styles.text}>
                                                <Translation>
                                                    {
                                                        t => <span>{t('DRR Portal')}</span>
                                                    }
                                                </Translation>
                                            </div>
                                            <a
                                                className={styles.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="http://drrportal.gov.np"
                                            >
                                                <Icon
                                                    name="externalLink"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <div className={styles.radioAndCompare}>
                                    <FilterRadio
                                        regionRadio={regionRadio}
                                        setRegionRadio={setRegionRadio}
                                        data={filteredData}
                                        valueOnclick={valueOnclick}
                                        regionFilter={regionFilter}
                                        language={language}
                                    />
                                </div>
                                <ModalButton
                                    disabled={pending}
                                    className={styles.modalButton}
                                    modal={(
                                        <NewCompare
                                            lossAndDamageList={incidentList}
                                            getDataAggregatedByYear={this.getDataAggregatedByYear}
                                            getHazardsCount={this.getHazardsCount}
                                            hazardTypes={hazardTypes}
                                            selectOption={selectOption}
                                            valueOnclick={valueOnclick}
                                            currentSelection={selectOption}
                                            language={language}
                                            regionRadio={regionRadio}
                                        />
                                    )}
                                >
                                    <Translation>
                                        {
                                            t => <span>{t('Compare Regions')}</span>
                                        }
                                    </Translation>
                                </ModalButton>
                                <ModalButton
                                    disabled={pending}
                                    title={language === 'en' ? 'View Tabular Data' : 'टेबुलर डाटा हेर्नुहोस्'}
                                    className={styles.showTableButton}
                                    iconName="table"
                                    transparent
                                    modal={(
                                        <DataTable
                                            incidentList={filteredData}
                                            language={language}
                                        />
                                    )}
                                />
                            </div>
                            <div className={styles.container}>
                                <Dropdown
                                    dropDownClickHandler={dropDownClickHandler}
                                    selectOption={selectOption}
                                    setSelectOption={setSelectOption}
                                    dropdownOption={lossMetrics}
                                    icon
                                />
                                <DataCount
                                    data={filteredData}
                                    value={selectOption}
                                    language={language}
                                />
                                {
                                    filteredData.length > 0
                                        ? (
                                            <div style={{ width: '95%' }}>
                                                <BarChartVisual
                                                    filter={regionFilter}
                                                    data={filteredData}
                                                    selectOption={selectOption}
                                                    valueOnclick={valueOnclick}
                                                    regionRadio={regionRadio}
                                                    handleSaveClick={this.handleSaveClick}
                                                    downloadButton
                                                    fullScreenMode
                                                    language={language}

                                                />
                                                <AreaChartVisual
                                                    selectOption={selectOption}
                                                    data={chartData}
                                                    handleSaveClick={this.handleSaveClick}
                                                    downloadButton
                                                    fullScreenMode
                                                    language={language}

                                                />
                                                <HazardWise
                                                    selectOption={selectOption}
                                                    data={hazardSummary}
                                                    handleSaveClick={this.handleSaveClick}
                                                    downloadButton
                                                    fullScreenMode
                                                    language={language}

                                                />
                                            </div>
                                        )
                                        : (
                                            <div className={styles.dataUnavailable}>
                                                <h3 className={styles.headerText}>
                                                    {language === 'en'
                                                        ? 'Please wait, the system is loading data'
                                                        : 'कृपया पर्खनुहोस्, प्रणाली डाटा लोड गर्दैछ'}
                                                </h3>
                                                <Spinner
                                                    className={styles.spinner}
                                                />
                                            </div>
                                        )
                                }
                            </div>
                        </>
                    )}
                    mainContent={(
                        <Overview
                            lossAndDamageList={filteredData}
                            startDate={submittedStartDate}
                            endDate={submittedEndDate}
                            radioSelect={regionRadio}
                            currentSelection={selectOption}
                            pending={pending}
                        />
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
    hazardFilter: hazardFilterSelector(state),
    regionFilter: regionFilterSelector(state),
    regions: regionsSelector(state),
    language: languageSelector(state),
    filters: filtersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setFilters: params => dispatch(setFiltersAction(params)),

});


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ComponentProps>(),
    createRequestClient(requestOptions),
)(LossAndDamage);
