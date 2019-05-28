import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { _cs } from '@togglecorp/fujs';

import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
});

@connect(mapStateToProps)
export default class GeoResolve extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getRegionDetails = ({ adminLevel, geoarea } = {}) => {
        const {
            provinces,
            districts,
            municipalities,
        } = this.props;

        if (adminLevel === 1) {
            return provinces.find(p => p.id === geoarea);
        } else if (adminLevel === 2) {
            return districts.find(p => p.id === geoarea);
        } else if (adminLevel === 3) {
            return municipalities.find(p => p.id === geoarea);
        }

        return '';
    }

    render() {
        const { className, data } = this.props;
        const selectedRegionDetails = this.getRegionDetails(data);

        return (
            <p className={_cs(className, styles.geoResolve)}>
                {selectedRegionDetails.title}
            </p>
        );
    }
}

