/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { _cs } from '@togglecorp/fujs';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ibfPageSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';
import styles from './styles.scss';

const mapStateToProps = state => ({
    ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const ExistingRiskItem = (
    { data,
        isActiveHandler,
        isActive,
        setIbfPage,
        countActiveHandler,
        ibfPage },
) => {
    const { title, score, content } = data;
    console.log('content', content);

    const rangeStyle = {
        backgroundColor: '#1AD167',
        height: '12px',
        width: `${score * 10}%`,
        borderRadius: '50px',
    };

    const setSelectedIndicator = (indicatorValue) => {
        setIbfPage({ selectedIndicator: indicatorValue });
        setIbfPage({ selectedLegend: '' });
    };

    const clickHandler = () => {
        if (!isActive) {
            const arrayDS = [data];
            isActiveHandler(arrayDS);
            countActiveHandler(true);
            const defaultIndicatorValue = content[0].value;
            setSelectedIndicator(defaultIndicatorValue);
        }
    };


    return (
        <div className={styles.existingRiskItemContainer}>
            <div className={styles.contentContainer}>
                <button
                    type="button"
                    className={styles.titleBtn}
                    onClick={clickHandler}
                >
                    {title}
                </button>
                <div className={styles.barScore}>
                    <div className={styles.bar}>
                        <div style={rangeStyle} />
                    </div>
                    <div className={styles.scoreValue}>{score ? score.toFixed(2) : ''}</div>
                </div>
            </div>
            {isActive && (
                <ul className={styles.listContainer}>
                    {
                        content.map(contentItem => (
                            <li
                                className={_cs(contentItem.value === ibfPage.selectedIndicator
                                    ? styles.listActive
                                    : styles.list)}
                                key={contentItem.key}
                            >
                                <button
                                    className={
                                        styles.listBtn
                                    }
                                    type="button"
                                    onClick={() => setSelectedIndicator(contentItem.value)}
                                >
                                    {contentItem.key}
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingRiskItem);
