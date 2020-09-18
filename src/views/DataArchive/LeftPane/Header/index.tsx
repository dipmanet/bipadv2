import React from 'react';

import {
    _cs,
} from '@togglecorp/fujs';

import Icon from '#rscg/Icon';
import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {
    activeView: string;
    chosenOption: Options;
    dataCount: number;
    handleDataButtonClick: () => void;
    handleVisualizationsButtonClick: () => void;
}

const Header = (props: Props) => {
    const {
        activeView,
        dataCount,
        chosenOption,
        handleDataButtonClick,
        handleVisualizationsButtonClick,
    } = props;
    return (
        <header className={styles.header}>
            <div className={styles.tabs}>
                <div
                    className={_cs(styles.tab, activeView === 'data' && styles.active)}
                    onClick={handleDataButtonClick}
                    role="presentation"
                >
                    <div className={styles.value}>
                        { dataCount }
                    </div>
                    <div className={styles.title}>
                        <div className={styles.text}>
                            {chosenOption}
                        </div>
                    </div>
                </div>
                <div
                    className={_cs(styles.tab, activeView === 'visualizations' && styles.active)}
                    role="presentation"
                    onClick={handleVisualizationsButtonClick}
                >
                    <Icon
                        className={styles.visualizationIcon}
                        name="bars"
                    />
                    <div className={styles.text}>
                        Visualizations
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
