/* eslint-disable max-len */
import React, { useState } from 'react';
import Leftpane1 from './Leftpanes/Leftpane1/index';
import Leftpane2 from './Leftpanes/Leftpane2/index';
import Leftpane3 from './Leftpanes/Leftpane3/index';
import Leftpane4 from './Leftpanes/Leftpane4/index';
import Leftpane5 from './Leftpanes/Leftpane5/index';
import Leftpane6 from './Leftpanes/Leftpane6/index';
import Leftpane7 from './Leftpanes/Leftpane7/index';
import Leftpane8 from './Leftpanes/Leftpane8/index';
import Leftpane9 from './Leftpanes/Leftpane9/index';
import Leftpane10 from './Leftpanes/Leftpane10/index';
import Map from './Map/index';
import styles from './styles.scss';
import LeftTopBar from './Components/LeftTopBar';

export interface ScrollTopInitialValues{
    page1ScrolltopValue: number;
    page2ScrolltopValue: number;
    page3ScrolltopValue: number;
    page4ScrolltopValue: number;
    page5ScrolltopValue: number;
    page6ScrolltopValue: number;
    page7ScrolltopValue: number;
    page8ScrolltopValue: number;
    page9ScrolltopValue: number;
    page10ScrolltopValue: number;
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
    page9PositionValue: number;
    page10PositionValue: number;
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
        page9ScrolltopValue: 0,
        page10ScrolltopValue: 0,
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
        page9PositionValue: 1,
        page10PositionValue: 1,
    };


    const [leftElement, setLeftElement] = useState<number>(0);
    const [scrollTopValuesPerPage, setScrollTopValuesPerPage] = useState<ScrollTopInitialValues>(scrollTopPageInitialValues);
    const [postionsPerPage, setPostionsPerPage] = useState<PostionInitialValues>(positionInitialValues);
    const [clickedCiName, setclickedCiName] = useState<string[]>([]);
    const onButtonClick = (item: number) => {
        setLeftElement(item);
    };

    const handleCIClick = (ciName: string) => {
        setclickedCiName(prevState => [...prevState, ciName]);

        if (clickedCiName.includes(ciName)) {
            setclickedCiName(prevState => prevState.filter(ciItem => ciItem !== ciName));
        }
    };
    console.log('left', scrollTopValuesPerPage, postionsPerPage);

    console.log('clicked ci name is', clickedCiName);

    return (
        <>
            {
                leftElement < 9 && (
                    <>
                        <Map />
                        <LeftTopBar />
                    </>

                )
            }
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
                    clickedCiName={clickedCiName}
                    handleCIClick={handleCIClick}
                />
            )}
            {leftElement === 3 && (
                <Leftpane4
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}

                />
            )}
            {leftElement === 4 && (
                <Leftpane5
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 5 && (
                <Leftpane6
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 6 && (
                <Leftpane7
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 7 && (
                <Leftpane8
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 8 && (
                <Leftpane9
                    leftElement={leftElement}
                    setLeftElement={setLeftElement}
                    scrollTopValuesPerPage={scrollTopValuesPerPage}
                    setScrollTopValuesPerPage={setScrollTopValuesPerPage}
                    postionsPerPage={postionsPerPage}
                    setPostionsPerPage={setPostionsPerPage}
                    onButtonClick={onButtonClick}
                />
            )}
            {leftElement === 9 && (
                <Leftpane10
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
