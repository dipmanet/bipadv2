/* eslint-disable no-nested-ternary */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import nextArrow from '#resources/icons/next.png';
import previousArrow from '#resources/icons/previous.png';
import styles from './styles.scss';

const FooterButton = ({ data, selectedCategory, onClick, lastPageId, firstPageId }) => {
    const sideViewData = [];
    const sideList = data.map(item => (
        item.data.map(d => sideViewData.push(d))
    ));

    return (
        <div className={selectedCategory === firstPageId
            ? styles.footerButton
            : selectedCategory === lastPageId
                ? _cs(styles.footerButton, styles.footerButtonLastPage)
                : _cs(styles.footerButton, styles.footerButtonPreview)}
        >
            {sideViewData.map((item, i) => (
                selectedCategory !== firstPageId && selectedCategory === item.id ? (
                    <div key={item.id}>
                        <button type="button" onClick={() => onClick(sideViewData[i - 1].id)}>
                            <img src={previousArrow} alt="previous" />
                            <span className={styles.nextButtonText}>PREVIOUS</span>
                        </button>
                        <span className={styles.headingNext}>
                            {sideViewData[i - 1].nameEn}
                        </span>
                    </div>
                ) : ''
            ))
            }
            {sideViewData.map((item, i) => (
                selectedCategory !== lastPageId && selectedCategory === item.id
                    ? (
                        <div key={item.id}>
                            <button type="button" onClick={() => onClick(sideViewData[i + 1].id)}>
                                <span className={styles.nextButtonText}>NEXT</span>
                                <img src={nextArrow} alt="next" />
                            </button>

                            <span className={styles.headingNext}>
                                {sideViewData[i + 1].nameEn}
                            </span>
                        </div>
                    ) : ''
            ))}


        </div>
    );
};

export default FooterButton;
