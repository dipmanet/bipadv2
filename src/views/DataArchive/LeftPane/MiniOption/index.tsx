import React from 'react';

import {
    _cs,
} from '@togglecorp/fujs';
import { connect } from 'react-redux';
import styles from './styles.scss';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import RainIcon from '#resources/icons/Rain.svg';
import RiverIcon from '#resources/icons/Wave.svg';
import EarthquakeIcon from '#resources/icons/Earthquake.svg';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import { checkPermission } from '#views/DataArchive/utils';

import {
    userSelector,
} from '#selectors';
import { AppState } from '#types';
import { User } from '#store/atom/auth/types';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | undefined;

interface Props {
    handleMiniOptionsClick: Function;
    handleOptionClick: Function;
    chosenOption: Options;
    user: User;
}
const mapStateToProps = (state: AppState) => ({
    user: userSelector(state),
});


// const miniOptions = [
//     { id: 'rain', option: 'Rain', alt: 'Rain', icon: RainIcon },
//     { id: 'river', option: 'River', alt: 'River', icon: RiverIcon },
//     { id: 'earthquake', option: 'Earthquake', alt: 'Earthquake', icon: EarthquakeIcon },
//     { id: 'pollution', option: 'Pollution', alt: 'Pollution', icon: PollutionIcon },
// ];

const MiniOption = (props: Props) => {
    const { handleMiniOptionsClick, handleOptionClick, chosenOption, user } = props;
    // const rainPermission = checkPermission(user, 'view_rain', 'realtime');
    // const riverPermission = checkPermission(user, 'view_river', 'realtime');

    const miniOptions = [
        { id: 'earthquake', option: 'Earthquake', alt: 'Earthquake', icon: EarthquakeIcon },
        { id: 'pollution', option: 'Pollution', alt: 'Pollution', icon: PollutionIcon },
    ];

    // if (rainPermission) {
    //     miniOptions.push({ id: 'rain', option: 'Rain', alt: 'Rain', icon: RainIcon });
    // }
    // if (riverPermission) {
    //     miniOptions.push({ id: 'river', option: 'River', alt: 'River', icon: RiverIcon });
    // }
    if (user) {
        miniOptions.push({ id: 'rain', option: 'Rain', alt: 'Rain', icon: RainIcon });
    }
    if (user) {
        miniOptions.push({ id: 'river', option: 'River', alt: 'River', icon: RiverIcon });
    }
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

export default connect(mapStateToProps)(MiniOption);
