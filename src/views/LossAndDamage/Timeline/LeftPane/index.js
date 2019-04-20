import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import CollapsibleView from '#components/CollapsibleView';
import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';
import { iconNames } from '#constants';

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

    renderHeader = () => (
        <header className={styles.header}>
            <h3 className={styles.heading}>
                Summary
            </h3>
            <Spinner
                className={styles.spinner}
                loading={this.props.pending}
            />
            <Button
                className={styles.showDetailsButton}
                onClick={this.handleShowDetailsButtonClick}
                iconName={iconNames.expand}
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
        } = this.props;

        const { isExpanded } = this.state;
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
                        Show overview
                    </Button>
                }
                expandedViewContainerClassName={styles.overviewContainer}
                expandedView={
                    <React.Fragment>
                        <Header />
                        <div className={styles.content}>
                                Stats? Visualizations?
                        </div>
                    </React.Fragment>
                }
            />
        );
    }
}
