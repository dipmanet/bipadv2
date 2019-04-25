import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';

import CollapsibleView from '#components/CollapsibleView';
import LossDetails from '#components/LossDetails';

import Button from '#rsca/Button';
import { iconNames } from '#constants';


import Visualizations from './Visualizations';
import TabularView from './TabularView';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyList = [];

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            isExpanded: true,
            showTabularView: false,
        };
    }

    handleExpandChange = (isExpanded) => {
        this.setState({ isExpanded });

        const { onExpandChange } = this.props;
        if (onExpandChange) {
            onExpandChange(isExpanded);
        }
    }

    handleCollapseButtonClick = () => {
        this.handleExpandChange(false);
    }

    handleExpandButtonClick = () => {
        this.handleExpandChange(true);
    }

    handleShowTabularButtonClick = () => {
        this.setState({ showTabularView: !this.state.showTabularView });
    }

    renderHeader = () => (
        <header className={styles.header}>
            <h3 className={styles.heading}>
                Summary
            </h3>
            <Button
                className={styles.showTabularButton}
                onClick={this.handleShowTabularButtonClick}
                iconName={this.state.showTabularView ? iconNames.shrink : iconNames.expand}
                title="Show detailed view"
            />
            <Button
                className={styles.collapseButton}
                onClick={this.handleCollapseButtonClick}
                iconName={iconNames.chevronUp}
                title="Collapse overview"
                transparent
            />
        </header>
    )

    render() {
        const {
            className,
            lossAndDamageList = emptyList,
            pending,
            rightPaneExpanded,
        } = this.props;

        const {
            isExpanded,
            showTabularView,
        } = this.state;

        const Header = this.renderHeader;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={isExpanded}
                collapsedViewContainerClassName={styles.expandButtonContainer}
                collapsedView={
                    <Button
                        onClick={this.handleExpandButtonClick}
                        className={styles.expandButton}
                    >
                        Show summary
                    </Button>
                }
                expandedViewContainerClassName={styles.overviewContainer}
                expandedView={
                    <CollapsibleView
                        className={styles.overview}
                        expanded={showTabularView}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <React.Fragment>
                                <Header />
                                <div className={styles.content}>
                                    <LossDetails
                                        data={lossAndDamageList}
                                        minDate={this.props.minDate}
                                    />
                                    { !pending && (
                                        <Visualizations
                                            lossAndDamageList={lossAndDamageList}
                                        />
                                    ) }
                                </div>
                            </React.Fragment>
                        }
                        expandedViewContainerClassName={_cs(
                            styles.tabularContainer,
                            rightPaneExpanded && styles.rightPaneExpanded,
                        )}
                        expandedView={
                            <React.Fragment>
                                <Header />
                                <TabularView
                                    className={styles.table}
                                    lossAndDamageList={lossAndDamageList}
                                />
                            </React.Fragment>
                        }
                    />
                }
            />
        );
    }
}
