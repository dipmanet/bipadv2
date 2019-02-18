import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from '#rsci/SelectInput';
import { connect } from 'react-redux';

import { FaramInputElement } from '#rscg/FaramElements';
import Delay from '#rscg/Delay';

import {
    adminLevelListSelector,
    geoAreasSelector,
} from '#redux';

import _cs from '#cs';
import styles from './styles.scss';

const adminLevelKeySelector = d => d.pk;
const adminLevelLabelSelector = d => d.title;
const geoareaKeySelector = d => d.pk;
const geoareaLabelSelector = d => d.title;

const emptyObject = {};

const propTypes = {
    className: PropTypes.string,
    adminLevelList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    geoAreas: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired,
};

const defaultProps = {
    className: '',
    value: {},
};

const mapStateToProps = state => ({
    adminLevelList: adminLevelListSelector(state),
    geoAreas: geoAreasSelector(state),
});


@connect(mapStateToProps)
@FaramInputElement
@Delay
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
            geoAreas,
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
                    options={adminLevelList}
                    value={adminLevel}
                    keySelector={adminLevelKeySelector}
                    labelSelector={adminLevelLabelSelector}
                    onChange={this.handleAdminLevelChange}
                />
                {
                    adminLevel &&
                    <SelectInput
                        className={styles.geoareaSelectInput}
                        label="Geoarea"
                        options={geoAreas[adminLevel]}
                        value={geoarea}
                        keySelector={geoareaKeySelector}
                        labelSelector={geoareaLabelSelector}
                        onChange={this.handleGeoAreaChange}
                    />
                }
            </div>
        );
    }
}
