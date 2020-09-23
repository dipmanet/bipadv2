import React, { useState, useEffect, useContext } from 'react';

import Header from './Header';
import Pollution from './Pollution';
import Earthquake from './Earthquake';
import MiniOption from './MiniOption';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {}

const LeftPane = () => {
    const {
        handleOptionClick,
        data,
        chosenOption: chosenOptionContext,
    }: DataArchiveContextProps = useContext(DataArchiveContext);
    const [activeView, setActiveView] = useState('');
    const [chosenOption, setChosenOption] = useState<Options>(undefined);

    useEffect(() => {
        if (chosenOptionContext) {
            setActiveView('data');
            setChosenOption(chosenOptionContext);
        }
    }, [chosenOptionContext]);

    const handleDataButtonClick = () => {
        setActiveView('data');
    };

    const handleVisualizationsButtonClick = () => {
        setActiveView('visualizations');
    };

    const handleMiniOptionsClick = (miniOption: Options) => {
        setChosenOption(miniOption);
        setActiveView('data');
    };

    return (
        <div className={styles.leftPane}>
            {/* <Header
                handleDataButtonClick={handleDataButtonClick}
                handleVisualizationsButtonClick={handleVisualizationsButtonClick}
                dataCount={data ? data.length : 0}
                activeView={activeView}
                chosenOption={chosenOption}
            /> */}
            <div className={styles.content}>
                { chosenOption === 'Pollution' && activeView === 'data' && <Pollution /> }
                { chosenOption === 'Earthquake' && activeView === 'data' && <Earthquake /> }
            </div>
            <MiniOption
                handleMiniOptionsClick={handleMiniOptionsClick}
                handleOptionClick={handleOptionClick || (() => {})}
                chosenOption={chosenOption}
            />
        </div>
    );
};

export default LeftPane;
