/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PostionInitialValues, ScrollTopInitialValues } from '../..';
import LeftpaneSlide7 from '../../Components/LeftpaneSlide7';
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

function LeftPane7(props: Props) {
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
            setScrollTopValuesPerPage({ ...scrollTopValuesPerPage, page7ScrolltopValue: scrollTop });
            setPostionsPerPage({ ...postionsPerPage, page7PositionValue: Math.max(1 - percentage, 0) });
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
        articleRef.current.scrollTo(0, scrollTopValuesPerPage.page7ScrolltopValue);
    }, []);

    const onPreviousClick = () => {
        articleRef.current.scrollTo({ top: scrollTopValuesPerPage.page7ScrolltopValue - 300,
            behavior: 'smooth' });

        if (postionsPerPage.page7PositionValue === (1 || NaN)) {
            setLeftElement(leftElement - 1);
        }
    };

    const onNextClick = () => {
        articleRef.current.scrollTo({ top: scrollTopValuesPerPage.page7ScrolltopValue + 300,
            behavior: 'smooth' });

        if (postionsPerPage.page7PositionValue === 0) {
            setLeftElement(leftElement + 1);
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
