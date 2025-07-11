import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import Navbuttons from "../../Components/NavButtons/index";
import styles from "./styles.module.scss";
import { MainPageDataContext } from "../../context";
import LeftpaneSlide1 from "../../Components/LeftPaneSlides/LeftpaneSlide1";

function LeftPane1() {
	const {
		leftElement,
		setLeftElement,
		scrollTopValuesPerPage,
		setScrollTopValuesPerPage,
		postionsPerPage,
		setPostionsPerPage,
		onButtonClick,
		setCurrentHeaderVal,
		setNavIdleStatus,
	} = useContext(MainPageDataContext);

	const articleRef = useRef() as React.MutableRefObject<HTMLDivElement>;

	useLayoutEffect(() => {
		const updateHeight = () => {
			const { clientHeight } = articleRef.current;
			if (!articleRef.current) return;
			const { scrollHeight } = articleRef.current;
			const { scrollTop } = articleRef.current;
			const percentage = scrollTop / (scrollHeight - clientHeight);
			setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page1ScrolltopValue: scrollTop });
			setPostionsPerPage({ ...postionsPerPage, page1PositionValue: Math.max(1 - percentage, 0) });
		};
		setCurrentHeaderVal("");
		updateHeight();
		if (articleRef.current) {
			articleRef.current.addEventListener("scroll", updateHeight);
		}
		return () => {
			if (articleRef.current) {
				articleRef.current.removeEventListener("scroll", updateHeight);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		articleRef.current.scrollTo(0, scrollTopValuesPerPage.page1ScrolltopValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onPreviousClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page1ScrolltopValue - 300,
			behavior: "smooth",
		});
		if (postionsPerPage.page1PositionValue === 1) {
			setLeftElement(leftElement - 1);
			setNavIdleStatus(false);
		}
	};

	const onNextClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page1ScrolltopValue + 300,
			behavior: "smooth",
		});

		if (postionsPerPage.page1PositionValue === 0) {
			setLeftElement(leftElement + 1);
			setNavIdleStatus(false);
		}
	};

	return (
		<>
			<div ref={articleRef} className={styles.mainLeftSlide}>
				<LeftpaneSlide1 />
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

export default LeftPane1;
