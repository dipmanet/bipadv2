/* eslint-disable max-len */
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import LeftpaneSlide2 from '../../Components/LeftPaneSlides/LeftpaneSlide2';
import Navbuttons from '../../Components/NavButtons/index';
import { MainPageDataContext } from '../../context';
import styles from './styles.scss';

interface Props { }

function LeftPane2(props: Props) {
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
            setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page2ScrolltopValue: scrollTop });
            setPostionsPerPage({ ...postionsPerPage, page2PositionValue: Math.max(1 - percentage, 0) });
        };
        updateHeight();
        if (articleRef.current) {
            articleRef.current.addEventListener('scroll', updateHeight);
        }
        setCurrentHeaderVal('Landcover');
        return () => {
            if (articleRef.current) {
                articleRef.current.removeEventListener('scroll', updateHeight);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        articleRef.current.scrollTo(0, scrollTopValuesPerPage.page2ScrolltopValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPreviousClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page2ScrolltopValue - 300,
            behavior: 'smooth',
        });
        if (postionsPerPage.page2PositionValue === 1) {
            setLeftElement(leftElement - 1);
            setNavIdleStatus(false);
        }
    };

    const onNextClick = () => {
        articleRef.current.scrollTo({
            top: scrollTopValuesPerPage.page2ScrolltopValue + 300,
            behavior: 'smooth',
        });

        if (postionsPerPage.page2PositionValue === 0) {
            setLeftElement(leftElement + 1);
            setNavIdleStatus(false);
        }
    };

    return (
        <>
            <div ref={articleRef} className={styles.mainLeftSlide}>
                <LeftpaneSlide2 />
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

export default LeftPane2;
