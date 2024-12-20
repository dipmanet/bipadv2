/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { createConnectedRequestCoordinator } from '#request';
import { AppState } from '#store/types';
import { authStateSelector, languageSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';
import NumberInput from '#rsci/NumberInput';
import LocationInput from '#components/LocationInput';
import styles from './styles.scss';
import RegionSelectInput from '../../OpenspaceFields/AddOpenspaceTabs/RegionSelectInput';


interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState;

interface Props {
    postBasicInfo: () => void;
    setAdministrativeParameters: (name: string, value: string) => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
}

const mapStateToProps = (state: AppState) => ({
    language: languageSelector(state),
    authState: authStateSelector(state),

});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

function BasicInfo({ postBasicInfo, openspacePostError,
    setAdministrativeParameters, faramValues, optionsClassName, language: { language } }: Props) {
    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' },
    { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' },
    { key: false, label: language === 'en' ? 'No' : 'छैन' }];
    return (
        <Translation>
            {
                t => (
                    <React.Fragment>
                        <br />
                        {/* <RegionSelectInput setAdministrativeParameters=
                        {setAdministrativeParameters} /> */}
                        <TextInput faramElementName="elevation" label={t('Elevation')} />
                        <div className={styles.inputGroup}>
                            <NumberInput
                                faramElementName="totalArea"
                                label={t('Total Area')}
                            />
                            <NumberInput
                                faramElementName="usableArea"
                                label={t('Usable Area')}
                            />

                        </div>
                        <TextInput faramElementName="address" label={t('Address')} />
                        <div className={styles.inputGroup}>
                            <TextInput faramElementName="currentLandUse" label={t('Current Land Use')} />
                            <NumberInput
                                faramElementName="capacity"
                                label={t('Capacity of Community Space')}
                            />
                        </div>
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="usedAsHelipad"
                            label={t('Used for emergency landing as helipad?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}

                            optionsClassName={optionsClassName}

                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="isDrinkingWaterAvailable"
                            label={t('Is drinking water facility available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="isToiletAvailable"
                            label={t('Is toilet available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.isToiletAvailable
                            && (
                                <NumberInput
                                    faramElementName="noOfToilets"
                                    label={t('How Many Toilets Are Available?')}
                                />

                            )}
                        <TextInput
                            faramElementName="otherFacilities"
                            label={t('What other facilities are available? Please specify.')}
                        />
                        <TextInput faramElementName="remarks" label={t('remarks')} />
                        {/* {openspacePostError && (
                        <NonFieldErrors
                            faramElement
                            errors={['Some error occured!']}
                        />
                    )} */}
                        {/*
                    {authState.authenticated
                         && ( */}
                        <LocationInput
                            // className={styles.locationInput}
                            faramElementName="location"
                            classCategory={styles.locationInput}
                            category={'capacityResource'}
                        />
                        <div className={styles.submitButn}>
                            <PrimaryButton
                                onClick={() => postBasicInfo()}
                            >
                                {t('Save and Continue')}
                            </PrimaryButton>
                        </div>
                        {/* )} */}

                    </React.Fragment>
                )
            }
        </Translation>

    );
}

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(BasicInfo),
);
