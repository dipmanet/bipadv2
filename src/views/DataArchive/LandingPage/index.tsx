import React from 'react';
import styles from './styles.scss';

import icons from './icons';
import Option from '../Option';

interface View {
    id: string;
    title: string;
    alt: string;
    icon: string;
    count: number;
}

interface Props {
    handleOptionClick: Function;
}

// class LandingPage extends React.PureComponent<Props> {
const LandingPage = (props: Props) => {
    const { handleOptionClick } = props;
    const {
        RainIcon,
        RiverIcon,
        EarthquakeIcon,
        PollutionIcon,
        FireIcon,
    } = icons;

    const views: View[] = [
        { id: 'rain', title: 'Rain', alt: 'rain', icon: RainIcon, count: 188 },
        { id: 'river', title: 'River', alt: 'river', icon: RiverIcon, count: 188 },
        { id: 'earthquake', title: 'Earthquake', alt: 'earthquake', icon: EarthquakeIcon, count: 65 },
        { id: 'pollution', title: 'Pollution', alt: 'pollution', icon: PollutionIcon, count: 188 },
        { id: 'fire', title: 'Fire', alt: 'fire', icon: FireIcon, count: 188 },
        { id: 'landslide', title: 'Landslide', alt: 'landslide', icon: RainIcon, count: 188 },
    ];
    return (
        <div className={styles.initialPage}>
            <div className={styles.optionContainer}>
                <div className={styles.mainTitle}>
                Data Archive
                </div>
                {views.map((view) => {
                    const { id, title, alt, icon, count } = view;
                    return (
                        <Option
                            key={id}
                            handleOptionClick={handleOptionClick}
                            title={title}
                            alt={alt}
                            icon={icon}
                            count={count}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default LandingPage;
