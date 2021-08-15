/* eslint-disable css-modules/no-undef-class */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { getBuildingOptions } from './formData';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';


interface Props {

}

interface Params {

}

const getSelectTypes = data => [...new Set(data.filter(f => f.select).map(p => p.title))];
const getInputTypes = data => [...new Set(data.filter(f => !f.select).map(p => p.title))];

const refData = {
    'Foundation Type': 'foundationType',
    'Roof Type': 'roofType',
    Storeys: 'storeys',
    'Ground Surface': 'groundSurface',
    'Distance from Road (meters)': 'roadDistance',
    'Drinking Water Distance (minutes)': 'drinkingWaterDistance',
    'Number of People/House Members': 'totalPopulation',
    'Male Members': 'noOfMale',
    'Female Members': 'noOfFemale',
    'No. of Members (65 years old and above)': 'seniorCitizens',
    'No. of Members (less than 5 years old)': 'childrenUnderFive',
    'Ownership of House': 'ownership',
    'People with Disability': 'peopleWithDisability',
    'Distance from Medical Centers (minutes)': 'healthPostDistance',
    'Distance from Security Center (minutes)': 'policeStationDistance',
    'Distance from School (minutes)': 'schoolDistance',
    'Distance from Open Space (minutes)': 'openSafeSpaceDistance',
    'Main source of income': 'majorOccupation',
    'Average yearly income (Nepalese Rupees)': 'averageAnnualIncome',
    'Sufficiency of Agriculture product (Months)': 'suffency',
    'Building Condition': 'buildingCondition',
    'Damage Grade': 'damageGrade',

};

const initialValues = {
    foundationType: '',
    roofType: '',
    storeys: '',
    groundSurface: '',
    roadDistance: '',
    drinkingWaterDistance: '',
    totalPopulation: '',
    noOfMale: '',
    noOfFemale: '',
    seniorCitizens: '',
    childrenUnderFive: '',
    ownership: '',
    peopleWithDisability: '',
    healthPostDistance: '',
    policeStationDistance: '',
    schoolDistance: '',
    openSafeSpaceDistance: '',
    majorOccupation: '',
    averageAnnualIncome: '',
    agricultureZeroToThreeMonth: false,
    agricultureFourToSixMonth: false,
    agricultureSevenToNineMonth: false,
    agricultureNineToTwelveMonth: false,
};

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    buildingPostRequest: {
        url: '/vizrisk-building/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                ...params.data,
            };
        },
        onSuccess: ({ response, props, params }) => {
            console.log('success, data: ', response);
        },
        // onFailure: ({ error, params }) => {
        //     params.handlePending(false);
        //     if (Object.keys(error).length > 0) {
        //         const errorDesc = error[Object.keys(error)[0]];
        //         params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
        //     } else {
        //         params.handleResponseErrorMessage('Some problem occured, please try again.');
        //     }
        // },
        // onFatal: ({ params }) => {
        //     params.handlePending(false);
        //     console.log('No reply, server error');
        //     alert('Some problem occured, please contact IT support.');

        //     window.location.reload();
        // },
        // extras: { hasFile: true },
    },
    buildingPutRequest: {
        url: ({ params }) => `/vizrisk-building/${params.id}/`,
        method: methods.PUT,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                ...params.data,
                // fullName: params.fullName,
                // position: params.position,
                // phoneNumber: params.phoneNumber,
                // officialEmail: params.officialEmail,
                // officialLetter: params.officialLetter,
                // province: params.province,
                // district: params.district,
                // municipality: params.municipality,

                // body goes here
            };
        },
        onSuccess: ({ response, props, params }) => {
            console.log('success, data: ', response);
        },
        // onFailure: ({ error, params }) => {
        //     params.handlePending(false);
        //     if (Object.keys(error).length > 0) {
        //         const errorDesc = error[Object.keys(error)[0]];
        //         params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
        //     } else {
        //         params.handleResponseErrorMessage('Some problem occured, please try again.');
        //     }
        // },
        // onFatal: ({ params }) => {
        //     params.handlePending(false);
        //     console.log('No reply, server error');
        //     alert('Some problem occured, please contact IT support.');

        //     window.location.reload();
        // },
        // extras: { hasFile: true },
    },
    buildingGetRequest: {
        url: '/vizrisk-building/',
        method: methods.GET,
        onSuccess: ({ response, props, params }) => {
            console.log('building response', response);
        },
        query: ({ params }) => ({
            id: params.id,
        }),
        // onFailure: ({ error, params }) => {
        //     params.handlePending(false);
        //     if (Object.keys(error).length > 0) {
        //         const errorDesc = error[Object.keys(error)[0]];
        //         params.handleResponseErrorMessage(errorDesc[Object.keys(errorDesc)[0]][0]);
        //     } else {
        //         params.handleResponseErrorMessage('Some problem occured, please try again.');
        //     }
        // },
        // onFatal: ({ params }) => {
        //     params.handlePending(false);
        //     console.log('No reply, server error');
        //     alert('Some problem occured, please contact IT support.');

        //     window.location.reload();
        // },
        // extras: { hasFile: true },
    },


};


const HouseholdForm = (props) => {
    // const [buildingFormData, setFormData] = useState(initialValues);
    const { requests: {
        buildingPutRequest,
        buildingPostRequest,
        buildingGetRequest,
    },
    buildingData,
    osmId,
    enumData } = props;

    console.log('enum data', enumData);
    const [buildingFormData, setFormData] = useState({ ...buildingData });
    const { physicalFactors, socialFactors, economicFactor } = getBuildingOptions(enumData);
    const pfSelectTypes = getSelectTypes(physicalFactors);
    const pfInputTypes = getInputTypes(physicalFactors);
    const scSelectTypes = getSelectTypes(socialFactors);
    const scInputTypes = getInputTypes(socialFactors);
    const ecInputTypes = getInputTypes(economicFactor);
    const ecSelectTypes = getSelectTypes(economicFactor);
    console.log('form data:', buildingFormData);
    useEffect(() => {
        console.log('buildingFormData', buildingFormData);
    }, [buildingFormData]);

    useEffect(() => {
        if (buildingData && Object.keys(buildingData).length > 0) {
            if (
                buildingData.agricultureZeroToThreeMonth
            ) {
                setFormData({
                    ...buildingFormData,
                    suffency: '<3',
                });
            } else if (buildingData.agricultureSevenToNineMonth) {
                setFormData({
                    ...buildingFormData,
                    suffency: '7-9',
                });
            } else if (
                buildingData.agricultureNineToTwelveMonth
            ) {
                setFormData({
                    ...buildingFormData,
                    suffency: '9-12',
                });
            } else if (
                buildingData.agricultureFourToSixMonth
            ) {
                setFormData({
                    ...buildingFormData,
                    suffency: '4-6',
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFoundation = (e, type) => {
        if (type === 'Sufficiency of Agriculture product (Months)') {
            if (e.target.value === '9-12') {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: true,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: false,
                });
            } else if (e.target.value === '7-9') {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: true,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: false,
                });
            } else if (e.target.value === '4-6') {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: true,
                });
            } else if (e.target.value === '4-6') {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: true,
                    agricultureFourToSixMonth: false,
                });
            }
        } else {
            setFormData({
                ...buildingFormData,
                [refData[type]]: e.target.value,
            });
        }
    };
    console.log('props', props);
    // buildingGetRequest.setDefaultParams({
    //     id: buildingData.id,
    // });

    const handleSave = () => {
        console.log('buildingData', buildingData);
        if (buildingData && Object.keys(buildingData).length > 0 && buildingData.id) {
            console.log('doing put request ... ');
            buildingPutRequest.do({
                data: buildingFormData,
                id: buildingData.id,
            });
        } else {
            console.log('doing post request');
            buildingPostRequest.do({
                data: buildingFormData,
                osmId,
            });
        }
    };


    return (
        <div className={styles.formContainer}>
            <div className={styles.section}>
                <h2>PHYSICAL FACTORS</h2>
                {
                    pfSelectTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {physicalFactors.filter(pf => pf.title === type)[0].options
                                    .map((item: string) => <option value={item}>{item}</option>)
                                }
                            </select>
                        </div>

                    ))
                }
                {
                    pfInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }
            </div>
            <div className={styles.section}>
                <h2>SOCIAL FACTORS</h2>
                {
                    scSelectTypes.map((type: string, idx: number) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, idx, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {socialFactors.filter(pf => pf.title === type)[0].options
                                    .map((item: string) => <option value={item}>{item}</option>)

                                }
                            </select>
                        </div>

                    ))
                }
                {
                    scInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }

            </div>
            <div className={styles.section}>
                <h2>ECONOMIC FACTORS</h2>
                {
                    ecSelectTypes.map((type: string, idx: number) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, idx, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {
                                    economicFactor.filter(pf => pf.title === type)[0].options
                                        .map((item: string) => <option value={item}>{item}</option>)
                                }
                            </select>
                        </div>

                    ))
                }
                {
                    ecInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={buildingFormData[refData[type]]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }
            </div>
            <button
                type="button"
                onClick={handleSave}
                className={styles.saveBtn}
            >
                Save/Update
            </button>
        </div>
    );
};

export default connect(undefined, undefined)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            HouseholdForm,
        ),
    ),
);
