import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import SelectInput from '#rsci/SelectInput';
import SearchSelectInput from '#rsci/SearchSelectInput';
import { createSingleList } from './util';
// import SegmentInput from '#rsci/SegmentInput';

import {
    // adminLevelListSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';

import styles from './styles.scss';

// const adminLevelLabelSelector = d => d.title;

const geoareaKeySelector = d => `${d.adminLevel}-${d.id}`;
const geoareaLabelSelector = d => d.title;

const emptyObject = {};
// const emptyArray = [];

const propTypes = {
    className: PropTypes.string,
    maxOptions: PropTypes.number,
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired,
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    showHintAndError: PropTypes.bool,
    autoFocus: PropTypes.bool,
};

const defaultProps = {
    className: '',
    value: {},
    showHintAndError: false,
    maxOptions: 0,
    autoFocus: false,
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

    render() {
        const {
            className: classNameFromProps,
            value: {
                adminLevel,
                geoarea,
            } = emptyObject,
            provinces,
            districts,
            municipalities,
            maxOptions,
            autoFocus,
            ...otherProps
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.regionSelectInput,
        );

        let value;
        if (adminLevel && geoarea) {
            value = `${adminLevel}-${geoarea}`;
        }

        const options = createSingleList(provinces, districts, municipalities);
        const Input = maxOptions > 0 ? SearchSelectInput : SelectInput;

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
                <Input
                    label="Location"
                    key={adminLevel}
                    {...otherProps}
                    maxDisplayOptions={maxOptions}
                    className={styles.geoareaSelectInput}
                    options={options}
                    value={value}
                    keySelector={geoareaKeySelector}
                    labelSelector={geoareaLabelSelector}
                    onChange={this.handleGeoAreaChange}
                    autoFocus={autoFocus}
                />
            </div>
        );
    }
}
