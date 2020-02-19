import React from 'react';
import { RouteDetailElement } from '#types';

type SetContentFunction = (
    content: React.ReactNode | null,
    contentClassName?: string
) => void;

export interface PageContextProps {
    setLeftContent?: SetContentFunction;
    setRightContent?: SetContentFunction;
    setFilterContent?: SetContentFunction;
    setMainContent?: SetContentFunction;
    setActiveRouteDetails?: (activeRouteDetail: RouteDetailElement) => void;
    activeRouteDetails?: RouteDetailElement;
    hideMap?: () => void;
    showMap?: () => void;
}

export default React.createContext<PageContextProps>({});
