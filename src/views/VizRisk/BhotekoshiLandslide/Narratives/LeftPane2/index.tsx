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
            Bhotekoshi Rural Municipality is located in Sindhupalchowk
             district of Bagmati province. The municipality has 5
             wards and covers an area of 278.31 sq.km and is situated
             in the altitude range of 1183 to 5371 m above sea level.
            </p>

        </div>

    );
};

export default LeftPane2;
