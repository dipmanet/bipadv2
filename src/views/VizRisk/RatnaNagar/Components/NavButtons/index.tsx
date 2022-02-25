/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
import React from 'react';
import { PostionInitialValues } from '../..';
import styles from './styles.scss';


interface Props {
    postionsPerPage: PostionInitialValues;
    onButtonClick: (item: number) => void;
    leftElement: number;
    onNextClick: () => void;
    onPreviousClick: () => void;
}

const index = (props: Props) => {
    const {
        postionsPerPage,
        leftElement,
        onNextClick,
        onPreviousClick,
        onButtonClick,
    } = props;

    const DIAMETER = 50;
    const STROKE_WIDTH = 3;
    const RADIUS = DIAMETER / 2 - STROKE_WIDTH / 2;
    const CIRCUMFERENCE = Math.PI * RADIUS * 2;

    console.log('nav left', leftElement);

    return (
        <div>
            <div className={styles.pagination}>
                <button
                    type="submit"
                    onClick={onPreviousClick}
                    disabled={leftElement === 0 && postionsPerPage.page1PositionValue === 1}
                    className={styles.previousNextButton}
                >
                    {/* <ArrowBackIcon /> */}
                        Previous
                </button>
                <div className={styles.numberContainer}>
                    <button
                        // type="submit"

                        className={leftElement === 0 ? styles.buttonFill : styles.button}
                        onClick={() => onButtonClick(0)}
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
                                        strokeDashoffset: CIRCUMFERENCE * postionsPerPage.page1PositionValue,
                                    }}
                                />
                            </svg>
                        }
            1
                    </button>
                    <button
                        className={leftElement === 1 ? styles.buttonFill : styles.button}
                        onClick={() => onButtonClick(1)}
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
                                        strokeDashoffset: CIRCUMFERENCE * postionsPerPage.page2PositionValue,
                                    }}
                                />
                            </svg>
                        }
            2
                    </button>
                    <button
                        className={leftElement === 2 ? styles.buttonFill : styles.button}
                        onClick={() => onButtonClick(2)}
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
                                        strokeDashoffset: CIRCUMFERENCE * postionsPerPage.page3PositionValue,
                                    }}
                                />
                            </svg>
                        }
            3
                    </button>


                    {' '}
                </div>
                <button
                    type="submit"
                    onClick={onNextClick}
                    disabled={postionsPerPage.page3PositionValue === 0 && leftElement === 2}
                    className={styles.previousNextButton}
                >
                    {/* <ArrowForwardIcon /> */}
Next
                </button>
            </div>
        </div>
    );
};
export default index;
