import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    languageSelector,
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
    language: languageSelector(state),
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
        }

        if (adminLevel === 2) {
            return districts.find(p => p.id === geoarea);
        }

        if (adminLevel === 3) {
            return municipalities.find(p => p.id === geoarea);
        }

        return '';
    }

    render() {
        const { className, data, language: { language } } = this.props;
        const selectedRegionDetails = this.getRegionDetails(data);
        return (
            <p className={_cs(className, styles.geoResolve)}>
                {language === 'en' ? selectedRegionDetails.title : selectedRegionDetails.title_ne }
            </p>
        );
    }
}
