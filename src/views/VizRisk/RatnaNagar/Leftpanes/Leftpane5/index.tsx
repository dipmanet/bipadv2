/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import LeftpaneSlide5 from '../../Components/LeftPaneSlides/LeftpaneSlide5';
import Navbuttons from '../../Components/NavButtons/index';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props { }


function LeftPane5(props: Props) {
	const {
		leftElement,
		setLeftElement,
		scrollTopValuesPerPage,
		setScrollTopValuesPerPage,
		postionsPerPage,
		setPostionsPerPage,
		onButtonClick,
	} = useContext(MainPageDataContext);

	const articleRef = useRef() as React.MutableRefObject<HTMLDivElement>;

	useLayoutEffect(() => {
		const updateHeight = () => {
			const { clientHeight } = articleRef.current;
			if (!articleRef.current) return;
			const { scrollHeight } = articleRef.current;
			const { scrollTop } = articleRef.current;
			const percentage = scrollTop / (scrollHeight - clientHeight);
			setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page6ScrolltopValue: scrollTop });
			setPostionsPerPage({ ...postionsPerPage, page6PositionValue: Math.max(1 - percentage, 0) });
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
		articleRef.current.scrollTo(0, scrollTopValuesPerPage.page6ScrolltopValue);
	}, []);

	const onPreviousClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page6ScrolltopValue - 300,
			behavior: 'smooth',
		});

		if (postionsPerPage.page6PositionValue === (1 || NaN)) {
			setLeftElement(leftElement - 1);
		}
	};

	const onNextClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page6ScrolltopValue + 300,
			behavior: 'smooth',
		});

		if (postionsPerPage.page6PositionValue === 0) {
			setLeftElement(leftElement + 1);
		}
	};

	return (
		<>
			<div ref={articleRef} className={styles.mainLeftSlide}>
				<LeftpaneSlide5 />
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

export default LeftPane5;
