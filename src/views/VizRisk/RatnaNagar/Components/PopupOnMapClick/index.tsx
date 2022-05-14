/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Loader from 'react-loader';
import styles from './styles.scss';

interface Props {
    mainType: string;
    data: any;
    houseId: number;
}

interface HouseHold {
    metadata: any;
}

const PopupOnMapClick = (props: Props) => {
    const { mainType, data, houseId } = props;
    const [houseData, setHouseData] = useState<HouseHold>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHouseData = async () => {
            const housedata = await fetch(
                `${process.env.REACT_APP_API_SERVER_URL}/vizrisk-household/${houseId}/?meta=true`,
            ).then(res => res.json());
            setHouseData(housedata);
            setLoading(false);
        };
        fetchHouseData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const popUpExposureData = (houseData && Object.keys(houseData).length > 0)
        ? [
            {
                name: 'Building Type',
                value: houseData.metadata.houseBuildingType,
            },
            {
                name: 'Family Size(Number)',
                value: houseData.metadata.totalFamilyMembers,
            },
            {
                name: 'Family size of other family living in the house (Number)',
                value: houseData.metadata.otherFamilyMembersTotalOther,
            },
            {
                name: 'Material used for wall and roof construction and the types of foundation',
                value: houseData.metadata.houseFoundationType,
            },
        ] : [];

    const popUpHazardData = houseData && Object.keys(houseData).length > 0
        ? [
            {
                name: 'Flood return period',
                value: houseData.metadata.numberOfFloodsPastThirtyYears,
            },
        ] : [];

    const popUpSensitivityData = houseData && Object.keys(houseData).length > 0
        ? [
            {
                name: 'Ethnicity',
                value: houseData.metadata.houseOwnerEthnicity
                    && ['Chhetri', 'Brahmin-Hill'].includes(houseData.metadata.houseOwnerEthnicity)
                    ? 'Others' : houseData.metadata.houseOwnerEthnicity,
            },
            {
                name: 'Land holding(Ropani)',
                value: houseData.metadata.totalLandRopani,
            },
            {
                name: 'Income Source',
                value: houseData.metadata.majorOccupation,
            },
            {
                name: 'Ground surface',
                value: houseData.metadata.houseGroundSurface,
            },
            {
                name: 'Chronically ill',
                value: houseData.metadata.hasChronicallyIll,
            },
            {
                name: 'Access to market',
                value: houseData.metadata.distanceFromMarketMeter ? 'Yes' : 'No',
            },
            {
                name: 'Access to toilet',
                value: houseData.metadata.distanceFromToiletMeter ? 'Yes' : 'No',
            },
            {
                name: 'Disability types',
                value: houseData.metadata.disabilityTypeCard,
            },
            {
                name: 'Number of storey',
                value: houseData.metadata.houseStoreys,
            },
            {
                name: 'Access to security',
                value: houseData.metadata.distanceFromSecurityForcesMeter ? 'Yes' : 'No',
            },
            {
                name: 'Identity Revealing',
                value: houseData.metadata.unidentifiedMembers,
            },
            {
                name: 'Annual Income (NPR)',
                value: houseData.metadata.annualIncome,
            },
            {
                name: 'Household head Gender',
                value: houseData.metadata.houseOwnerGender,
            },
            {
                name: 'Land holding female',
                value: houseData.metadata.femaleOwnedTotalLandRopani,
            },
            {
                name: 'Access to safe shelter',
                value: houseData.metadata.hasAccessToSafeShelter,
            },
            {
                name: 'Access to medical centers',
                value: houseData.metadata.isMedicalCenterAccessibleToDisabled,
            },
            {
                name: 'Distance from ward office',
                value: houseData.metadata.distanceFromSecurityForcesMeter ? 'Yes' : 'No',
            },
            {
                name: 'Access to natural resource',
                value: houseData.metadata.hasNoAccessToNaturalResources,
            },
            {
                name: 'Current condition of house ',
                value: houseData.metadata.houseCondition,
            },
            {
                name: 'Access to community building',
                value: houseData.metadata.hasCommunityCenter,
            },
            {
                name: 'Access to financial institution',
                value: houseData.metadata.houseBuildingType,
            },
            {
                name: 'Distance from municipality office',
                value: houseData.metadata.houseBuildingType,
            },
            {
                name: 'Yearly saving of your house (NPR)',
                value: houseData.metadata.houseBuildingType,
            },
            {
                name: 'Access to educational institutions',
                value: houseData.metadata.distanceFromFinancialInstitutionMeter,
            },
            {
                name: 'Access to safe and accessible sanitation',
                value: houseData.metadata.safeAdequateSanitationForFemaleDuringMenstruation,
            },
            {
                name: 'Education level',
                value: houseData.metadata.literateMale + houseData.metadata.literateFemale,
            },
            // {
            //     name: 'Gender (percentage of female and others)',
            //     value: houseData.metadata.houseBuildingType,
            // },
            {
                name: 'Building designed following building code',
                value: houseData.metadata.isBuildingDesignedFollowingCode,
            },
            {
                name: 'Pregnant and lactating women in the family',
                value: houseData.metadata.hasPregnantAndLactating,
            },
            {
                name: 'Access to toilet for people with disability',
                value: houseData.metadata.isToiletAccessibleToDisabled,
            },
            {
                name: 'Number of unemployed member in the household',
                value: houseData.metadata.unemployedMembersTotal,
            },
            {
                name: 'Building permit received from the municipality',
                value: houseData.metadata.hasRecievedBuildingPermit,
            },
            {
                name: 'Access to drinking water (normal days and flood)',
                value: houseData.metadata.hasAccessToDrinkingWaterDuringFlood,
            },
            // {
            //     name: 'Distance from road (m) for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            {
                name: 'Access to medical centers for people with disability',
                value: houseData.metadata.isMedicalCenterAccessibleToDisabled,
            },
            {
                name: 'Occupational and livelihood groups of the family members',
                value: houseData.metadata.occupationalAndLivelihoodGroup,
            },
            // {
            //     name: 'Access to financial institution for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            // {
            //     name: 'Distance from municipality office for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            // {
            //     name: 'Access to educational institutions for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            // {
            //     name: 'Access to financial institution for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            // {
            //     name: 'Distance from municipality office for people with disability',
            //     value: houseData.metadata.houseBuildingType,
            // },
            {
                name: 'Raised plinth, proper drainage and roof accessible during emergency',
                value: houseData.metadata.hasHouseRaisedPlinth,
            },
            // {
            //     name: 'Number of Dependent Population (Children <15 and Elderly (Age >=60 years)',
            //     value: houseData.metadata.houseBuildingType,
            // },
        ] : [];


    const popUpAdaptiveCapacityData = houseData && Object.keys(houseData).length > 0
        ? [
            {
                name: 'Hold Insurance Policy',
                value: houseData.metadata.hasInsurance,
            },
            {
                name: 'Training on DRR received',
                value: houseData.metadata.hasFamilyMembersTrainedOnDisaster,
            },
            {
                name: 'Use of communication device',
                value: houseData.metadata.hasCommunicationDevice,
            },
            {
                name: 'Access to early warning information',
                value: houseData.metadata.earlyWarningInfoUnderstandable,
            },
            {
                name: 'Access to loan from financial institutes',
                value: houseData.metadata.isLoanCoveredBySubsizedLoan,
            },
            {
                name: 'Understand early warning information disseminated',
                value: houseData.metadata.earlyWarningInfoUnderstandable,
            },
            {
                name: 'Membership of the family members in community groups',
                value: houseData.metadata.areMembersInGroupsDrrmCommittee,
            },
            {
                name: 'Reservations, allowances and special privilege systems',
                value: houseData.metadata.otherTypePrivilegeSystem,
            },
            {
                name: 'Access to social assistance in the aftermath of past disaster',
                value: houseData.metadata.hasSocialAssistanceAftermath,
            },
            {
                name: 'Covered by subsidised loan targeted for women/marginalized group',
                value: houseData.metadata.isMarginalized,
            },
            {
                name: 'Access to the communication devices by women or marginalized people',
                value: houseData.metadata.isCommunicationAccessedByWomen,
            },
            {
                name: 'Women participation in community meeting and or decision-making process',
                value: houseData.metadata.areWomenInvolvedInMeetingsAndDecisionMaking,
            },
        ] : [];

    return (
        <div
            className={styles.popupOnMapClick}
            id="mainPopUp"
            style={{ border: `1px solid ${data.color}` }}
        >
            {
                loading ? (
                    <div style={{
                        display: 'flex',
                        height: 150,
                        width: 240,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                        <Loader />
                    </div>
                ) : (
                    <>
                        <h2 className={styles.titleType}>
                            House ID :
                            {houseId}
                        </h2>
                        <div className={styles.mainContents} style={{ height: 40 }}>
                            <h3
                                style={{ color: data.color, fontSize: 15 }}
                                className={styles.mainTitle}
                            >
                                {mainType}

                            </h3>
                            <h3 style={{ color: data.color, fontSize: 15 }} className={styles.mainStatus}>
                                {
                                    data.value ? data.value.toFixed(2) : 'No data'
                                }

                            </h3>
                        </div>

                        {
                            mainType === 'Exposure' && (
                                popUpExposureData.map(exposurePopData => (
                                    <div className={styles.mainContents}>
                                        <h3 className={styles.mainTitle}>
                                            {exposurePopData.name}
                                            {' '}
                                            {':'}
                                        </h3>
                                        <h3 className={styles.mainStatus}>
                                            {exposurePopData.value ? exposurePopData.value : 'No data'}
                                        </h3>
                                    </div>

                                ))
                            )
                        }
                        {
                            mainType === 'Hazard' && (
                                popUpHazardData.map(exposurePopData => (
                                    <div className={styles.mainContents}>
                                        <h3 className={styles.mainTitle}>
                                            {exposurePopData.name}
                                            {' '}
                                            {':'}
                                        </h3>
                                        <h3 className={styles.mainStatus}>
                                            {exposurePopData.value ? exposurePopData.value : 'No data'}
                                        </h3>
                                    </div>

                                ))
                            )
                        }
                        {
                            mainType === 'Sensitivity' && (
                                popUpSensitivityData.map(exposurePopData => (
                                    <div className={styles.mainContents}>
                                        <h3 className={styles.mainTitle}>
                                            {exposurePopData.name}
                                            {' '}
                                            {':'}
                                        </h3>
                                        <h3 className={styles.mainStatus}>
                                            {exposurePopData.value ? exposurePopData.value : 'No data'}
                                        </h3>
                                    </div>

                                ))
                            )
                        }
                        {
                            mainType === 'AdaptiveCapacity' && (
                                popUpAdaptiveCapacityData.map(exposurePopData => (
                                    <div className={styles.mainContents}>
                                        <h3 className={styles.mainTitle}>
                                            {exposurePopData.name}
                                            {' '}
                                            {':'}
                                        </h3>
                                        <h3 className={styles.mainStatus}>
                                            {exposurePopData.value ? exposurePopData.value : 'No data'}
                                        </h3>
                                    </div>

                                ))
                            )
                        }
                        <div className={styles.dummyBlankSpace} />
                    </>
                )
            }

        </div>
    );
};

export default PopupOnMapClick;
