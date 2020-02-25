import React from 'react';

import PageContext, { PageContextProps } from '#components/PageContext';


interface Props {
    className?: string;

    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    mainContent?: React.ReactNode;
    extraFilterContent?: React.ReactNode;

    leftContentContainerClassName?: string;
    rightContentContainerClassName?: string;
    mainContentContainerClassName?: string;
    extraFilterContentContainerClassName?: string;

    hideMap?: boolean;
    hideFilter?: boolean;
    hideLocationFilter?: boolean;
    hideHazardFilter?: boolean;
    hideDataRangeFilter?: boolean;
}

interface State {
}

export default class Page extends React.PureComponent<Props, State> {
    public componentDidMount() {
        const {
            hideMap: shouldHideMap,
            hideFilter: shouldHideFilter,
            hideLocationFilter: shouldHideLocationFilter,
            hideHazardFilter: shouldHideHazardFilter,
            hideDataRangeFilter: shouldHideDataRangeFilter,
        } = this.props;
        const {
            showMap,
            hideMap,
            showFilter,
            hideFilter,
            showLocationFilter,
            hideLocationFilter,
            showHazardFilter,
            hideHazardFilter,
            showDataRangeFilter,
            hideDataRangeFilter,
        } = this.context;


        this.transferContents(this.props, this.context);
        this.syncMapVisibility(shouldHideMap, hideMap, showMap);
        this.syncFilterVisibility(
            shouldHideFilter,
            hideFilter,
            showFilter,
            shouldHideLocationFilter,
            hideLocationFilter,
            showLocationFilter,
            shouldHideHazardFilter,
            hideHazardFilter,
            showHazardFilter,
            shouldHideDataRangeFilter,
            hideDataRangeFilter,
            showDataRangeFilter,
        );
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const {
            hideMap: shouldHideMap,
            hideFilter: shouldHideFilter,
            hideLocationFilter: shouldHideLocationFilter,
            hideHazardFilter: shouldHideHazardFilter,
            hideDataRangeFilter: shouldHideDataRangeFilter,
        } = nextProps;

        const {
            hideMap: prevShouldHideMap,
            hideFilter: prevShouldHideFilter,
            hideLocationFilter: prevShouldHideLocationFilter,
            hideHazardFilter: prevShouldHideHazardFilter,
            hideDataRangeFilter: prevShouldHideDataRangeFilter,
        } = this.props;

        const {
            showMap,
            hideMap,
            showFilter,
            hideFilter,
            showLocationFilter,
            hideLocationFilter,
            showHazardFilter,
            hideHazardFilter,
            showDataRangeFilter,
            hideDataRangeFilter,
        } = this.context;

        this.transferContents(nextProps, this.context);
        if (shouldHideMap !== prevShouldHideMap) {
            this.syncMapVisibility(shouldHideMap, hideMap, showMap);
        }

        if (shouldHideFilter !== prevShouldHideFilter
            || shouldHideLocationFilter !== prevShouldHideLocationFilter
            || shouldHideHazardFilter !== prevShouldHideHazardFilter
            || shouldHideDataRangeFilter !== prevShouldHideDataRangeFilter
        ) {
            this.syncFilterVisibility(
                shouldHideFilter,
                hideFilter,
                showFilter,
                shouldHideLocationFilter,
                hideLocationFilter,
                showLocationFilter,
                shouldHideHazardFilter,
                hideHazardFilter,
                showHazardFilter,
                shouldHideDataRangeFilter,
                hideDataRangeFilter,
                showDataRangeFilter,
            );
        }
    }

    public componentWillUnmount() {
        const { hideMap: shouldHideMap } = this.props;
        const { showMap } = this.context;

        if (shouldHideMap && showMap) {
            showMap();
        }
    }

    private syncMapVisibility = (
        shouldHideMap: boolean | undefined,
        hideMap?: PageContextProps['hideMap'],
        showMap?: PageContextProps['showMap'],
    ) => {
        if (shouldHideMap && hideMap) {
            hideMap();
        } else if (showMap) {
            showMap();
        }
    }

    private syncFilterVisibility = (
        shouldHideFilter: boolean | undefined,
        hideFilter: PageContextProps['hideFilter'],
        showFilter: PageContextProps['showFilter'],
        shouldHideHazardFilter: boolean | undefined,
        hideHazardFilter: PageContextProps['hideHazardFilter'],
        showHazardFilter: PageContextProps['showHazardFilter'],
        shouldHideLocationFilter: boolean | undefined,
        hideLocationFilter: PageContextProps['hideLocationFilter'],
        showLocationFilter: PageContextProps['showLocationFilter'],
        shouldHideDataRangeFilter: boolean | undefined,
        hideDataRangeFilter: PageContextProps['hideDataRangeFilter'],
        showDataRangeFilter: PageContextProps['showDataRangeFilter'],
    ) => {
        if (shouldHideFilter && hideFilter) {
            hideFilter();
        } else if (showFilter) {
            showFilter();
        }

        if (shouldHideLocationFilter && hideLocationFilter) {
            hideLocationFilter();
        } else if (showLocationFilter) {
            showLocationFilter();
        }

        if (shouldHideHazardFilter && hideHazardFilter) {
            hideHazardFilter();
        } else if (showHazardFilter) {
            showHazardFilter();
        }

        if (shouldHideDataRangeFilter && hideDataRangeFilter) {
            hideDataRangeFilter();
        } else if (showDataRangeFilter) {
            showDataRangeFilter();
        }
    }


    private transferContents = (props: Props, context: PageContextProps) => {
        const {
            setLeftContent,
            setRightContent,
            setFilterContent,
            setMainContent,
        } = context;

        const {
            leftContent = null,
            leftContentContainerClassName,
            rightContent = null,
            rightContentContainerClassName,
            mainContent = null,
            mainContentContainerClassName,
            extraFilterContent = null,
            extraFilterContentContainerClassName,
        } = props;

        if (setLeftContent) {
            setLeftContent(leftContent, leftContentContainerClassName);
        }

        if (setRightContent) {
            setRightContent(rightContent, rightContentContainerClassName);
        }

        if (setMainContent) {
            setMainContent(mainContent, mainContentContainerClassName);
        }

        if (setFilterContent) {
            setFilterContent(extraFilterContent, extraFilterContentContainerClassName);
        }
    }


    public render() {
        return null;
    }
}

Page.contextType = PageContext;
