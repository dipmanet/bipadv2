import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import Gt from '../../../utils';
import Translations from '../../../Translations';

const NextPrevBtns = (props) => {
    const { handlePrevClick, handleNextClick, lastpage, firstpage, disabled } = props;

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
                    disabled={disabled}
                >
                    <Icon
                        name="plus"
                        className={styles.plusIcon}
                    />
                    <Gt
                        section={Translations.SaveContinue}
                    />

                </button>
            )}
        </div>
    );
};

export default NextPrevBtns;
