import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import LeftpaneSlide5 from "../../Components/LeftPaneSlides/LeftpaneSlide5";
import Navbuttons from "../../Components/NavButtons/index";
import { MainPageDataContext } from "../../context";
import styles from "./styles.module.scss";

interface Props {}

function LeftPane5(props: Props) {
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
		setCurrentRechartsItem,
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
		};
		setCurrentRechartsItem("");
		setCurrentHeaderVal("Flood Hazard");
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
		articleRef.current.scrollTo(0, scrollTopValuesPerPage.page6ScrolltopValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onPreviousClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page6ScrolltopValue - 300,
			behavior: "smooth",
		});

		if (postionsPerPage.page6PositionValue === (1 || NaN)) {
			setLeftElement(leftElement - 1);
			setNavIdleStatus(false);
		}
	};

	const onNextClick = () => {
		articleRef.current.scrollTo({
			top: scrollTopValuesPerPage.page6ScrolltopValue + 300,
			behavior: "smooth",
		});

		if (postionsPerPage.page6PositionValue === 0) {
			setLeftElement(leftElement + 1);
			setNavIdleStatus(false);
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
