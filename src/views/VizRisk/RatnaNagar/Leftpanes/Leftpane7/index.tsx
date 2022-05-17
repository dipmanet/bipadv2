/* eslint-disable max-len */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import LeftpaneSlide7 from '../../Components/LeftPaneSlides/LeftpaneSlide7';
import Navbuttons from '../../Components/NavButtons/index';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props {

}

function LeftPane7(props: Props) {
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
            setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page8ScrolltopValue: scrollTop });
            setPostionsPerPage({ ...postionsPerPage, page8PositionValue: Math.max(1 - percentage, 0) });
        };
        setCurrentHeaderVal('Sensitivity');
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
        articleRef.current.scrollTo(0, scrollTopValuesPerPage.page8ScrolltopValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPreviousClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page8ScrolltopValue - 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.page8PositionValue === (1 || NaN)) {
            setLeftElement(leftElement - 1);
            setNavIdleStatus(false);
        }
    };

    const onNextClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page8ScrolltopValue + 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.page8PositionValue === 0) {
            setLeftElement(leftElement + 1);
            setNavIdleStatus(false);
        }
    };

    return (
        <>
            <div ref={articleRef} className={styles.mainLeftSlide}>
                <LeftpaneSlide7 />
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

export default LeftPane7;
