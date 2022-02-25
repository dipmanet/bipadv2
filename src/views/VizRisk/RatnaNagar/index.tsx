/* eslint-disable max-len */
import React, { useState } from 'react';
import Leftpane1 from './Leftpanes/Leftpane1/index';
import Leftpane2 from './Leftpanes/Leftpane2/index';
import Leftpane3 from './Leftpanes/Leftpane3/index';
import Map from './Map/index';

export interface ScrollTopInitialValues{
    page1ScrolltopValue: number;
    page2ScrolltopValue: number;
    page3ScrolltopValue: number;
    page4ScrolltopValue: number;
    page5ScrolltopValue: number;
    page6ScrolltopValue: number;
    page7ScrolltopValue: number;
    page8ScrolltopValue: number;
}

export interface PostionInitialValues{
    page1PositionValue: number;
    page2PositionValue: number;
    page3PositionValue: number;
    page4PositionValue: number;
    page5PositionValue: number;
    page6PositionValue: number;
    page7PositionValue: number;
    page8PositionValue: number;
}

export default function Ratnanagar() {
    const scrollTopPageInitialValues = {
        page1ScrolltopValue: 0,
        page2ScrolltopValue: 0,
        page3ScrolltopValue: 0,
        page4ScrolltopValue: 0,
        page5ScrolltopValue: 0,
        page6ScrolltopValue: 0,
        page7ScrolltopValue: 0,
        page8ScrolltopValue: 0,
    };

    const positionInitialValues = {
        page1PositionValue: 1,
        page2PositionValue: 1,
        page3PositionValue: 1,
        page4PositionValue: 1,
        page5PositionValue: 1,
        page6PositionValue: 1,
        page7PositionValue: 1,
        page8PositionValue: 1,
    };
    const [leftElement, setLeftElement] = useState<number>(0);
    const [scrollTopValuesPerPage, setScrollTopValuesPerPage] = useState<ScrollTopInitialValues>(scrollTopPageInitialValues);
    const [postionsPerPage, setPostionsPerPage] = useState<PostionInitialValues>(positionInitialValues);
    const onButtonClick = (item: number) => {
        setLeftElement(item);
    };
    console.log('left', scrollTopValuesPerPage, postionsPerPage);

    return (
        <>
            {leftElement < 2 && <Map />}

            {leftElement === 0 && (
                <Leftpane1
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 1 && (
                <Leftpane2
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 2 && (
                <Leftpane3
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
        </>
    );
}
