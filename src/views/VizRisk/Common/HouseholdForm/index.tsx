/* eslint-disable max-len */
/* eslint-disable css-modules/no-undef-class */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import styles from './styles.scss';
import {
    refData,
    getBuildingOptions,
    getSelectTypes,
    getInputTypes,
} from './formData';


interface Props {

}

interface Params {

}

const useStyles = makeStyles({
    select: {
        color: '#ffffff !important',
        padding: '10px 0',
        width: '100%',
        fontSize: '13px',
        borderBottomColor: '#dddddd !important',
        '& input::placeholder': {
            fontSize: '12px',
        },
        '.MuiSelect-select': {
            borderBottomColor: 'red',
        },
    },
    label: {
        fontSize: '12px',
        color: '#dddddd',
    },
    cssLabel: {
        color: 'white',
        fontSize: '13px',
        '&$cssFocused': {
            color: '#dddddd',
        },
    },
    cssFocused: {},
    cssUnderline: {
        color: '#dddddd',
        '&:after': {
            borderBottomColor: '#dddddd',
        },
    },
    formControl: {
        width: '100%',
        margin: '15px 0',
        borderBottomColor: '#dddddd',
    },
});


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
        method: methods.PATCH,
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
    const classes = useStyles();
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
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: true,
                    agricultureFourToSixMonth: false,
                });
            } else if (buildingData.agricultureSevenToNineMonth) {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: true,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: false,
                });
            } else if (
                buildingData.agricultureNineToTwelveMonth
            ) {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: true,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: false,
                });
            } else if (
                buildingData.agricultureFourToSixMonth
            ) {
                setFormData({
                    ...buildingFormData,
                    agricultureNineToTwelveMonth: false,
                    agricultureSevenToNineMonth: false,
                    agricultureZeroToThreeMonth: false,
                    agricultureFourToSixMonth: true,
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
                [refData[type]]: e.target.value || null,
            });
        }
    };
    const handleInput = (e, type) => {
        let val = null;
        if (Number(e.target.value) >= 0) {
            val = Number(e.target.value);
        }

        setFormData({
            ...buildingFormData,
            [refData[type]]: val,
        });
    };

    const handleGetSuccess = (resp) => {
        setPending(false);
        // hiding form
        handleShowForm(false, resp);

        // update building data
    };
    const handlePostSuccess = (response) => {
        const { appendBuildingData } = props;
        buildingGetRequest.do({
            newId: response.id,
            handleGetSuccess,
        });
    };

    const handleSave = () => {
        setFormData({ ...buildingFormData, osmId: parseInt(osmId, 10) });
        if (buildingData && Object.keys(buildingData).length > 0 && buildingData.id) {
            setPending(true);
            buildingPutRequest.do({
                data: buildingFormData,
                id: buildingData.id,
                handlePostSuccess,
            });
        } else {
            setPending(true);
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
                            <p className={styles.loaderText}>
                                Saving Household Data...
                            </p>
                        </div>
                    )
                    : (
                        <div className={styles.formContainer}>
                            <div className={styles.section}>
                                <p>PHYSICAL FACTORS</p>
                                {
                                    pfSelectTypes.map((type: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>
                                                <Select
                                                    classes={{
                                                        root: classes.select,
                                                        select: classes.cssUnderline,
                                                    }}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: 'center',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        getContentAnchorEl: null,
                                                    }}

                                                    placeholder={`Please Enter ${type}`}
                                                    value={buildingFormData[refData[type]]}
                                                    onChange={e => handleFoundation(e, type)}
                                                    className={styles.select}

                                                >

                                                    <MenuItem value="" disabled selected>
                                                        {physicalFactors.filter(pf => pf.title === type)[0].placeholder}
                                                    </MenuItem>
                                                    {physicalFactors.filter(pf => pf.title === type)[0].options
                                                        .map((item: string) => <MenuItem value={item}>{item}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>

                                    ))
                                }
                                {
                                    pfInputTypes.map((type: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>
                                                <Input
                                                    classes={{
                                                        root: classes.select,
                                                        underline: classes.cssUnderline,

                                                    }}
                                                    placeholder={`Please Enter ${type}`}
                                                    type="number"
                                                    value={Number(buildingFormData[refData[type]])}
                                                    onChange={e => handleInput(e, type)}
                                                    // className={styles.selectElement}
                                                    className={styles.select}

                                                />
                                            </FormControl>
                                        </div>

                                    ))
                                }
                            </div>
                            <div className={styles.section}>
                                <p>SOCIAL FACTORS</p>
                                {
                                    scSelectTypes.map((type: any, idx: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>

                                                <Select
                                                    label={type}
                                                    placeholder={`Please Enter ${type}`}
                                                    value={buildingFormData[refData[type]]}
                                                    onChange={e => handleFoundation(e, type)}
                                                    className={styles.select}
                                                    classes={{
                                                        underline: classes.cssUnderline,
                                                        root: classes.select,
                                                    }}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        getContentAnchorEl: null,
                                                    }}
                                                >
                                                    <MenuItem value="" disabled selected>
                                                        {socialFactors.filter(pf => pf.title === type)[0].placeholder}
                                                    </MenuItem>
                                                    {socialFactors.filter(pf => pf.title === type)[0].options
                                                        .map((item: string) => <MenuItem value={item}>{item}</MenuItem>)

                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>

                                    ))
                                }
                                {
                                    scInputTypes.map((type: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>

                                                <Input
                                                    classes={{
                                                        underline: classes.cssUnderline,
                                                        root: classes.select,
                                                    }}
                                                    placeholder={`Please Enter ${type}`}
                                                    type="number"
                                                    value={buildingFormData[refData[type]]}
                                                    onChange={e => handleInput(e, type)}
                                                    className={styles.select}
                                                />
                                            </FormControl>
                                        </div>

                                    ))
                                }

                            </div>
                            <div className={styles.section}>
                                <p>ECONOMIC FACTORS</p>
                                {
                                    ecSelectTypes.map((type: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>

                                                <Select
                                                    label={type}
                                                    classes={{
                                                        underline: classes.cssUnderline,
                                                        root: classes.select,
                                                    }}
                                                    placeholder={`Please Enter ${type}`}
                                                    value={buildingFormData[refData[type]]}
                                                    onChange={e => handleFoundation(e, type)}
                                                    className={styles.select}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        },
                                                        transformOrigin: {
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        },
                                                        getContentAnchorEl: null,
                                                    }}
                                                >
                                                    <MenuItem value="" disabled selected>
                                                        {economicFactor.filter(pf => pf.title === type)[0].placeholder}
                                                    </MenuItem>
                                                    {
                                                        economicFactor.filter(pf => pf.title === type)[0].options
                                                            .map((item: string) => <MenuItem value={item}>{item}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>

                                    ))
                                }
                                {
                                    ecInputTypes.map((type: any) => (
                                        <div className={styles.inputContainer}>
                                            <FormControl classes={{ root: classes.formControl }}>

                                                <InputLabel
                                                    classes={{
                                                        root: classes.cssLabel,
                                                        focused: classes.cssFocused,
                                                    }}
                                                >
                                                    {type}
                                                </InputLabel>

                                                <Input
                                                    classes={{
                                                        underline: classes.cssUnderline,
                                                        root: classes.select,
                                                    }}
                                                    placeholder={`Please Enter ${type}`}
                                                    type="number"
                                                    value={buildingFormData[refData[type]]}
                                                    onChange={e => handleInput(e, type)}
                                                    className={styles.select}
                                                />
                                            </FormControl>
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
