import React from 'react';
import { _cs } from '@togglecorp/fujs';

import PageContext, { PageContextProps } from '#components/PageContext';

import styles from './styles.scss';

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
}

interface State {
}

export default class Page extends React.PureComponent<Props, State> {
    public componentDidMount() {
        const { hideMap: shouldHideMap } = this.props;
        const {
            showMap,
            hideMap,
        } = this.context;


        this.transferContents(this.props, this.context);
        this.syncMapVisibility(shouldHideMap, hideMap, showMap);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const { hideMap: shouldHideMap } = nextProps;
        const { hideMap: prevShouldHideMap } = this.props;

        const {
            showMap,
            hideMap,
        } = this.context;

        this.transferContents(nextProps, this.context);
        if (shouldHideMap !== prevShouldHideMap) {
            this.syncMapVisibility(shouldHideMap, hideMap, showMap);
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
