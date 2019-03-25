import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import DistanceOutput from '#components/DistanceOutput';

import { iconNames } from '#constants';
import TextOutput from '#components/TextOutput';

import resourceAttributes from '../../resourceAttributes';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    point: PropTypes.object.isRequired,
};

const defaultProps = {
    distance: 0,
};

const emptyObject = {};

export default class ResourceItem extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    handleShareButton = () => {
    }

    render() {
        const {
            className,
            title,
            distance,
            resourceType,
            // FIXME: point = emptyobject is a hack. point should be present
            // due to mapbox stringifying objects and so on
            point: {
                coordinates,
            } = emptyObject,
        } = this.props;

        console.warn('RENDERER ITEM PROPS', this.props);

        const googleLink = coordinates && `https://www.google.com/maps/?q=${coordinates[1]},${coordinates[0]}&ll=${coordinates[1]},${coordinates[0]}&=13z`;

        const attrs = resourceAttributes[resourceType] || [];
        console.warn(attrs);

        return (
            <React.Fragment>
                <div className={_cs(styles.resource, className)}>
                    <div className={styles.leftContainer}>
                        <div className={styles.title}>
                            { title }
                        </div>
                        <DistanceOutput
                            value={distance / 1000}
                        />
                    </div>
                    {
                        googleLink && (
                            <div className={styles.rightContainer}>
                                <a
                                    className={styles.link}
                                    href={googleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className={iconNames.share} />
                                </a>
                            </div>
                        )
                    }
                </div>
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
            </React.Fragment>
        );
    }
}
