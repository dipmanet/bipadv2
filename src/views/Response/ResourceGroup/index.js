import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import ListView from '#rscv/List/ListView';

import Button from '#rsca/Button';

import ResourceItem from '../resources/ResourceItem';

import styles from './styles.scss';

const propTypes = {
    heading: PropTypes.string.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    // itemRenderer: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: undefined,
    // itemRenderer: null,
    data: [],
};

export default class ResourceGroup extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    static keySelector = (d, id) => `${d.title}-${id}`;

    constructor(props) {
        super(props);
        this.state = {
            showResources: false,
            showMore: true,
        };
    }

    getResourceElementRendererParams = (_, d) => d

    handleExpandToggleClick = () => {
        const { showResources } = this.state;
        this.setState({ showResources: !showResources });
    }

    handleShowMoreToggle = () => {
        const { showMore } = this.state;
        this.setState({ showMore: !showMore });
    }

    render() {
        const {
            heading,
            data,
            className,
            icon,
            // itemRenderer,
        } = this.props;

        const { showResources, showMore } = this.state;

        if (!data || data.length <= 0) {
            return null;
        }

        const displayData = showMore ? data.slice(0, 5) : data;

        const itemsCount = data.length;

        const buttonText = showResources ? 'Hide' : 'Expand';
        const showMoreText = showMore ? 'Show All' : 'Show Fewer';

        return (
            <div className={_cs(className, styles.resources)}>
                <div className={styles.header}>
                    <img
                        className={styles.icon}
                        src={icon}
                        alt={heading}
                    />
                    <h3 className={styles.heading}>
                        { heading } ({ itemsCount })
                    </h3>
                    <Button
                        onClick={this.handleExpandToggleClick}
                        type="button"
                    >
                        { buttonText }
                    </Button>
                </div>
                { showResources && (
                    <React.Fragment>
                        <ListView
                            className={styles.content}
                            data={displayData}
                            renderer={ResourceItem}
                            rendererParams={this.getResourceElementRendererParams}
                            keySelector={ResourceGroup.keySelector}
                        />
                        <Button
                            onClick={this.handleShowMoreToggle}
                            type="button"
                        >
                            { showMoreText }
                        </Button>
                    </React.Fragment>
                )
                }
            </div>
        );
    }
}
