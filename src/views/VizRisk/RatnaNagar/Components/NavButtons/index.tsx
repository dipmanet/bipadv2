/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable react/jsx-indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { PostionInitialValues } from '../..';
import styles from './styles.scss';
import BackButton from '../../../Common/Icons/back.svg';
import ForwardButton from '../../../Common/Icons/forward.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

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
	}, []);


	return (
		<div className={leftElement < 10 ? styles.pagination : styles.lastPagePagination}>
			<button
				type="submit"
				onClick={onPreviousClick}
				disabled={leftElement === 0 && postionsPerPage.page1PositionValue === 1}
				className={styles.previousNextButton}
			>
				<ScalableVectorGraphics
					className={styles.backButton}
					src={BackButton}
				/>
			</button>
			<div className={styles.numberContainer} ref={navRef}>
				{
					new Array(11).fill(0).map((_, indexNumber) => (
						<button
							// eslint-disable-next-line react/no-array-index-key
							key={indexNumber}
							className={leftElement === indexNumber ? styles.buttonFill : styles.button}
							onClick={() => onButtonClick(indexNumber)}
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
											strokeDashoffset: CIRCUMFERENCE * positionValuesInArray[indexNumber],
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
				disabled={postionsPerPage.page10PositionValue === 0 && leftElement === 10}
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
