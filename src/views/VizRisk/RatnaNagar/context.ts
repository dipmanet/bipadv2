import React from 'react';
import { PostionInitialValues, ScrollTopInitialValues } from './interfaces';

export const scrollTopPageInitialValues: ScrollTopInitialValues = {
    page1ScrolltopValue: 0,
    page2ScrolltopValue: 0,
    page4ScrolltopValue: 0,
    page5ScrolltopValue: 0,
    page6ScrolltopValue: 0,
    page7ScrolltopValue: 0,
    page8ScrolltopValue: 0,
    page9ScrolltopValue: 0,
    page10ScrolltopValue: 0,
    page11ScrolltopValue: 0,
    demographicScrolltopValue: 0,
};

export const positionInitialValues: PostionInitialValues = {
    page1PositionValue: 1,
    page2PositionValue: 1,
    page4PositionValue: 1,
    page5PositionValue: 1,
    page6PositionValue: 1,
    page7PositionValue: 1,
    page8PositionValue: 1,
    page9PositionValue: 1,
    page10PositionValue: 1,
    page11PositionValue: 1,
    demographicPositionValue: 1,
};

interface MainPageData {
    leftElement: number;
    setLeftElement: React.Dispatch<React.SetStateAction<number>>;
    scrollTopValuesPerPage: ScrollTopInitialValues;
    setScrollTopValuesPerPage: React.Dispatch<React.SetStateAction<ScrollTopInitialValues>>;
    postionsPerPage: PostionInitialValues;
    setPostionsPerPage: React.Dispatch<React.SetStateAction<PostionInitialValues>>;
    onButtonClick: (item: number) => void;
    keyValueJsonData: [];
    setCurrentHeaderVal: React.Dispatch<React.SetStateAction<string>>;
    keyValueHtmlData: [];
    disableNavRightBtn: boolean;
    disableNavLeftBtn: boolean;
}
const initialMainPageData: MainPageData = {
    leftElement: 1,
    setLeftElement: () => undefined,
    scrollTopValuesPerPage: scrollTopPageInitialValues,
    setScrollTopValuesPerPage: () => undefined,
    postionsPerPage: positionInitialValues,
    setPostionsPerPage: () => undefined,
    onButtonClick: () => undefined,
    keyValueJsonData: [],
    setCurrentHeaderVal: () => undefined,
    keyValueHtmlData: [],
    disableNavRightBtn: true,
    disableNavLeftBtn: true,

};

export const MainPageDataContext = React.createContext(initialMainPageData);
