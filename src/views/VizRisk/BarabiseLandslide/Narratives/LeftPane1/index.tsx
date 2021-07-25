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
    const {
        incidentsCount,
        livesLost,
    } = props;

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
            As of now, a total of
                { ' ' }
                { incidentsCount }
                { ' ' }
            landslide incidents have been
            recorded since 2011 with a loss of
                { ' ' }
                {livesLost}
                { ' ' }
            lives altogether.
            </p>
            <p>
            Central Nepal faces the most number of landslide
            incidents and fatalities due to the ever increasing and
            haphazard urbanization, growing population and unmanaged
            development activities.
            </p>
            <p>
            Sindhupalchowk district, located in Central Nepal,
            faces incidents of landslides every year which causes
            loss of lives and infrastructures. Among the most affected
            municipalities in the district, Barhabise witnessed 3 major
            landslides in the year 2020 alone.
            </p>
        </div>

    );
};

export default LeftPane1;
