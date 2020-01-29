import React from 'react';

import Page from '#components/Page';

import LeftPane from './LeftPane';
import RiskInfoMap from './Map';
import RightPane from './RightPane';
import ActiveLayers from './ActiveLayers';

import styles from './styles.scss';

interface Props {
}

class RiskInfo extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <RiskInfoMap />
                <Page
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane className={styles.leftPane} />
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
