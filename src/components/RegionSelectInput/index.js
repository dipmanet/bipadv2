import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from '#rsci/SelectInput';
import { connect } from 'react-redux';

import { FaramInputElement } from '@togglecorp/faram';

import {
    adminLevelListSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#redux';

import _cs from '#cs';
import styles from './styles.scss';

const adminLevelKeySelector = d => d.pk;
const adminLevelLabelSelector = d => d.title;
const geoareaKeySelector = d => d.id;
const geoareaLabelSelector = d => d.title;

const emptyObject = {};
const emptyArray = {};

const propTypes = {
    className: PropTypes.string,
    adminLevelList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired,
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: '',
    value: {},
};

const mapStateToProps = state => ({
    adminLevelList: adminLevelListSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});


@connect(mapStateToProps)
@FaramInputElement
export default class RegionSelectInput extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    handleAdminLevelChange = (newAdminLevel) => {
        const { onChange } = this.props;

        onChange({
            adminLevel: newAdminLevel,
            geoarea: undefined,
        });
    }

    handleGeoAreaChange = (newGeoarea) => {
        const {
            value: {
                adminLevel,
            } = emptyObject,
            onChange,
        } = this.props;

        onChange({
            adminLevel,
            geoarea: newGeoarea,
        });
    }

    render() {
        const {
            className: classNameFromProps,
            value: {
                adminLevel,
                geoarea,
            } = emptyObject,
            adminLevelList,
            showHintAndError,
            provinces,
            districts,
            municipalities,
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.regionSelectInput,
        );

        const geoArea = (
            (adminLevel === 1 && provinces) ||
            (adminLevel === 2 && districts) ||
            (adminLevel === 3 && municipalities) ||
            emptyArray
        );

        return (
            <div className={className}>
                <SelectInput
                    className={styles.adminLevelSelectInput}
                    label="Admin level"
                    options={adminLevelList}
                    value={adminLevel}
                    keySelector={adminLevelKeySelector}
                    labelSelector={adminLevelLabelSelector}
                    onChange={this.handleAdminLevelChange}
                    showHintAndError={showHintAndError}
                />
                {
                    adminLevel &&
                    <SelectInput
                        key={adminLevel}
                        className={styles.geoareaSelectInput}
                        label="Geoarea"
                        options={geoArea}
                        value={geoarea}
                        keySelector={geoareaKeySelector}
                        labelSelector={geoareaLabelSelector}
                        onChange={this.handleGeoAreaChange}
                        showHintAndError={showHintAndError}
                    />
                }
            </div>
        );
    }
}
