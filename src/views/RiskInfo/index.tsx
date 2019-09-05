import React from 'react';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import RightPane from './RightPane';
import styles from './styles.scss';

interface Props {
}

interface State {
}

export default class RiskInfo extends React.PureComponent<Props, State> {
    public render() {
        return (
            <>
                <Map />
                <Page
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                        />
                    )}
                    rightContent={(
                        <RightPane />
                    )}
                />
            </>
        );
    }
}
