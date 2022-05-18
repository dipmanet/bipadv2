import React, { useContext, useEffect, useRef } from 'react';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import styles from './styles.scss';
import BackButton from '../../../Common/Icons/back.svg';
import ForwardButton from '../../../Common/Icons/forward.svg';
import { PostionInitialValues } from '../../interfaces';
import { MainPageDataContext } from '../../context';

interface Props {
    postionsPerPage: PostionInitialValues;
    onButtonClick: (item: number) => void;
    leftElement: number;
    onNextClick: () => void;
    onPreviousClick: () => void;
}

const Navbuttons = (props: Props) => {
    const {
        postionsPerPage,
        leftElement,
        onNextClick,
        onPreviousClick,
        onButtonClick,
    } = props;

    const {
        navIdleStatus,
    } = useContext(MainPageDataContext);
    const navRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const DIAMETER = 50;
    const STROKE_WIDTH = 3;
    const RADIUS = DIAMETER / 2 - STROKE_WIDTH / 2;
    const CIRCUMFERENCE = Math.PI * RADIUS * 2;

    const positionValuesInArray = [
        postionsPerPage.page1PositionValue,
        postionsPerPage.page2PositionValue,
        postionsPerPage.demographicPositionValue,
        postionsPerPage.page4PositionValue,
        postionsPerPage.page5PositionValue,
        postionsPerPage.page6PositionValue,
        postionsPerPage.page7PositionValue,
        postionsPerPage.page8PositionValue,
        postionsPerPage.page9PositionValue,
        postionsPerPage.page10PositionValue,
        postionsPerPage.page11PositionValue,
    ];

    useEffect(() => {
        if (leftElement > 5) {
            navRef.current.scrollTo(150, 0);
        }
    }, [leftElement, navRef]);


    return (
        <div className={leftElement < 9 ? styles.pagination : styles.lastPagePagination}>
            <button
                type="submit"
                onClick={onPreviousClick}
                disabled={(leftElement === 0 && postionsPerPage.page1PositionValue === 1)
                    || !navIdleStatus
                }
                className={styles.previousNextButton}
                style={{
                    cursor: ((leftElement === 0 && postionsPerPage.page1PositionValue === 1)
                        || !navIdleStatus
                    ) ? 'not-allowed' : 'pointer',
                }}
            >
                <ScalableVectorGraphics
                    className={styles.backButton}
                    src={BackButton}
                />
            </button>
            <div className={styles.numberContainer} ref={navRef}>
                {
                    new Array(10).fill(0).map((_, indexNumber) => (
                        <button
                            type="button"
                            // eslint-disable-next-line react/no-array-index-key
                            key={`Num-${indexNumber}`}
                            className={leftElement === indexNumber
                                ? styles.buttonFill : styles.button}
                            onClick={() => onButtonClick(indexNumber)}
                            disabled={!navIdleStatus}
                            style={{
                                cursor: !navIdleStatus
                                    ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {
                                <svg
                                    viewBox="0 0 50 50"
                                    width="35px"
                                    height="35px"
                                    className={styles.circleProgress}
                                >
                                    <circle
                                        cx={DIAMETER / 2}
                                        cy={DIAMETER / 2}
                                        r={RADIUS}
                                        fill="transparent"
                                        strokeWidth={STROKE_WIDTH}
                                        style={{
                                            strokeDasharray: CIRCUMFERENCE,
                                            strokeDashoffset: CIRCUMFERENCE
                                                * positionValuesInArray[indexNumber],
                                        }}
                                    />
                                </svg>
                            }
                            {indexNumber + 1}
                        </button>
                    ))
                }
            </div>
            <button
                type="submit"
                onClick={onNextClick}
                disabled={(postionsPerPage.page10PositionValue === 0 && leftElement === 9)
                    || !navIdleStatus
                }
                style={{
                    cursor: ((leftElement === 10 && postionsPerPage.page10PositionValue === 1)
                        || !navIdleStatus
                    ) ? 'not-allowed' : 'pointer',
                }}
                className={styles.previousNextButton}
            >
                <ScalableVectorGraphics
                    className={styles.backButton}
                    src={ForwardButton}
                />
            </button>
        </div>
    );
};
export default Navbuttons;
