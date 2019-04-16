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
    showDetails: PropTypes.bool,
};

const defaultProps = {
    distance: 0,
    showDetails: false,
    inventories: [],
};

const emptyObject = {};

const inventoryToTextOutput = inventory => (
    <TextOutput
        key={inventory.id}
        label={inventory.item.title}
        value={`${inventory.quantity} ${inventory.item.unit}`}
    />
);

export default class ResourceItem extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    handleShareButton = () => {
    }

    renderDetails = () => {
        const { resourceType, inventories } = this.props;
        const attrs = resourceAttributes[resourceType] || [];
        return (
            <React.Fragment>
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
                <div className={styles.hr} />
                { inventories.length > 0 && (<div> <b> Inventories </b> </div>) }
                {inventories.map(inventoryToTextOutput)}
            </React.Fragment>
        );
    }

    render() {
        const {
            className,
            title,
            distance,
            contactNumber = '911',
            showDetails,
            // FIXME: point = emptyobject is a hack. point should be present
            // due to mapbox stringifying objects and so on
            point: {
                coordinates,
            } = emptyObject,
        } = this.props;

        const googleLink = coordinates && `https://www.google.com/maps/?q=${coordinates[1]},${coordinates[0]}&ll=${coordinates[1]},${coordinates[0]}&=13z`;

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
                                    Get direction
                                </a>
                            </div>
                        )
                    }
                </div>
                {
                    showDetails && this.renderDetails()
                }
            </React.Fragment>
        );
    }
}
