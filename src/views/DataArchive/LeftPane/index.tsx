import React from 'react';

import * as PageType from '#store/atom/page/types';

import Header from './Header';
import Pollution from './Pollution';
import MiniOption from './MiniOption';

import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {
    rainList: PageType.RealTimeRain[];
    riverList: PageType.RealTimeRiver[];
    earthquakeList: PageType.RealTimeEarthquake[];
    fireList: PageType.RealTimeFire[];
    pollutionList: PageType.RealTimePollution[];
    chosenOption: Options;
}
interface State {
    activeView: string;
    chosenOption: Options;
}


class LeftPane extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);
        const { chosenOption } = this.props;
        this.state = {
            activeView: 'data',
            chosenOption,
        };
    }

    private handleDataButtonClick = () => {
        this.setState({ activeView: 'data' });
    }

    private handleVisualizationsButtonClick = () => {
        this.setState({ activeView: 'visualizations' });
    }

    private handleMiniOptionsClick = (miniOption: Options) => {
        this.setState({ chosenOption: miniOption });
    }

    private getChosenData = (chosenOption: Options) => {
        const {
            rainList,
            riverList,
            earthquakeList,
            fireList,
            pollutionList,
        } = this.props;
        if (chosenOption === 'Rain') {
            return rainList;
        }
        if (chosenOption === 'River') {
            return riverList;
        }
        if (chosenOption === 'Earthquake') {
            return earthquakeList;
        }
        if (chosenOption === 'Fire') {
            return fireList;
        }
        if (chosenOption === 'Pollution') {
            return pollutionList;
        }
        return [];
    }

    public render() {
        const { activeView, chosenOption } = this.state;
        // const {
        //     chosenOption,
        // } = this.props;
        const chosenData = this.getChosenData(chosenOption);
        return (
            <div className={styles.leftPane}>
                <Header
                    handleDataButtonClick={this.handleDataButtonClick}
                    handleVisualizationsButtonClick={this.handleVisualizationsButtonClick}
                    dataCount={chosenData.length}
                    activeView={activeView}
                    chosenOption={chosenOption}
                />
                { chosenOption === 'Pollution' && activeView === 'data' && <Pollution data={chosenData} /> }
                <MiniOption
                    handleMiniOptionsClick={this.handleMiniOptionsClick}
                    chosenOption={chosenOption}
                />
            </div>
        );
    }
}

export default LeftPane;
