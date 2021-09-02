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
        currentPage,
    } = props;

    return (
        <div className={styles.vrSideBar}>
            <h1>
               Landslide in Nepal
            </h1>
            {
                currentPage === 0
                && (
                    <>
                        <p>
                        Nepal’s rugged topography, active seismic
                        conditions and recurring heavy monsoon rainfall
                         patterns lead to a number of geological and
                         hydro-meteorological hazards every year.
                         Landslide is one of the most occurring and
                         impactful among these natural hazards leading
                         to a significant human and economic loss.
                        </p>
                        <p>
            The highest number of incidents is concentrated in Central
            Nepal.  Human and economic loss is predominant in higher hills and mountains regions.

            A total of
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
                    </>
                )}

            {
                currentPage === 1
                && (
                    <>
                        <p>

                Central Nepal faces a higher number of landslide
                incidents and fatalities due to the ever increasing
                and haphazard urbanization, growing population, change
                in land-use patterns and unmanaged infrastructure development
                activities such as road construction.
                        </p>
                        <p>


                Sindhupalchowk district, located in Central Nepal,
                faces incidents of landslides every year which causes
                loss of lives and infrastructures. Among the most affected
                municipalities in the district, Barhabise witnessed three
                major landslides in the year 2020 alone.
                        </p>
                    </>
                )
            }
        </div>

    );
};

export default LeftPane1;
