import React from 'react';
import Redux from 'redux';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';
import { Translation } from 'react-i18next';
import SelectInput from '#rsci/SelectInput';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    selectedProvinceIdSelector,
    wardsSelector,
    languageSelector,
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
import { Language } from '#store/atom/page/types';

interface PropsFromState {
    provinceList: ProvinceElement[];
    districtList: DistrictElement[];
    municipalityList: MunicipalityElement[];
    wardList: WardElement[];
    language: Language;
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
    language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
});

const emptyDistrictOptions: DistrictElement[] = [];
const emptyMunicipalityOptions: MunicipalityElement[] = [];
const emptyWardOptions: WardElement[] = [];

const regionKeySelector = (r: RegionElement) => r.id;


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

    public componentDidMount() {
        const { initialLoc } = this.props;
        if (initialLoc !== undefined) {
            const { municipality, province, district } = initialLoc;
            this.setState({
                selectedProvinceId: province,
                selectedDistrictId: district,
                selectedMunicipalityId: municipality,
            });
        }
    }

    private regionLabelSelector = (r: RegionElement) => {
        const { language: { language } } = this.props;
        if (language === 'en') {
            return r.title;
        }
        return r.title_ne;
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
    }

    private handleDistrictChange = (selectedDistrictId: number) => {
        this.setState({
            selectedDistrictId,
            selectedMunicipalityId: undefined,
            selectedWardId: undefined,
        });

        const { selectedProvinceId } = this.state;

        this.handleRegionChange({
            adminLevel: selectedDistrictId ? 2 : 1,
            geoarea: selectedDistrictId || selectedProvinceId,
        });
    }

    private handleMunicipalityChange = (selectedMunicipalityId: number) => {
        this.setState({
            selectedMunicipalityId,
            selectedWardId: undefined,
        });

        const { selectedDistrictId } = this.state;
        this.handleRegionChange({
            adminLevel: selectedMunicipalityId ? 3 : 2,
            geoarea: selectedMunicipalityId || selectedDistrictId,
        });
    }

    private handleWardChange = (selectedWardId: number) => {
        this.setState({ selectedWardId });
        const { selectedMunicipalityId } = this.state;

        this.handleRegionChange({
            adminLevel: selectedWardId ? 4 : 3,
            geoarea: selectedWardId || selectedMunicipalityId,
        });
    }

    private handleSignupRegion = () => ({
        province: this.state.selectedProvinceId,
        district: this.state.selectedDistrictId,
        municipality: this.state.selectedMunicipalityId,

    });

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

            wardsHidden,
            autoFocus,
            showHintAndError,
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
                <Translation>
                    {
                        t => (
                            <SelectInput
                                className={_cs(provinceInputClassName, styles.provinceInput)}
                                label={t('Province')}
                                options={provinceOptions}
                                keySelector={regionKeySelector}
                                labelSelector={this.regionLabelSelector}
                                value={selectedProvinceId}
                                onChange={this.handleProvinceChange}
                                disabled={shouldDisableProvinceInput}
                                showHintAndError={showHintAndError}
                                placeholder={t('All provinces')}
                                autoFocus={autoFocus}
                            />
                        )
                    }
                </Translation>
                <Translation>
                    {
                        t => (
                            <SelectInput
                                className={_cs(districtInputClassName, styles.districtInput)}
                                label={t('District')}
                                options={districtOptions}
                                keySelector={regionKeySelector}
                                labelSelector={this.regionLabelSelector}
                                value={selectedDistrictId}
                                onChange={this.handleDistrictChange}
                                disabled={shouldDisableDistrictInput}
                                showHintAndError={showHintAndError}
                                placeholder={t('All districts')}
                            />
                        )
                    }
                </Translation>
                <Translation>
                    {
                        t => (
                            <SelectInput
                                className={
                                    _cs(municipalityInputClassName, styles.municipalityInput)
                                }
                                label={t('Municipality')}
                                options={municipalityOptions}
                                keySelector={regionKeySelector}
                                labelSelector={this.regionLabelSelector}
                                value={selectedMunicipalityId}
                                onChange={this.handleMunicipalityChange}
                                disabled={shouldDisableMunicipalityInput}
                                showHintAndError={showHintAndError}
                                placeholder={t('All municipalities')}
                            />
                        )
                    }
                </Translation>


                {!wardsHidden && (
                    <Translation>
                        {
                            t => (
                                <SelectInput
                                    className={_cs(wardInputClassName, styles.wardInput)}
                                    label={t('Ward')}
                                    options={wardOptions}
                                    keySelector={regionKeySelector}
                                    labelSelector={this.regionLabelSelector}
                                    value={selectedWardId}
                                    onChange={this.handleWardChange}
                                    disabled={shouldDisableWardInput}
                                    showHintAndError={showHintAndError}
                                    placeholder={t('All wards')}
                                />
                            )
                        }
                    </Translation>

                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FaramInputElement(StepwiseRegionSelectInput));
