import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs, listToMap } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';
import memoize from 'memoize-one';

import SelectInput from '#rsci/SelectInput';
// import SegmentInput from '#rsci/SegmentInput';

import {
    // adminLevelListSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';

import styles from './styles.scss';

const adminLevelKeySelector = d => d.id;
// const adminLevelLabelSelector = d => d.title;

const geoareaKeySelector = d => `${d.adminLevel}-${d.id}`;
const geoareaLabelSelector = d => d.title;

const emptyObject = {};
// const emptyArray = [];

const propTypes = {
    className: PropTypes.string,
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired,
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    showHintAndError: PropTypes.bool,
};

const defaultProps = {
    className: '',
    value: {},
    showHintAndError: false,
};

const mapStateToProps = state => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});


@connect(mapStateToProps)
@FaramInputElement
export default class RegionSelectInput extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    /*
    handleAdminLevelChange = (newAdminLevel) => {
        const { onChange } = this.props;
        onChange({
            adminLevel: newAdminLevel,
            geoarea: undefined,
        });
    }
    */

    handleGeoAreaChange = (key) => {
        const { onChange } = this.props;

        if (!key) {
            onChange({
                adminLevel: undefined,
                geoarea: undefined,
            });
        } else {
            const [adminLevel, geoarea] = key.split('-');
            onChange({
                adminLevel: +adminLevel,
                geoarea: +geoarea,
            });
        }
    }

    createSingleList = memoize((provinces, districts, municipalities) => {
        const provinceList = provinces.map(province => ({ ...province, adminLevel: 1 }));

        const provinceMap = listToMap(
            provinces,
            adminLevelKeySelector,
            province => province,
        );

        const districtList = districts.map((district) => {
            const province = provinceMap[district.province];
            return {
                ...district,
                adminLevel: 2,
                title: `${district.title}, ${province.title}`,
            };
        });

        const districtMap = listToMap(
            districts,
            adminLevelKeySelector,
            province => province,
        );

        const municipalityList = municipalities.map((municipality) => {
            const district = districtMap[municipality.district];
            const province = provinceMap[district.province];
            return {
                ...municipality,
                adminLevel: 3,
                title: `${municipality.title}, ${district.title}, ${province.title}`,
            };
        });

        return [...provinceList, ...districtList, ...municipalityList];
    })

    render() {
        const {
            className: classNameFromProps,
            value: {
                adminLevel,
                geoarea,
            } = emptyObject,
            showHintAndError,
            provinces,
            districts,
            municipalities,
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.regionSelectInput,
        );

        let value;
        if (adminLevel && geoarea) {
            value = `${adminLevel}-${geoarea}`;
        }

        const options = this.createSingleList(provinces, districts, municipalities);

        return (
            <div className={_cs(className, styles.regionSelectInput)}>
                {/*
                <SegmentInput
                    className={styles.adminLevelSelectInput}
                    label="Admin level"
                    options={adminLevelList}
                    value={adminLevel}
                    keySelector={adminLevelKeySelector}
                    labelSelector={adminLevelLabelSelector}
                    onChange={this.handleAdminLevelChange}
                    showHintAndError={showHintAndError}
                />
                */}
                <SelectInput
                    key={adminLevel}
                    className={styles.geoareaSelectInput}
                    label="Location"
                    options={options}
                    value={value}
                    keySelector={geoareaKeySelector}
                    labelSelector={geoareaLabelSelector}
                    onChange={this.handleGeoAreaChange}
                    showHintAndError={showHintAndError}
                />
            </div>
        );
    }
}
