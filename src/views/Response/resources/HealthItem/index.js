import React from 'react';
import PropTypes from 'prop-types';

import TextOutput from '#components/TextOutput';

import ResourceItem from '../ResourceItem';

import resourceAttributes from '../../resourceAttributes';

import styles from './styles.scss';

const propTypes = {
    showDetails: PropTypes.bool,
    resourceType: PropTypes.string.isRequired,
};

const defaultProps = {
    showDetails: true,
};

export default class HealthItem extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    handleShareButton = () => {
    }

    render() {
        const {
            showDetails,
            resourceType,

            ...commonProps // {title, distance, point}
        } = this.props;

        const attrs = resourceAttributes[resourceType] || [];

        return (
            <React.Fragment>
                <ResourceItem {...commonProps} />
                { showDetails && (
                    <div>
                        {
                            attrs.map(x => (
                                <TextOutput
                                    key={x.key}
                                    className={styles.info}
                                    label={x.label}
                                    value={this.props[x.key]}
                                />
                            ))
                        }
                    </div>
                )}
            </React.Fragment>
        );
    }
}
