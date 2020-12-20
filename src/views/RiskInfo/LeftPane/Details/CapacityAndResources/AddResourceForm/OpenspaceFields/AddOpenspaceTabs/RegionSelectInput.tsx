import React from 'react';
import Redux from 'redux';
import memoize from 'memoize-one';
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
    RegionValues,
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
    onChange: (region: Region, regionValues: RegionValues) => void;
    provinceInputClassName?: string;
    districtInputClassName?: string;
    municipalityInputClassName?: string;
    wardInputClassName?: string;
    wardsHidden?: boolean;
    autoFocus?: boolean;
    showHintAndError?: boolean;
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

class RegionSelectInput extends React.PureComponent<Props, State> {
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
            props.wardList,
        );

        // TODO: componentWillReceiveProps
        this.state = {
            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
            selectedWardId: wardId,
        };
    }

    private getRegionsFromValue = memoize((
        value: Region | undefined,
        districtList: DistrictElement[],
        municipalityList: MunicipalityElement[],
        wardList: WardElement[],
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
            case 4:
                {
                    const ward = wardList.find(d => d.id === geoarea);
                    if (ward) {
                        provinceId = ward.province;
                        districtId = ward.district;
                        municipalityId = ward.municipality;
                        wardId = ward.id;
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
    })

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

    private handleRegionChange = (newValue: Region) => {
        const {
            onChange,
            districtList,
            municipalityList,
            wardList,
        } = this.props;

        const newRegionValues = this.getRegionsFromValue(
            newValue, districtList, municipalityList, wardList,
        );

        if (onChange) {
            onChange(newValue, newRegionValues);
        }
    }

    private handleProvinceChange = (selectedProvinceId: number) => {
        const { provinceList, setAdministrativeParameters } = this.props;
        const selectedProvince = provinceList.find(province => province.id === selectedProvinceId);

        this.setState({
            selectedProvinceId,
            selectedDistrictId: undefined,
            selectedMunicipalityId: undefined,
            selectedWardId: undefined,
        });

        this.handleRegionChange({
            adminLevel: selectedProvinceId ? 1 : undefined,
            geoarea: selectedProvinceId,
        });

        if (selectedProvince) {
            setAdministrativeParameters('province', selectedProvince.id);
        }
    }

    private handleDistrictChange = (selectedDistrictId: number) => {
        const { districtList, setAdministrativeParameters } = this.props;
        this.setState({
            selectedDistrictId,
            selectedMunicipalityId: undefined,
            selectedWardId: undefined,
        });
        const selectedDistrict = districtList.find(district => district.id === selectedDistrictId);
        const { selectedProvinceId } = this.state;

        this.handleRegionChange({
            adminLevel: selectedDistrictId ? 2 : 1,
            geoarea: selectedDistrictId || selectedProvinceId,
        });

        if (selectedDistrict) {
            setAdministrativeParameters('district', selectedDistrict.id);
        }
    }

    private handleMunicipalityChange = (selectedMunicipalityId: number) => {
        const { municipalityList, setAdministrativeParameters } = this.props;
        this.setState({
            selectedMunicipalityId,
            selectedWardId: undefined,
        });

        const { selectedDistrictId } = this.state;
        const selectedMunicipality = municipalityList.find(
            muni => muni.id === selectedMunicipalityId,
        );
        this.handleRegionChange({
            adminLevel: selectedMunicipalityId ? 3 : 2,
            geoarea: selectedMunicipalityId || selectedDistrictId,
        });

        if (selectedMunicipality) {
            setAdministrativeParameters('municipality', selectedMunicipality.id);
        }
    }


    public render() {
        const {
            provinceList,
            districtList,
            municipalityList,
            wardList,
            disabled,

            provinceInputClassName,
            districtInputClassName,
            municipalityInputClassName,
            autoFocus,
            showHintAndError,
        } = this.props;

        const {
            selectedProvinceId,
            selectedDistrictId,
            selectedMunicipalityId,
        } = this.state;

        const {
            provinceOptions,
            districtOptions,
            municipalityOptions,
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

        return (
            <div className={_cs(styles.stepwiseRegionSelect)}>
                <SelectInput
                    className={_cs(provinceInputClassName, styles.provinceInput)}
                    label="Province"
                    options={provinceOptions}
                    keySelector={regionKeySelector}
                    labelSelector={regionLabelSelector}
                    value={selectedProvinceId}
                    onChange={this.handleProvinceChange}
                    disabled={shouldDisableProvinceInput}
                    showHintAndError={showHintAndError}
                    placeholder="All provinces"
                    autoFocus={autoFocus}
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
                    showHintAndError={showHintAndError}
                    placeholder="All districts"
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
                    showHintAndError={showHintAndError}
                    placeholder="All municipalities"
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FaramInputElement(RegionSelectInput));
