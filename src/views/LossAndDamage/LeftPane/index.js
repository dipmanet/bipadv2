import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    pending: PropTypes.bool,
};

const defaultProps = {
    className: undefined,
    pending: false,
};


export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showDetails: true,
        };
    }

    render() {
        const {
            className,
            lossAndDamageList,
            pending,
        } = this.props;

        const {
            showDetails,
        } = this.state;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showDetails}
                collapsedViewContainerClassName={styles.showDetailsButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <Button
                            className={styles.showDetailsButton}
                            onClick={this.handleShowDetailsButtonClick}
                            iconName={iconNames.chevronDown}
                            title="Show detilas"
                        />
                        <Spinner loading={pending} />
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.visualizationsContainer}
                expandedView={
                    <div className={styles.visualizations}>
                        All the viz goes here
                    </div>
                }
            />
        );
    }
}
