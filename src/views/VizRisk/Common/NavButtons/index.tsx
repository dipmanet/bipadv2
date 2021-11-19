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
    idle: boolean;
}

const NavButtons = (props: Props) => {
    const {
        handleNext,
        handlePrev,
        pagenumber,
        totalPages,
        pending,
        idle,
    } = props;

    return (
        <div className={styles.navRow}>
            <div className={styles.pageIndicator}>
                Showing
                <span className={styles.currentPageColor}>
                    {
                        pagenumber === 1
                    && '1'
                    }
                    {
                        pagenumber === 2
                    && '1'
                    }
                    {
                        pagenumber !== 2 && pagenumber !== 1
                    && (pagenumber - 1)
                    }
                </span>
                {'/'}
                <span className={styles.totPages}>
                    {totalPages - 1}
                </span>
            </div>
            <div className={styles.navBtnCont}>
                <button
                    type="button"
                    onClick={handlePrev}
                    className={(pagenumber === 1 || pending === true || idle === false)
                        ? styles.btnDisable
                        : styles.navbutton}
                    disabled={pagenumber === 1 || pending === true || idle === false}
                >
                   Previous
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className={pagenumber === totalPages || pending === true || idle === false
                        ? styles.btnDisable : styles.navbutton}
                    disabled={pagenumber === totalPages || pending === true || idle === false}
                >
                  Next
                </button>

            </div>
        </div>
    );
};

export default NavButtons;
