import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { _cs } from '@togglecorp/fujs';

import {
    regionSelector,
    // adminLevelListSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';

import styles from './styles.scss';

// const adminLevelKeySelector = d => d.id;
// const adminLevelLabelSelector = d => d.title;

const geoareaKeySelector = d => d.id;
const geoareaLabelSelector = d => d.title;

// const emptyObject = {};
const emptyArray = [];

const propTypes = {
    // adminLevelList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    value: {},
    className: undefined,
};

const mapStateToProps = state => ({
    // adminLevelList: adminLevelListSelector(state),
    value: regionSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});


@connect(mapStateToProps)
export default class RegionOutput extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    render() {
        const {
            value,
            // adminLevelList,

            provinces,
            districts,
            municipalities,
            className,
        } = this.props;

        const {
            adminLevel,
            geoarea: locationId,
        } = value;

        /*
        const adminLevelItem = adminLevelList.find(
            item => adminLevelKeySelector(item) === adminLevel,
        );
        */
        const geoAreas = (
            (adminLevel === 1 && provinces)
            || (adminLevel === 2 && districts)
            || (adminLevel === 3 && municipalities)
            || emptyArray
        );
        const geoArea = geoAreas.find(
            area => geoareaKeySelector(area) === locationId,
        );
        if (!geoArea) {
            // const adminLevelLabel = adminLevelLabelSelector(adminLevelItem);
            // return <div>{adminLevelLabel}</div>;
            return <div className={className}>National</div>;
        }
        const name = geoareaLabelSelector(geoArea);

        return <div className={className}>{`${name}`}</div>;
    }
}
