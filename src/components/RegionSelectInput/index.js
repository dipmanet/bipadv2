import React from 'react';
import SelectInput from '#rsci/SelectInput';

import { FaramInputElement } from '#rscg/FaramElements';
import Delay from '#rscg/Delay';

import {
    adminLevelFilterOptionList,
    geoareaFilterOptions,
} from '#resources/data';

import _cs from '#cs';
import styles from './styles.scss';

const adminLevelKeySelector = d => d.key;
const adminLevelLabelSelector = d => d.label;
const geoareaKeySelector = d => d.key;
const geoareaLabelSelector = d => d.label;

const emptyObject = {};

@FaramInputElement
@Delay
export default class RegionSelectInput extends React.PureComponent {
    handleAdminLevelChange = (newAdminLevel) => {
        const {
            value: {
                adminLevel,
                geoarea,
            } = emptyObject,
            onChange,
        } = this.props;

        onChange({
            adminLevel: newAdminLevel,
            geoarea,
        });
    }

    handleGeoAreaChange = (newGeoarea) => {
        const {
            value: {
                adminLevel,
                geoarea,
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
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.regionSelectInput,
        );

        return (
            <div className={className}>
                <SelectInput
                    className={styles.adminLevelSelectInput}
                    label="Admin level"
                    options={adminLevelFilterOptionList}
                    value={adminLevel}
                    keySelector={adminLevelKeySelector}
                    labelSelector={adminLevelLabelSelector}
                    onChange={this.handleAdminLevelChange}
                />
                <SelectInput
                    className={styles.geoareaSelectInput}
                    label="Geoarea"
                    options={geoareaFilterOptions[adminLevel]}
                    value={geoarea}
                    keySelector={geoareaKeySelector}
                    labelSelector={geoareaLabelSelector}
                    onChange={this.handleGeoareaChange}
                />
            </div>
        );
    }
}
