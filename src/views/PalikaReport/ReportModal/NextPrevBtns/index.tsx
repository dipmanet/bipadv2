import React from 'react';
import styles from './styles.scss';

const NextPrevBtns = (props) => {
    const { handlePrevClick, handleNextClick, lastpage, firstpage } = props;

    const handleNClick = () => handleNextClick();
    const handlePClick = () => handlePrevClick();


    return (
        <div className={styles.btnContainer}>
            {!firstpage
                       && (
                           <button
                               type="button"
                               onClick={handlePClick}
                               className={styles.savebtn}
                           >
                       Previous
                           </button>
                       )

            }

            {!lastpage
            && (
                <button
                    type="button"
                    onClick={handleNClick}
                    className={styles.savebtn}
                >
                Next
                </button>
            )}
        </div>
    );
};

export default NextPrevBtns;
