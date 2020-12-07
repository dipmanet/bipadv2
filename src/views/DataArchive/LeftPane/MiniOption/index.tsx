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

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | undefined;

interface Props {
    handleMiniOptionsClick: Function;
    handleOptionClick: Function;
    chosenOption: Options;
}

const miniOptions = [
    { id: 'rain', option: 'Rain', alt: 'Rain', icon: RainIcon },
    { id: 'river', option: 'River', alt: 'River', icon: RiverIcon },
    { id: 'earthquake', option: 'Earthquake', alt: 'Earthquake', icon: EarthquakeIcon },
    { id: 'pollution', option: 'Pollution', alt: 'Pollution', icon: PollutionIcon },
];

const MiniOption = (props: Props) => {
    const { handleMiniOptionsClick, handleOptionClick, chosenOption } = props;
    return (
        <div
            className={styles.miniOption}
        >
            {miniOptions.map((miniOption) => {
                const { id, option, alt, icon } = miniOption;
                return (
                    <div
                        key={id}
                        role="presentation"
                        onClick={() => {
                            handleMiniOptionsClick(option);
                            handleOptionClick(option);
                        }}
                        className={_cs(styles.option, chosenOption === option && styles.active)}
                    >
                        <ScalableVectorGraphics
                            className={styles.optionIcon}
                            src={icon}
                            alt={alt}
                        />
                        {option}
                    </div>
                );
            })}
        </div>
    );
};

export default MiniOption;
