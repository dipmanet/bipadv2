import React from 'react';

import Page from '#components/Page';

import mapLegendImage from '#resources/images/temperature-change-legend.png';

import Map from './Map';
import LeftPane from './LeftPane';
import RightPane from './RightPane';
import styles from './styles.scss';

interface Props {
}

interface State {
    activeView: string | undefined;
}

export default class RiskInfo extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: undefined,
        };
    }

    private handleViewChange = (activeView: string | undefined) => {
        this.setState({ activeView });
    }

    public render() {
        const { activeView } = this.state;
        const mainContent = activeView === 'climate-change' ? (
            <div className={styles.legend}>
                <img
                    src={mapLegendImage}
                    alt="legend"
                />
            </div>
        ) : (
            <div />
        );

        return (
            <>
                { activeView !== 'climate-change' && <Map /> }
                <Page
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            onViewChange={this.handleViewChange}
                            className={styles.leftPane}
                        />
                    )}
                    rightContent={(
                        <RightPane />
                    )}
                    mainContentClassName={styles.mainContent}
                    mainContent={mainContent}
                />
            </>
        );
    }
}
