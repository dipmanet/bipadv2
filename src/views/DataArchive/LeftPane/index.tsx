import React, { useState, useEffect, useContext } from 'react';

import Rain from './Rain';
import River from './River';
import Pollution from './Pollution';
import Earthquake from './Earthquake';
import MiniOption from './MiniOption';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | undefined;

interface Props {}

const LeftPane = () => {
    const {
        handleOptionClick,
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

    const handleMiniOptionsClick = (miniOption: Options) => {
        setChosenOption(miniOption);
        setActiveView('data');
    };

    return (
        <div className={styles.leftPane}>
            <div className={styles.content}>
                { chosenOption === 'Rain' && activeView === 'data' && <Rain /> }
                { chosenOption === 'River' && activeView === 'data' && <River /> }
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
