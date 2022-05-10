/* eslint-disable max-len */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import DemographicSlide from '../../Components/LeftPaneSlides/DemographicSlide';
import Navbuttons from '../../Components/NavButtons/index';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props { }
function Demographic(props: Props) {
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
            setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, demographicScrolltopValue: scrollTop });
            setPostionsPerPage({ ...postionsPerPage, demographicPositionValue: Math.max(1 - percentage, 0) });
        };
        setCurrentHeaderVal('Demographics');
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
        articleRef.current.scrollTo(0, scrollTopValuesPerPage.demographicScrolltopValue);
    }, [articleRef, scrollTopValuesPerPage.demographicScrolltopValue]);

    const onPreviousClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.demographicScrolltopValue - 300,
            behavior: 'smooth',
        });
        if (postionsPerPage.demographicPositionValue === 1) {
            setLeftElement(leftElement - 1);
        }
    };

    const onNextClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.demographicScrolltopValue + 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.demographicPositionValue === 0) {
            setLeftElement(leftElement + 1);
        }
    };

    return (
        <>
            <div ref={articleRef} className={styles.mainLeftSlide}>
                <DemographicSlide />
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

export default Demographic;
