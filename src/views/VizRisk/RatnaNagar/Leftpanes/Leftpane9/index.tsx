/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PostionInitialValues, ScrollTopInitialValues } from '../..';
import LeftpaneSlide9 from '../../Components/LeftpaneSlide9';
import Navbuttons from '../../Components/NavButtons/index';
import styles from './styles.scss';

export interface Props {
	leftElement: number;
	setLeftElement: React.Dispatch<React.SetStateAction<number>>;
	scrollTopValuesPerPage: ScrollTopInitialValues;
	setScrollTopValuesPerPage: React.Dispatch<React.SetStateAction<ScrollTopInitialValues>>;
	postionsPerPage: PostionInitialValues;
	setPostionsPerPage: React.Dispatch<React.SetStateAction<PostionInitialValues>>;
	onButtonClick: (item: number) => void;
}

function LeftPane9(props: Props) {
	const {
		leftElement,
		setLeftElement,
		scrollTopValuesPerPage,
		setScrollTopValuesPerPage,
		postionsPerPage,
		setPostionsPerPage,
		onButtonClick,
	} = props;

	const articleRef = useRef() as React.MutableRefObject<HTMLDivElement>;

	useLayoutEffect(() => {
		const updateHeight = () => {
			const { clientHeight } = articleRef.current;
			if (!articleRef.current) return;
			const { scrollHeight } = articleRef.current;
			const { scrollTop } = articleRef.current;
			const percentage = scrollTop / (scrollHeight - clientHeight);
			setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page10ScrolltopValue: scrollTop });
			setPostionsPerPage({ ...postionsPerPage, page10PositionValue: Math.max(1 - percentage, 0) });
			console.log('scrollTop Val is', scrollTop, clientHeight, scrollHeight);
		};
		updateHeight();
		if (articleRef.current) {
			articleRef.current.addEventListener('scroll', updateHeight);
		}
		return () => {
			if (articleRef.current) {
				articleRef.current.removeEventListener('scroll', updateHeight);
			}
		};
	}, []);


	useEffect(() => {
		articleRef.current.scrollTo(0, scrollTopValuesPerPage.page10ScrolltopValue);
	}, []);

	const onPreviousClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page10ScrolltopValue - 300,
			behavior: 'smooth',
		});

		if (postionsPerPage.page10PositionValue === (1 || NaN)) {
			setLeftElement(leftElement - 1);
		}
	};

	const onNextClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page10ScrolltopValue + 300,
			behavior: 'smooth',
		});

		if (postionsPerPage.page10PositionValue === 0) {
			setLeftElement(leftElement + 1);
		}
	};

	return (
		<>
			<div ref={articleRef} className={styles.mainLeftSlide}>
				<LeftpaneSlide9 />
				<Navbuttons
					postionsPerPage={postionsPerPage}
					leftElement={leftElement}
					onPreviousClick={onPreviousClick}
					onNextClick={onNextClick}
					onButtonClick={onButtonClick}
				/>
			</div>
		</>
	);
}

export default LeftPane9;
