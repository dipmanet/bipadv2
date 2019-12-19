import React from 'react';

import Page from '#components/Page';

import mapLegendImage from '#resources/images/temperature-change-legend.png';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import SortableListView from '#rscv/SortableListView';

import Map from './Map';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import styles from './styles.scss';

interface Props {
}

interface State {
    activeView: string | undefined;
}


const LayerList = (p) => {
    const {
        activeLayers,
        setLayers,
    } = p;

    return (
        <div className={styles.layerList}>
            <h4 className={styles.heading}>
                Active layers
            </h4>
            <SortableListView
                className={styles.content}
                itemClassName={styles.activeLayerContainer}
                data={activeLayers}
                renderer={({ title }) => <div className={styles.activeLayer}>{title}</div>}
                rendererParams={(_, d) => ({
                    title: d.title,
                })}
                keySelector={d => d.id}
                onChange={setLayers}
            />
        </div>
    );
};

class RiskInfo extends React.PureComponent<Props, State> {
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
                    mainContent={(
                        <RiskInfoLayerContext.Consumer>
                            { LayerList }
                        </RiskInfoLayerContext.Consumer>
                    )}
                />
            </>
        );
    }
}

export default RiskInfo;
