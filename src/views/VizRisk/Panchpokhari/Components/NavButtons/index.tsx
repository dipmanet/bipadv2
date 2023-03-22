import React from 'react';
import Icon from '#rscg/Icon';

import style from '#mapStyles/rasterStyle';
import styles from './styles.scss';

interface Props {
    handleNext: () => void;
    handlePrev: () => void;
    disableNavLeftBtn: boolean;
    disableNavRightBtn: boolean;
    pagenumber: number;
    totalPages: number;
}

const NavButtons = (props: Props) => {
    const {
        handleNext,
        handlePrev,
        disableNavLeftBtn,
        disableNavRightBtn,
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
