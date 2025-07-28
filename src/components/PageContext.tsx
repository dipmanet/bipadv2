import React from "react";
import { RouteDetailElement } from "#types";

type SetContentFunction = (content: React.ReactNode | null, contentClassName?: string) => void;
type SetVisibilityFunction = () => void;

export interface PageContextProps {
	setLeftContent?: SetContentFunction;
	setRightContent?: SetContentFunction;
	setFilterContent?: SetContentFunction;
	setMainContent?: SetContentFunction;
	setActiveRouteDetails?: (activeRouteDetail: RouteDetailElement) => void;
	activeRouteDetails?: RouteDetailElement;
	hideMap?: SetVisibilityFunction;
	showMap?: SetVisibilityFunction;
	hideFilter?: SetVisibilityFunction;
	showFilter?: SetVisibilityFunction;
	showLocationFilter?: SetVisibilityFunction;
	hideLocationFilter?: SetVisibilityFunction;
	showHazardFilter?: SetVisibilityFunction;
	hideHazardFilter?: SetVisibilityFunction;
	showDataRangeFilter?: SetVisibilityFunction;
	hideDataRangeFilter?: SetVisibilityFunction;
}

// Name the context before exporting
const PageContext = React.createContext<PageContextProps>({});

export default PageContext;
