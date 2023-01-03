/* eslint-disable no-nested-ternary */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import nextArrow from '#resources/icons/next.png';
import previousArrow from '#resources/icons/previous.png';
import styles from './styles.scss';

const FooterButton = ({ data, selectedCategory, onClick, lastPageId, firstPageId, language }) => {
    const sideViewData = [];
    const sideList = data.length && data.map(item => (
        item.childs.map(d => sideViewData.push(d))
    ));
    console.log('This is sidevoew data', sideViewData);
    return (
        <div className={selectedCategory === firstPageId
            ? styles.footerButton
            : selectedCategory === lastPageId
                ? _cs(styles.footerButton, styles.footerButtonLastPage)
                : _cs(styles.footerButton, styles.footerButtonPreview)}
        >
            {sideViewData.length && sideViewData.map((item, i) => (
                selectedCategory !== firstPageId && selectedCategory === item.id ? (
                    <div key={item.id}>
                        <button type="button" onClick={() => onClick(sideViewData[i - 1].parent, sideViewData[i - 1].id)}>
                            <img src={previousArrow} alt="previous" />
                            <span className={styles.nextButtonText}>PREVIOUS</span>
                        </button>
                        <span className={styles.headingNext}>
                            {language === 'en' ? sideViewData[i - 1].nameEn : sideViewData[i - 1].nameNe}
                        </span>
                    </div>
                ) : ''
            ))
            }
            {sideViewData.length && sideViewData.map((item, i) => (
                selectedCategory !== lastPageId && selectedCategory === item.id
                    ? (
                        <div key={item.id}>
                            {console.log('This is parent', item.parent)}
                            <button type="button" onClick={() => onClick(sideViewData[i + 1].parent, sideViewData[i + 1].id)}>
                                <span className={styles.nextButtonText}>NEXT</span>
                                <img src={nextArrow} alt="next" />
                            </button>

                            <span className={styles.headingNext}>
                                {language === 'en' ? sideViewData[i + 1].nameEn : sideViewData[i + 1].nameNe}
                            </span>
                        </div>
                    ) : ''
            ))}


        </div>
    );
};

export default FooterButton;
