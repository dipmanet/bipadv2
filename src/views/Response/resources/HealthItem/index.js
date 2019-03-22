import React from 'react';
import PropTypes from 'prop-types';

import TextOutput from '#components/TextOutput';

import ResourceItem from '../ResourceItem';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object,
};

const defaultProps = {
    data: {},
};

const emptyObject = {};

export default class HealthItem extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    handleShareButton = () => {
    }

    render() {
        const {
            // FIXME: This strucure might be changed i.e: there might not be data
            data: rawdata,
            showDetails = true,

            ...commonProps
        } = this.props;

        let data;
        if (typeof (data) === 'string') {
            data = JSON.parse(rawdata);
        } else {
            data = rawdata;
        }

        const {
            location,
            contactPerson = 'KP Oli', // FIXME: Aesthetic purpose only
            noOfBeds = 100, // FIXME: Aesthetic purpose only
            noOfDoctors = 20, // FIXME: Aesthetic purpose only
            noOfNurses = 30, // FIXME: Aesthetic purpose only
            ...otherProperties
        } = data;


        return (
            <React.Fragment>
                <ResourceItem {...commonProps} />
                { showDetails && (
                    <div>
                        <TextOutput
                            className={styles.info}
                            label="Location"
                            value={location}
                        />
                        <TextOutput
                            className={styles.info}
                            label="Number Of Beds"
                            value={noOfBeds}
                        />
                        <TextOutput
                            className={styles.info}
                            label="Number of Doctors"
                            value={noOfDoctors}
                        />
                        <TextOutput
                            className={styles.info}
                            label="Number of Nurses"
                            value={noOfNurses}
                        />
                        <TextOutput
                            className={styles.info}
                            label="Contact Person"
                            value={contactPerson}
                        />
                    </div>)
                }
            </React.Fragment>
        );
    }
}
