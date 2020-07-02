import React from 'react';

import {
    _cs,
} from '@togglecorp/fujs';
import styles from './styles.scss';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import RainIcon from '#resources/icons/Rain.svg';
import RiverIcon from '#resources/icons/Wave.svg';
import EarthquakeIcon from '#resources/icons/Earthquake.svg';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import FireIcon from '#resources/icons/Forest-fire.svg';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {
    handleMiniOptionsClick: Function;
    handleOptionClick: Function;
    chosenOption: Options;
}

class MiniOption extends React.PureComponent<Props> {
    public render() {
        const { handleMiniOptionsClick, handleOptionClick, chosenOption } = this.props;
        return (
            <div
                className={styles.miniOption}
            >
                <div
                    role="presentation"
                    onClick={() => {
                        handleMiniOptionsClick('Rain');
                        handleOptionClick('Rain');
                    }}
                    className={_cs(styles.option, chosenOption === 'Rain' && styles.active)}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={RainIcon}
                        alt="Rain"
                    />
                    Rain
                </div>
                <div
                    role="presentation"
                    onClick={() => {
                        handleMiniOptionsClick('River');
                        handleOptionClick('River');
                    }}
                    className={_cs(styles.option, chosenOption === 'River' && styles.active)}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={RiverIcon}
                        alt="River"
                    />
                    River
                </div>
                <div
                    role="presentation"
                    onClick={() => {
                        handleMiniOptionsClick('Earthquake');
                        handleOptionClick('Earthquake');
                    }}
                    className={_cs(styles.option, chosenOption === 'Earthquake' && styles.active)}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={EarthquakeIcon}
                        alt="Earthquake"
                    />
                    Earthquake
                </div>
                <div
                    role="presentation"
                    onClick={() => {
                        handleMiniOptionsClick('Pollution');
                        handleOptionClick('Pollution');
                    }}
                    className={_cs(styles.option, chosenOption === 'Pollution' && styles.active)}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={PollutionIcon}
                        alt="Pollution"
                    />
                    Pollution
                </div>
                <div
                    role="presentation"
                    onClick={() => {
                        handleMiniOptionsClick('Fire');
                        handleOptionClick('Fire');
                    }}
                    className={_cs(styles.option, chosenOption === 'Fire' && styles.active)}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={FireIcon}
                        alt="Fire"
                    />
                    Fire
                </div>
                <div
                    role="presentation"
                    // onClick={() => handleMiniOptionsClick('Rain')}
                    className={styles.option}
                >
                    <ScalableVectorGraphics
                        className={styles.optionIcon}
                        src={EarthquakeIcon}
                        alt="Landslide"
                    />
                    Landslide
                </div>
            </div>
        );
    }
}

export default MiniOption;
