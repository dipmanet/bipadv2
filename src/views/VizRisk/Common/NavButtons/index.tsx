import React from 'react';
import Icon from '#rscg/Icon';

import styles from './styles.scss';
import style from '#mapStyles/rasterStyle';

interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;
}

const NavButtons = (props: Props) => {
    const {
        handleNext,
        handlePrev,
        pagenumber,
        totalPages,
        pending,
    } = props;

    return (
        <div className={styles.navRow}>
            <div className={styles.pageIndicator}>
                Showing
                <span className={styles.currentPageColor}>
                    {pagenumber}
                </span>
                {'/'}
                <span className={styles.totPages}>
                    {totalPages}
                </span>
            </div>
            <div className={styles.navBtnCont}>
                <button
                    type="button"
                    onClick={handlePrev}
                    className={pagenumber === 1 ? styles.btnDisable : styles.navbutton}
                    disabled={pagenumber === 1}
                >
                   Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className={pagenumber === totalPages || pending === true
                        ? styles.btnDisable : styles.navbutton}
                    disabled={pagenumber === totalPages || pending === true}
                >
                  Next
                </button>

            </div>
        </div>
    );
};

export default NavButtons;
