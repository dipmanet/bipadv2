import React from 'react';

import {
    _cs,
} from '@togglecorp/fujs';

import Icon from '#rscg/Icon';
import styles from './styles.scss';

type Options = 'Earthquake' | undefined;
type ActiveView = 'data' | 'visualizations' | 'charts';

interface Props {
    activeView: ActiveView;
    chosenOption: Options;
    dataCount: number;
    handleDataButtonClick: () => void;
    handleVisualizationsButtonClick: () => void;
    handleChartsButtonClick: () => void;
}

const Header = (props: Props) => {
    const {
        activeView,
        dataCount,
        chosenOption,
        handleDataButtonClick,
        handleVisualizationsButtonClick,
        handleChartsButtonClick,
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
                        Visualization
                    </div>
                </div>
                <div
                    className={_cs(styles.tab, activeView === 'charts' && styles.active)}
                    role="presentation"
                    onClick={handleChartsButtonClick}
                >
                    <Icon
                        className={styles.visualizationIcon}
                        name="bars"
                    />
                    <div className={styles.text}>
                        Chart
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
