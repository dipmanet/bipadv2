import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

const NextPrevBtns = (props) => {
    const { handlePrevClick, handleNextClick, lastpage, firstpage } = props;

    const handleNClick = () => handleNextClick();
    const handlePClick = () => handlePrevClick();


    return (
        <div className={styles.btnContainer}>
            {/* {!firstpage
                       && (
                           <button
                               type="button"
                               onClick={handlePClick}
                               className={styles.savebtn}
                           >
                       Previous
                           </button>
                       )

            } */}

            {!lastpage
            && (
                <button
                    type="button"
                    onClick={handleNClick}
                    className={styles.savebtn}
                >
                    <Icon
                        name="plus"
                        className={styles.plusIcon}
                    />
                Save and Continue
                </button>
            )}
        </div>
    );
};

export default NextPrevBtns;
