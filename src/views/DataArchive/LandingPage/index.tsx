import React, { useEffect, useState } from 'react';
import styles from './styles.scss';

import icons from './icons';
import Option from '../Option';

interface View {
    id: string;
    title: string;
    alt: string;
    icon: string;
    count: number | string;
}

interface Props {
    handleOptionClick: Function;
}

const getCount = (countObj: {
    [key in string]: { count: number };
}, element: string): (number | string) => (countObj[element] ? countObj[element].count : 'N/A');

const LandingPage = (props: Props) => {
    const [counts, setCounts] = useState({});

    const getDataCount = async () => {
        const endPoint = '/archive-meta/';
        const URL = `${process.env.REACT_APP_API_SERVER_URL}${endPoint}`;
        const response = await fetch(URL);
        response.json()
            .then(res => setCounts(res))
            .catch(err => console.warn('Cannot get counts !!!', err));
    };

    const { handleOptionClick } = props;
    const {
        RainIcon,
        RiverIcon,
        EarthquakeIcon,
        PollutionIcon,
        FireIcon,
    } = icons;

    useEffect(() => {
        getDataCount();
    }, []);

    const views: View[] = [
        { id: 'rain', title: 'Rain', alt: 'rain', icon: RainIcon, count: getCount(counts, 'rain') },
        { id: 'river', title: 'River', alt: 'river', icon: RiverIcon, count: getCount(counts, 'river') },
        { id: 'earthquake', title: 'Earthquake', alt: 'earthquake', icon: EarthquakeIcon, count: getCount(counts, 'earthquake') },
        { id: 'pollution', title: 'Pollution', alt: 'pollution', icon: PollutionIcon, count: getCount(counts, 'pollution') },
        { id: 'fire', title: 'Fire', alt: 'fire', icon: FireIcon, count: getCount(counts, 'fire') },
        { id: 'landslide', title: 'Landslide', alt: 'landslide', icon: RainIcon, count: getCount(counts, 'landslide') },
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
