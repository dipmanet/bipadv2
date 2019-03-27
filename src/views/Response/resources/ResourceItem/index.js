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
    contactNumber: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    point: PropTypes.object.isRequired,
    resourceType: PropTypes.string.isRequired,
    inventories: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    distance: 0,
    inventories: [
        { type: 'health', name: 'X-Ray Machine', count: 50 },
        { type: 'health', name: 'MRI Machine', count: 5 },
        { type: 'health', name: 'Ultrasound Machine', count: 51 },
        { type: 'health', name: 'Ambulances', count: 10 },
    ],
};

const emptyObject = {};

const inventoryToTextOutput = inventory => (
    <TextOutput
        key={inventory.id}
        label={inventory.name}
        value={inventory.count}
    />
);

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
            contactNumber = '911',
            resourceType,
            inventories,
            // FIXME: point = emptyobject is a hack. point should be present
            // due to mapbox stringifying objects and so on
            point: {
                coordinates,
            } = emptyObject,
        } = this.props;

        const googleLink = coordinates && `https://www.google.com/maps/?q=${coordinates[1]},${coordinates[0]}&ll=${coordinates[1]},${coordinates[0]}&=13z`;

        const attrs = resourceAttributes[resourceType] || [];

        return (
            <React.Fragment>
                <div className={_cs(styles.resource, className)}>
                    <div className={styles.leftContainer}>
                        <div className={styles.title}>
                            { title }
                        </div>
                        <div className={styles.content}>
                            <DistanceOutput
                                value={distance / 1000}
                            />
                            <TextOutput
                                label={iconNames.telephone}
                                value={contactNumber}
                                iconLabel
                            />
                        </div>
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
                <div className={styles.attributes}>
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
                { inventories.length > 0 && (
                    <React.Fragment>
                        <div className={styles.hr} />
                        <div> <b> Inventories </b> </div>
                        {
                            inventories.map(inventoryToTextOutput)
                        }
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}
