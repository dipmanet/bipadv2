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
const LeftPane2 = (props: Props) => {
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

export default LeftPane2;
