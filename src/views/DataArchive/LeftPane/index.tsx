import React from 'react';

import Header from './Header';
import Pollution from './Pollution';
import Earthquake from './Earthquake';
import MiniOption from './MiniOption';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {}
interface State {
    activeView: string;
    chosenOption: Options;
}


class LeftPane extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            activeView: 'data',
            chosenOption: undefined,
        };
    }

    public componentDidMount() {
        const { chosenOption } = this.context;
        this.setState({ chosenOption });
    }

    private handleDataButtonClick = () => {
        this.setState({ activeView: 'data' });
    }

    private handleVisualizationsButtonClick = () => {
        this.setState({ activeView: 'visualizations' });
    }

    private handleMiniOptionsClick = (miniOption: Options) => {
        this.setState({ chosenOption: miniOption, activeView: 'data' });
    }

    public render() {
        const { activeView, chosenOption } = this.state;
        const {
            handleOptionClick,
            data,
        }: DataArchiveContextProps = this.context;
        return (
            <div className={styles.leftPane}>
                <Header
                    handleDataButtonClick={this.handleDataButtonClick}
                    handleVisualizationsButtonClick={this.handleVisualizationsButtonClick}
                    dataCount={data ? data.length : 0}
                    activeView={activeView}
                    chosenOption={chosenOption}
                />
                <div className={styles.content}>
                    { chosenOption === 'Pollution' && activeView === 'data' && <Pollution /> }
                    { chosenOption === 'Earthquake' && activeView === 'data' && <Earthquake /> }
                </div>
                <MiniOption
                    handleMiniOptionsClick={this.handleMiniOptionsClick}
                    handleOptionClick={handleOptionClick || (() => {})}
                    chosenOption={chosenOption}
                />
            </div>
        );
    }
}

LeftPane.contextType = DataArchiveContext;
export default LeftPane;
