/* eslint-disable max-len */
/* eslint-disable css-modules/no-undef-class */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import styles from './styles.scss';
import {
    refData,
    getBuildingOptions,
    getSelectTypes,
    getInputTypes,
} from './formData';
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

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    buildingPostRequest: {
        url: '/vizrisk-building/',
        method: methods.POST,
        body: ({ params }) => {
            if (!params) {
                return {};
            }
            return {
                osmId: params.osmId,
                ...params.data,
            };
        },
        onSuccess: ({ response, props, params }) => {
            params.handlePostSuccess(response);
        },
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

            };
        },
        onSuccess: ({ response, props, params }) => {
            params.handlePostSuccess(response);
        },
    },
    buildingGetRequest: {
        url: ({ params }) => `/vizrisk-building/${params.newId}/`,
        method: methods.GET,
        onSuccess: ({ response, props, params }) => {
            params.handleGetSuccess(response);
        },
        query: ({ params }) => ({
            id: params.id,
        }),
    },


};


const HouseholdForm = (props) => {
    // const [buildingFormData, setFormData] = useState(initialValues);
    const {
        requests: {
            buildingPutRequest,
            buildingPostRequest,
            buildingGetRequest,
        },
        buildingData,
        osmId,
        enumData,
        handleShowForm,
    } = props;

    const [buildingFormData, setFormData] = useState({ ...buildingData });
    const [pending, setPending] = useState(false);
    const { physicalFactors, socialFactors, economicFactor } = getBuildingOptions(enumData);
    const pfSelectTypes = getSelectTypes(physicalFactors);
    const pfInputTypes = getInputTypes(physicalFactors);
    const scSelectTypes = getSelectTypes(socialFactors);
    const scInputTypes = getInputTypes(socialFactors);
    const ecInputTypes = getInputTypes(economicFactor);
    const ecSelectTypes = getSelectTypes(economicFactor);


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

    const handleGetSuccess = (resp) => {
        setPending(false);
        // hiding form
        handleShowForm(false, resp);
    };
    const handlePostSuccess = (response) => {
        buildingGetRequest.do({
            newId: response.id,
            handleGetSuccess,
        });
    };

    const handleSave = () => {
        console.log('osmid', osmId);
        console.log('osmid type', typeof osmId);
        console.log('rounded', parseInt(osmId, 10));
        setFormData({ ...buildingFormData, osmId: parseInt(osmId, 10) });
        if (buildingData && Object.keys(buildingData).length > 0 && buildingData.id) {
            setPending(true);
            buildingPutRequest.do({
                data: buildingFormData,
                id: buildingData.id,
                handlePostSuccess,
            });
        } else {
            buildingPostRequest.do({
                data: buildingFormData,
                osmId: parseInt(osmId, 10),
                handlePostSuccess,
            });
        }
    };

    const handleCancel = () => {
        handleShowForm(false, buildingData);
    };
    return (
        <>
            {
                pending

                    ? (
                        <div className={styles.loaderInfo}>
                            <Loader color="#fff" className={styles.loader} />
                        </div>
                    )
                    : (
                        <div className={styles.formContainer}>
                            <div className={styles.section}>
                                <p>PHYSICAL FACTORS</p>
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
                                <p>SOCIAL FACTORS</p>
                                {
                                    scSelectTypes.map((type: string, idx: number) => (
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
                                <p>ECONOMIC FACTORS</p>
                                {
                                    ecSelectTypes.map((type: string) => (
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
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={styles.saveBtn}
                            >
                Cancel
                            </button>
                        </div>
                    )
            }
        </>
    );
};

export default connect(undefined, undefined)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            HouseholdForm,
        ),
    ),
);
