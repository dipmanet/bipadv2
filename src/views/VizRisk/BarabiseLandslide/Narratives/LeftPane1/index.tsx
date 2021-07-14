import React from 'react';
import styles from './styles.scss';
import NavButtons from '#views/VizRisk/Common/NavButtons';

interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}
const LeftPane1 = (props: Props) => {
    const { pending,
        totalPages,
        pagenumber,
        handleNext,
        handlePrev } = props;

    return (
        <div className={styles.vrSideBar}>
            <h1>
               Landslide in Nepal
            </h1>
            <p>
            Nepal’s rugged topography and recurring heavy monsoon
            rainfall patterns lead to a number of geological and
            hydro-meteorological hazards every year. Landslide is
            one of the most occurring and impactful among these natural
            hazards.
            </p>
            <p>
            The highest number of incidents is concentrated in Central
            Nepal and most of the deaths and loss has been higher in
            hills as compared to terai and mountain regions.
            As of now, a total of 2,253 landslide incidents have been
            recorded since 2011 with a loss of 1,226 lives altogether.
            </p>
        </div>

    );
};

export default LeftPane1;
