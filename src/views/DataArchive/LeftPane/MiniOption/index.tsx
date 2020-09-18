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

// class MiniOption extends React.PureComponent<Props> {
const MiniOption = (props: Props) => {
    const { handleMiniOptionsClick, handleOptionClick, chosenOption } = props;
    const miniOptions = [
        { id: 'rain', option: 'Rain', alt: 'Rain', icon: RainIcon },
        { id: 'river', option: 'River', alt: 'River', icon: RiverIcon },
        { id: 'earthquake', option: 'Earthquake', alt: 'Earthquake', icon: EarthquakeIcon },
        { id: 'pollution', option: 'Pollution', alt: 'Pollution', icon: PollutionIcon },
        { id: 'fire', option: 'Fire', alt: 'Fire', icon: FireIcon },
        // { id: 'landslide', option: 'Landslide', alt: 'Landslide', icon: RainIcon },
    ];
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
            {/*
                Add Landslide to minioptions once data is available
                Handle Onclicks as well
            */}
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
};

export default MiniOption;
