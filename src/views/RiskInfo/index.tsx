import React from 'react';

import Page from '#components/Page';

import LeftPane from './LeftPane';
import RiskInfoMap from './Map';
import ActiveLayers from './ActiveLayers';
import CapacityAndResourcesLegend from './LeftPane/Details/CapacityAndResources/Legend';

import styles from './styles.scss';

interface Props {
}

class RiskInfo extends React.PureComponent<Props> {
    public state = {
        carActive: false,
        resourceIdForLegend: null,
        activeLayersIndication: {
            education: false,
            health: false,
            finance: false,
            governance: false,
            tourism: false,
            cultural: false,
            industry: false,
            communication: false,
            openspace: false,
            communityspace: false,
        },
    }

    public handleCarActive = (value: boolean) => {
        this.setState({ carActive: value });
    }

    public handleActiveLayerIndication = (value: {}) => {
        this.setState({ activeLayersIndication: value });
    }

    public setResourceId = (id: number) => {
        this.setState({ resourceIdForLegend: id });
    }

    public render() {
        const { carActive, activeLayersIndication, resourceIdForLegend } = this.state;
        return (
            <>
                <RiskInfoMap />
                <Page
                    hideHazardFilter
                    hideDataRangeFilter
                    leftContentContainerClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                            handleCarActive={this.handleCarActive}
                            handleActiveLayerIndication={this.handleActiveLayerIndication}
                            setResourceId={this.setResourceId}
                        />
                    )}
                    mainContentContainerClassName={styles.mainContent}
                    // mainContent={(
                    //     <ActiveLayers className={styles.activeLayerList} />
                    // )}
                    mainContent={carActive ? (
                        <CapacityAndResourcesLegend
                            activeLayersIndication={activeLayersIndication}
                            resourceIdForLegend={resourceIdForLegend}
                        />
                    )
                        : (<ActiveLayers className={styles.activeLayerList} />)}
                />
            </>
        );
    }
}

export default RiskInfo;
