import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import SelectInput from '#rsci/SelectInput';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
} from '#selectors';

import {
    RegionElement,
    ProvinceElement,
    DistrictElement,
    MunicipalityElement,
    WardElement,
    Region,
} from '#types';

import { AppState } from '#store/types';

import styles from './styles.scss';

interface PropsFromState {
    provinceList: ProvinceElement[];
    districtList: DistrictElement[];
    municipalityList: MunicipalityElement[];
    wardList: WardElement[];
}

interface PropsFromDispatch {
}

interface OwnProps {
    className?: string;
    disabled?: boolean;
    value?: Region;
    onChange: (region: Region) => void;
    provinceInputClassName?: string;
    districtInputClassName?: string;
    municipalityInputClassName?: string;
    wardInputClassName?: string;
}

interface State {
    selectedProvinceId: number | undefined;
    selectedDistrictId: number | undefined;
    selectedMunicipalityId: number | undefined;
    selectedWardId: number | undefined;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: AppState): PropsFromState => ({
    provinceList: provincesSelector(state),
    districtList: districtsSelector(state),
    municipalityList: municipalitiesSelector(state),
    wardList: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
});

const emptyDistrictOptions: DistrictElement[] = [];
const emptyMunicipalityOptions: MunicipalityElement[] = [];
const emptyWardOptions: WardElement[] = [];

const regionKeySelector = (r: RegionElement) => r.id;
const regionLabelSelector = (r: RegionElement) => r.title;

class StepwiseRegionSelectInput extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            provinceId,
            districtId,
            municipalityId,
            wardId,
        } = this.getRegionsFromValue(
            props.value,
            props.districtList,
            props.municipalityList,
            // props.wardList,
        );

        // TODO: componentWillReceiveProps
        this.state = {
            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
            selectedWardId: wardId,
        };
    }

    private getRegionsFromValue = (
        value: Region | undefined,
        districtList: DistrictElement[],
        municipalityList: MunicipalityElement[],
        // wardList: WardElement[],
    ) => {
        let provinceId;
        let districtId;
        let municipalityId;
        let wardId;

        if (!value) {
            return {
                provinceId,
                districtId,
                municipalityId,
                wardId,
            };
        }

        const {
            geoarea,
            adminLevel,
        } = value;

        switch (adminLevel) {
            case 1:
                provinceId = geoarea;
                break;
            case 2:
                {
                    const district = districtList.find(d => d.id === geoarea);
                    if (district) {
                        provinceId = district.province;
                        districtId = district.id;
                    }
                }
                break;
            case 3:
                {
                    const municipality = municipalityList.find(d => d.id === geoarea);
                    if (municipality) {
                        provinceId = municipality.province;
                        districtId = municipality.district;
                        municipalityId = municipality.id;
                    }
                }
                break;
            default:
        }

        return {
            provinceId,
            districtId,
            municipalityId,
            wardId,
        };
    }

    private getRegionOptions = (
        provinceList: ProvinceElement[],
        districtList: DistrictElement[],
        municipalityList: MunicipalityElement[],
        wardList: WardElement[],

        selectedProvinceId?: number,
        selectedDistrictId?: number,
        selectedMunicipalityId?: number,
    ) => {
        const provinceOptions = provinceList;

        const districtOptions = selectedProvinceId
            ? districtList.filter(d => d.province === selectedProvinceId)
            : emptyDistrictOptions;

        const municipalityOptions = selectedDistrictId
            ? municipalityList.filter(d => d.district === selectedDistrictId)
            : emptyMunicipalityOptions;

        const wardOptions = selectedMunicipalityId
            ? wardList.filter(d => d.municipality === selectedMunicipalityId)
            : emptyWardOptions;

        return {
            provinceOptions,
            districtOptions,
            municipalityOptions,
            wardOptions,
        };
    }

    private handleProvinceChange = (selectedProvinceId: number) => {
        this.setState({
            selectedProvinceId,
            selectedDistrictId: undefined,
            selectedMunicipalityId: undefined,
            selectedWardId: undefined,
        });

        const { onChange } = this.props;
        onChange({
            adminLevel: 1,
            geoarea: selectedProvinceId,
        });
    }

    private handleDistrictChange = (selectedDistrictId: number) => {
        this.setState({
            selectedDistrictId,
            selectedMunicipalityId: undefined,
            selectedWardId: undefined,
        });

        const { onChange } = this.props;
        onChange({
            adminLevel: 2,
            geoarea: selectedDistrictId,
        });
    }

    private handleMunicipalityChange = (selectedMunicipalityId: number) => {
        this.setState({
            selectedMunicipalityId,
            selectedWardId: undefined,
        });

        const { onChange } = this.props;
        onChange({
            adminLevel: 3,
            geoarea: selectedMunicipalityId,
        });
    }

    private handleWardChange = (selectedWardId: number) => {
        this.setState({ selectedWardId });
    }

    public render() {
        const {
            className,
            provinceList,
            districtList,
            municipalityList,
            wardList,
            disabled,

            provinceInputClassName,
            districtInputClassName,
            municipalityInputClassName,
            wardInputClassName,
        } = this.props;

        const {
            selectedProvinceId,
            selectedDistrictId,
            selectedMunicipalityId,
            selectedWardId,
        } = this.state;

        const {
            provinceOptions,
            districtOptions,
            municipalityOptions,
            wardOptions,
        } = this.getRegionOptions(
            provinceList,
            districtList,
            municipalityList,
            wardList,
            selectedProvinceId,
            selectedDistrictId,
            selectedMunicipalityId,
        );

        const shouldDisableProvinceInput = disabled;
        const shouldDisableDistrictInput = disabled || !selectedProvinceId;
        const shouldDisableMunicipalityInput = disabled || !selectedDistrictId;
        const shouldDisableWardInput = disabled || !selectedMunicipalityId;

        return (
            <div className={_cs(className, styles.stepwiseRegionSelectInput)}>
                <SelectInput
                    className={_cs(provinceInputClassName, styles.provinceInput)}
                    label="Province"
                    options={provinceOptions}
                    keySelector={regionKeySelector}
                    labelSelector={regionLabelSelector}
                    value={selectedProvinceId}
                    onChange={this.handleProvinceChange}
                    disabled={shouldDisableProvinceInput}
                    showHintAndError={false}
                />
                <SelectInput
                    className={_cs(districtInputClassName, styles.districtInput)}
                    label="District"
                    options={districtOptions}
                    keySelector={regionKeySelector}
                    labelSelector={regionLabelSelector}
                    value={selectedDistrictId}
                    onChange={this.handleDistrictChange}
                    disabled={shouldDisableDistrictInput}
                    showHintAndError={false}
                />
                <SelectInput
                    className={_cs(municipalityInputClassName, styles.municipalityInput)}
                    label="Municipality"
                    options={municipalityOptions}
                    keySelector={regionKeySelector}
                    labelSelector={regionLabelSelector}
                    value={selectedMunicipalityId}
                    onChange={this.handleMunicipalityChange}
                    disabled={shouldDisableMunicipalityInput}
                    showHintAndError={false}
                />
                <SelectInput
                    className={_cs(wardInputClassName, styles.wardInput)}
                    label="Ward"
                    options={wardOptions}
                    keySelector={regionKeySelector}
                    labelSelector={regionLabelSelector}
                    value={selectedWardId}
                    onChange={this.handleWardChange}
                    disabled={shouldDisableWardInput}
                    showHintAndError={false}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FaramInputElement(StepwiseRegionSelectInput));
