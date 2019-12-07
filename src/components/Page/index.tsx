import React from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';

import PageContext from '#components/PageContext';

import styles from './styles.scss';

interface Props {
    className?: string;

    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    mainContent?: React.ReactNode;

    leftContentClassName?: string;
    rightContentClassName?: string;
    mainContentClassName?: string;

    hideMap?: boolean;
}

interface State {
}

export default class Page extends React.PureComponent<Props, State> {
    public componentDidMount() {
        const { setLeftPaneComponent } = this.context;
        const {
            leftContent,
            leftContentClassName,
            hideMap,
        } = this.props;

        if (setLeftPaneComponent && (leftContent || leftContent === null)) {
            setLeftPaneComponent(leftContent, leftContentClassName);
        }

        if (hideMap && this.context.hideMap) {
            this.context.hideMap();
        } else if (this.context.showMap) {
            this.context.showMap();
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { setLeftPaneComponent } = this.context;
        const {
            leftContent,
            leftContentClassName,
            hideMap,
        } = nextProps;

        const { hideMap: oldHideMap } = this.props;

        if (setLeftPaneComponent && (leftContent || leftContent === null)) {
            setLeftPaneComponent(leftContent, leftContentClassName);
        }

        if (hideMap !== oldHideMap) {
            if (hideMap && this.context.hideMap) {
                this.context.hideMap();
            } else if (this.context.showMap) {
                this.context.showMap();
            }
        }
    }

    public componentWillUnmount() {
        const { hideMap } = this.props;

        if (hideMap && this.context.showMap) {
            this.context.showMap();
        }
    }

    public render() {
        const {
            rightContent,
            rightContentClassName,
            mainContent,
            mainContentClassName,
        } = this.props;

        return (
            <React.Fragment>
                { mainContent && (
                    <div className={_cs(styles.mainContent, mainContentClassName)}>
                        { mainContent }
                    </div>
                ) }
                { rightContent && (
                    <aside className={_cs(styles.rightContent, rightContentClassName)}>
                        { rightContent }
                    </aside>
                ) }
            </React.Fragment>
        );
    }
}

Page.contextType = PageContext;
