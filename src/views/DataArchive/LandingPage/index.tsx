import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

import RainIcon from '#resources/icons/Rain.svg';
import RiverIcon from '#resources/icons/Wave.svg';
import EarthquakeIcon from '#resources/icons/Earthquake.svg';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import FireIcon from '#resources/icons/Forest-fire.svg';

import Option from '../Option';

interface Props {
    handleOptionClick: Function;
}

class LandingPage extends React.PureComponent<Props> {
    private static propTypes = {
        handleOptionClick: PropTypes.func.isRequired,
    }

    public render() {
        const { handleOptionClick } = this.props;
        return (
            <div className={styles.initialPage}>

                <div className={styles.optionContainer}>
                    <div className={styles.mainTitle}>
                  Data Archive
                    </div>
                    <Option handleOptionClick={handleOptionClick} title="Rain" count={188} alt="rain" icon={RainIcon} />
                    <Option handleOptionClick={handleOptionClick} title="River" count={188} alt="rain" icon={RiverIcon} />
                    <Option handleOptionClick={handleOptionClick} title="Earthquake" count={188} alt="rain" icon={EarthquakeIcon} />
                    <Option handleOptionClick={handleOptionClick} title="Pollution" count={188} alt="rain" icon={PollutionIcon} />
                    <Option handleOptionClick={handleOptionClick} title="Fire" count={188} alt="rain" icon={FireIcon} />
                    <Option handleOptionClick={handleOptionClick} title="Landslide" count={188} alt="rain" icon={RainIcon} />
                </div>
            </div>
        );
    }
}


export default LandingPage;
