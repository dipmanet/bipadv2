import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    isNotDefined,
    _cs,
    listToMap,
} from '@togglecorp/fujs';
import VerticalTabs from '#rscv/VerticalTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';


import { lossMetrics } from '#utils/domain';
import CommonMap from '#components/CommonMap';
import RegionSelectInput from '#components/RegionSelectInput';
import TextOutput from '#components/TextOutput';
import Page from '#components/Page';
import Icon from '#rscg/Icon';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import Loading from '#components/Loading';
import {
    setRiskListAction,
    setLpGasCookListAction,
    setRegionAction,
} from '#actionCreators';

import {
    riskListSelector,
    lpGasCookListSelector,
    regionsSelector,
    regionSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    regionLevelSelector,
    mapStyleSelector,
} from '#selectors';

import {
    getSanitizedIncidents,
    getGroupMethod,
    getGroupedIncidents,
} from '../../LossAndDamage/common';


import Visualizations from './Visualizations';
import Disasters from './Disasters';
import Demographics from './Demographics';
import CapacitiesAndResources from './CapacitiesAndResources';

import styles from './styles.scss';

const mapStateToProps = (state, props) => ({
    riskList: riskListSelector(state),
    lpGasCookList: lpGasCookListSelector(state),
    regions: regionsSelector(state),
    region: regionSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state, props),
    mapStyle: mapStyleSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setRiskList: params => dispatch(setRiskListAction(params)),
    setLpGasCookList: params => dispatch(setLpGasCookListAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
});

const wsEndpoint = process.env.REACT_APP_GEO_SERVER_URL || 'http://139.59.67.104:8004';

const requests = {
    riskRequest: {
        url: `${wsEndpoint}/risk_profile/Risk`,
        onMount: false,
        onSuccess: ({ response, props: { setRiskList } }) => {
            const { results: riskList } = response;
            setRiskList({ riskList });
        },
        // TODO: add schema
    },
    lpgasCookRequest: {
        url: `${wsEndpoint}/risk_profile/Newfile/lpgas_cook`,
        onMount: false,
        onSuccess: ({ response, props: { setLpGasCookList } }) => {
            const { data: lpGasCookList } = response;
            setLpGasCookList({ lpGasCookList });
        },
        // TODO: add schema
    },
    lossAndDamageRequest: {
        url: '/incident/',
        query: {
            expand: ['loss.peoples', 'wards'],
            limit: 12000,
            ordering: '-incident_on',
            lnd: true,
        },
        onMount: true,
        extras: {
            schemaName: 'incidentWithPeopleResponse',
        },
    },
};

const emptyList = [];
const emptyObject = {};


const isValidIncident = (
    { ward, district, municipality, province },
    { adminLevel, geoarea },
) => {
    switch (adminLevel) {
        case 1:
            return geoarea === province;
        case 2:
            return geoarea === district;
        case 3:
            return geoarea === municipality;
        case 4:
            return geoarea === ward;
        default:
            return false;
    }
};

const leftMenu = [
    {
        key: 'demographics',
        name: 'Demographics',
    },
    {
        key: 'disasters',
        name: 'Disasters',
    },
    {
        key: 'capacitiesAndResources',
        name: 'Capacitites and Resources',
    },
];

const leftMenuMap = listToMap(leftMenu, d => d.key, d => d.name);
const tabModifier = (key, name) => (
    <div className={styles.menuRender}>
        <Icon
            className={styles.firstIcon}
            name="chevronRight"
        />
        <span className={styles.content}>
            { name }
        </span>
        <Icon
            className={styles.secondIcon}
            name="cloudDownload"
        />
    </div>
);

const menuViews = {
    demographics: {
        component: Demographics,
    },
    disasters: {
        component: Disasters,
    },
    capacitiesAndResources: {
        component: CapacitiesAndResources,
    },
};
class DisasterProfile extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'demographics',
        };
    }

    handleTabClick = (activeTab) => {
        this.setState({ activeTab });
    };

    filterIncidents = (incidents = emptyList, regions, region) => {
        if (!region) {
            return incidents;
        }

        const sanitizedIncidents = getSanitizedIncidents(incidents, regions, {}).filter(
            params => (
                isNotDefined(region)
                    || isNotDefined(region.adminLevel)
                    || isValidIncident(params, region)
            ),
        );

        return sanitizedIncidents;
    }

    generateDataset = (incidents, region = emptyObject) => {
        if (!incidents || incidents.length <= 0) {
            return {
                // mapping: [],
                aggregatedStat: {},
            };
        }
        const groupFn = getGroupMethod(region.adminLevel);
        const regionGroupedIncidents = getGroupedIncidents(
            incidents,
            groupFn,
        );


        return {
            // mapping,
            aggregatedStat: regionGroupedIncidents[0],
        };
    }

    handleRegionInputChange = (region) => {
        this.props.setRegion({ region });
    }

    renderAggregatedStat = ({
        data = emptyObject,
        className,
    }) => (
        <div className={className}>
            { lossMetrics.map(metric => (
                <TextOutput
                    className={styles.statMetric}
                    key={metric.key}
                    label={metric.label}
                    value={data[metric.key]}
                    valueClassName={styles.value}
                    labelClassName={styles.label}
                    normal
                    isNumericValue
                    type="block"
                />
            ))}
        </div>
    )

    render() {
        const {
            riskList,
            lpGasCookList,
            requests: {
                lossAndDamageRequest: {
                    pending: lossAndDamageRequestPending,
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
            regionLevel,
            mapStyle,
            regions,
            region,
        } = this.props;

        const { activeTab } = this.state;

        const pending = lossAndDamageRequestPending !== undefined
            ? lossAndDamageRequestPending : true;

        const filteredIncidents = this.filterIncidents(
            lossAndDamageList,
            regions,
            region,
        );

        const dataset = this.generateDataset(filteredIncidents, region);
        const AggregatedStat = this.renderAggregatedStat;

        return (
            <>
                <Loading pending={pending} />
                <CommonMap
                    region={region}
                />
                <Page
                    leftContent={null}
                    mainContentClassName={styles.mainContainer}
                    mainContent={(
                        <>
                            <div className={styles.mainContainerContent}>
                                <div className={styles.leftSide}>
                                    <div className={
                                        _cs(styles.customContainer,
                                            styles.leftCustomContainer)
                                    }
                                    >
                                        <div className={styles.leftHeader}>
                                            header
                                        </div>
                                        <VerticalTabs
                                            tabs={leftMenuMap}
                                            active={activeTab}
                                            className={styles.leftContent}
                                            modifier={tabModifier}
                                            onClick={this.handleTabClick}
                                        />
                                    </div>
                                </div>
                                <div className={styles.rightSide}>
                                    <div className={_cs(styles.customContainer,
                                        styles.rightCustomContainer)}
                                    >
                                        <MultiViewContainer
                                            className={styles.menuItemContainer}
                                            views={menuViews}
                                            active={activeTab}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    rightContentClassName={styles.rightContainer}
                    rightContent={(
                        <RegionSelectInput
                            label="Select region"
                            className={styles.regionInput}
                            value={region}
                            onChange={this.handleRegionInputChange}
                        />
                    )}
                />
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(DisasterProfile);
