/* eslint-disable max-len */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import LeftpaneSlide3 from '../../Components/LeftPaneSlides/LeftpaneSlide3';
import Navbuttons from '../../Components/NavButtons/index';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props {
    handleCIClick: (item: string) => void;
    clickedCiName: string[];
    cIData: any;
}

function LeftPane3(props: Props) {
    const {
        handleCIClick,
        clickedCiName,
        cIData,
    } = props;

    const {
        leftElement,
        setLeftElement,
        scrollTopValuesPerPage,
        setScrollTopValuesPerPage,
        postionsPerPage,
        setPostionsPerPage,
        onButtonClick,
        setCurrentHeaderVal,
    } = useContext(MainPageDataContext);

    const articleRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    useLayoutEffect(() => {
        const updateHeight = () => {
            const { clientHeight } = articleRef.current;
            if (!articleRef.current) return;
            const { scrollHeight } = articleRef.current;
            const { scrollTop } = articleRef.current;
            const percentage = scrollTop / (scrollHeight - clientHeight);
            setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page4ScrolltopValue: scrollTop });
            setPostionsPerPage({ ...postionsPerPage, page4PositionValue: Math.max(1 - percentage, 0) });
        };
        setCurrentHeaderVal('Critical Infrastructure');
        updateHeight();
        if (articleRef.current) {
            articleRef.current.addEventListener('scroll', updateHeight);
        }
        return () => {
            if (articleRef.current) {
                articleRef.current.removeEventListener('scroll', updateHeight);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        articleRef.current.scrollTo(0, scrollTopValuesPerPage.page4ScrolltopValue);
    }, [articleRef, scrollTopValuesPerPage.page4ScrolltopValue]);

    const onPreviousClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page4ScrolltopValue - 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.page4PositionValue === (1 || NaN)) {
            setLeftElement(leftElement - 1);
        }
    };

    const onNextClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page4ScrolltopValue + 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.page4PositionValue === 0) {
            setLeftElement(leftElement + 1);
        }
    };

    return (
        <>
            <div ref={articleRef} className={styles.mainLeftSlide}>
                <LeftpaneSlide3
                    handleCIClick={handleCIClick}
                    clickedCiName={clickedCiName}
                    cIData={cIData}
                />
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

export default LeftPane3;
