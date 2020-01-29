import React from 'react';

import Page from '#components/Page';

import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import {
    setHashToBrowser,
    getHashFromBrowser,
} from '#rscg/HashManager';

import MapSource from '#re-map/MapSource';

import { getRasterTile } from '#utils/domain';

import LeftPane from './LeftPane';
import RiskInfoMap from './Map';
import RightPane from './RightPane';
import ActiveLayers from './ActiveLayers';

import styles from './styles.scss';

interface Props {
}

interface State {
    activeView: string | undefined;
}

class RiskInfo extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: getHashFromBrowser(),
        };
    }

    private handleViewChange = (activeView: string | undefined) => {
        this.setState({ activeView });
        setHashToBrowser(activeView);
    }

    public render() {
        const { activeView } = this.state;

        const layer = {
            id: 32,
            layername: 'Pre-Monsoon 2014 Landslide',
        };

        return (
            <>
                <RiskInfoMap />
                <Page
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            onViewChange={this.handleViewChange}
                            className={styles.leftPane}
                        />
                    )}
                    mainContentClassName={styles.mainContent}
                    mainContent={(
                        <ActiveLayers className={styles.activeLayerList} />
                    )}
                />
            </>
        );
    }
}

export default RiskInfo;
