import React from 'react';
import SelectInput from '#rsci/SelectInput';

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

export default class RegionSelectInput extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            adminLevel: 'province',
            geoarea: '1',
        };
    }

    render() {
        const {
            className: classNameFromProps,
        } = this.props;

        const {
            adminLevel,
            geoarea,
        } = this.state;

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
                />
                <SelectInput
                    className={styles.geoareaSelectInput}
                    label="Geoarea"
                    options={geoareaFilterOptions[adminLevel]}
                    value={geoarea}
                    keySelector={geoareaKeySelector}
                    labelSelector={geoareaLabelSelector}
                />
            </div>
        );
    }
}
