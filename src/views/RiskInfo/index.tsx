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
    }

    public handleCarActive = (value: boolean) => {
        this.setState({ carActive: value });
    }

    public render() {
        const { carActive } = this.state;
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
                        />
                    )}
                    mainContentContainerClassName={styles.mainContent}
                    // mainContent={(
                    //     <ActiveLayers className={styles.activeLayerList} />
                    // )}
                    mainContent={carActive ? (<CapacityAndResourcesLegend />)
                        : (<ActiveLayers className={styles.activeLayerList} />)}
                />
            </>
        );
    }
}

export default RiskInfo;
