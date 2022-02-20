/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { createContext, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { MenuItem, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
// import { RootState } from '../../Redux/store';
// import { provinceData, districtData, municipalityData, wardData } from '../../Redux/actions';
import SuccessfullyAdded from 'src/admin/components/SucessfullyAdded';
import styles from './styles.module.scss';
// import { adminDataPost, adminDataPut } from '../../Redux/adminActions/adminActions';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetAdminPageAction } from '#actionCreators';
import { adminPageSelector, districtsSelector, municipalitiesSelector, provincesSelector, userSelector, wardsSelector } from '#selectors';


const mapStateToProps = (state: AppState): PropsFromAppState => ({
    adminPage: adminPageSelector(state),
    userDataMain: userSelector(state),
    provincialData: provincesSelector(state),
    districtDataMain: districtsSelector(state),
    municipalityDataMain: municipalitiesSelector(state),
    wardDataMain: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAdminPage: params => dispatch(SetAdminPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    admin: {
        url: '/user/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            limit: -1,
            province: params.province,
            district: params.district,
            munincipality: params.municipality,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setAdminPage({
                adminDataMain: response.results,
            });
            params.setLoading(false);
        },
    },
};

export const LngLatContext = createContext([]);

const AdminForm = (props) => {
    const { handleClose, toggleForm } = props;
    const [provinceName, setprovinceName] = useState('');
    const [districtName, setdistrictName] = useState('');
    const [municipalityName, setmunicipalityName] = useState('');
    const [wardName, setwardName] = useState('');
    const [provinceDataIs, setProvinceDataIs] = useState([]);
    const [districtDataIs, setdistrictDataIs] = useState([]);
    const [municipalityDataIs, setmunicipalityDataIs] = useState([]);
    const [wardDataIs, setwardDataIs] = useState([]);
    const [provinceId, setprovinceId] = useState(0);
    const [districtId, setdistrictId] = useState(0);
    const [municipalityId, setmunicipalityId] = useState(0);
    const [wardId, setwardId] = useState(0);
    const [validationError, setvalidationError] = useState('');
    const [loggedUserName, setloggedUserName] = useState('');
    const [passwordNotMatching, setpasswordNotMatching] = useState('');
    const [successFullAdd, setsuccessFullAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        userDataMain,
        adminPage: {
            adminDataMain,
        },
        provincialData,
        districtDataMain,
        municipalityDataMain,
        wardDataMain,

    } = props;
    // const { loadingUser, userDataMain } = useSelector((state: RootState) => state.user);
    // useEffect(() => {
    //     if (userDataMain && userDataMain.profile && userDataMain.profile.province) {
    //         dispatch(districtData(userDataMain.profile.province));
    //     } else {
    //         dispatch(provinceData());
    //     }
    //     if (userDataMain && userDataMain.profile && userDataMain.profile.district) {
    //         dispatch(districtData(userDataMain.profile.district));
    //     }
    //     if (userDataMain && userDataMain.profile && userDataMain.profile.municipality) {
    //         dispatch(wardData(userDataMain.profile.municipality));
    //     }
    // }, [dispatch, userDataMain]);

    // const { provincialData, loading } = useSelector((state: RootState) => state.province);
    // const { districtDataMain, loadingDistrict } = useSelector((state: RootState) => state.district);
    // const { municipalityDataMain, loadingMunicipality } = useSelector((state: RootState) => state.municipality);
    // const { wardDataMain, loadingWard } = useSelector((state: RootState) => state.ward);

    const formData = {
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        institution: '',
        designation: '',
        role: 'null',
    };
    // const { adminDataMainId, loadingAdminGetId } = useSelector((state: RootState) => state.adminGetId);

    // const { loadingAdminPost, postError } = useSelector((state: RootState) => state.adminPostreducer);

    // useEffect(() => {
    //     if (!loadingAdminGetId) {
    //         if (adminDataMainId.id) {
    //             setformDataState({ ...formDataState,
    //                 userName: adminDataMainId.username,
    //                 email: adminDataMainId.email,
    //                 firstName: adminDataMainId.firstName,
    //                 lastName: adminDataMainId.lastName,
    //                 phoneNumber: adminDataMainId.id,
    //                 role: adminDataMainId.profile.role,
    //                 institution: adminDataMainId.profile.institution,
    //                 designation: adminDataMainId.profile.designation });
    //         }
    //     }
    // }, [formDataState]);

    useEffect(() => {
        if (userDataMain && userDataMain.profile && userDataMain.profile.province && provincialData && provincialData.length > 0) {
            const nameOfProvince = provincialData.filter(item => item.id === userDataMain.profile.province).map(item => item.title)[0];
            setprovinceName(nameOfProvince);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.district && districtDataMain && districtDataMain.length > 0) {
            const nameOfDistrict = districtDataMain.filter(item => item.id === userDataMain.profile.district).map(item => item.title)[0];
            setdistrictName(nameOfDistrict);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.municipality && municipalityDataMain && municipalityDataMain.length > 0) {
            const nameOfMunicipality = municipalityDataMain.filter(item => item.id === userDataMain.profile.municipality).map(item => item.title)[0];
            setmunicipalityName(nameOfMunicipality);
        }
        if (userDataMain && userDataMain.profile && userDataMain.profile.ward && wardDataMain && wardDataMain.length > 0) {
            const nameOfWard = wardDataMain.filter(item => item.id === userDataMain.profile.ward).map(item => item.title)[0];
            setprovinceName(nameOfWard);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataMain]);


    const [formDataState, setformDataState] = useState(formData);

    const handleChange = (e, name) => {
        setformDataState({ ...formDataState, [name]: e.target.value });
    };


    useEffect(() => {
        // if (!loading) {
        setProvinceDataIs(provincialData);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const provinceIds = provinceDataIs.filter(item => item.title === provinceName).map(item => item.id)[0];
        if (provinceName) {
            // dispatch(districtData(provinceId));
            setprovinceId(provinceIds);
        }
    }, [provinceDataIs, provinceName]);


    useEffect(() => {
        // if (!loadingDistrict) {
        setdistrictDataIs(districtDataMain);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const districtIds = districtDataIs.filter(item => item.title === districtName).map(item => item.id)[0];
        if (districtName) {
            // dispatch(municipalityData(districtId));
            setdistrictId(districtIds);
        }
    }, [districtDataIs, districtName]);


    useEffect(() => {
        // if (!loadingMunicipality) {
        setmunicipalityDataIs(municipalityDataMain);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const munId = municipalityDataIs.filter(item => item.title === municipalityName).map(item => item.id)[0];
        if (municipalityName) {
            // dispatch(wardData(munId));
            setmunicipalityId(munId);
        }
    }, [municipalityDataIs, municipalityName]);


    useEffect(() => {
        // if (!loadingWard) {
        setwardDataIs(wardDataMain);
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userDataMain && Object.keys(userDataMain).length > 0) {
            setloggedUserName(userDataMain.username);
        }
    }, [userDataMain]);

    useEffect(() => {
        const wardIds = wardDataIs.filter(item => item.title === String(wardName)).map(item => item.id)[0];
        if (wardName) {
            setwardId(wardIds);
        }
    }, [wardDataIs, wardName]);

    const userDataPost = {
        profile: {
            phone_number: formDataState.phoneNumber,
            role: formDataState.role,
            institution: formDataState.institution,
            designation: formDataState.designation,
            ward: wardId,
            municipality: municipalityId,
            province: provinceId,
            district: districtId,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${loggedUserName}_${formDataState.userName}`,
        email: formDataState.email,
        password: formDataState.password,
    };

    const userDataPatch = {
        profile: {
            phone_number: formDataState.phoneNumber,
            role: formDataState.role,
            institution: formDataState.institution,
            designation: formDataState.designation,
            ward: wardId,
            municipality: municipalityId,
            province: provinceId,
            district: districtId,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${loggedUserName}_${formDataState.userName}`,
        email: formDataState.email,
    };


    const handlePostData = () => {
        // if (!provinceName || !municipalityName || !districtName || !wardName || !Object.values(formDataState)) {
        //     if (formDataState.password !== formDataState.confirmPassword) {
        //         setpasswordNotMatching('Password is not matching');
        //     }
        //     setvalidationError('All fields are required');
        // } else {
        //     setvalidationError(null);
        //     if (!loadingAdminGetId) {
        //         if (adminDataMainId.id) {
        //             dispatch(adminDataPut(adminDataMainId.id, userDataPatch));
        //         } else {
        //             dispatch(adminDataPost(userDataPost));
        //         }
        //     }
        //     setsuccessFullAdd(true);
        //     setmunicipalityName('');
        //     setwardName('');
        //     setformDataState(formData);
        // }
    };

    const handleOK = () => {
        setsuccessFullAdd(false);
    };


    return (
        <>
            {(loading) ? <div>Loading</div>
                : (
                    <Box>
                        <div className={styles.covid19MainFormPage}>
                            <div className={styles.twoSections}>
                                <div className={styles.mainForm}>
                                    <div className={styles.mainCovidDataEntrySection}>
                                        <p style={{ color: 'red' }}>{validationError}</p>
                                        {/* <p style={{color:'red'}}>{postError}</p> */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 className={styles.formGeneralInfo}>Geographical Information</h3>
                                            <CancelPresentationIcon onClick={handleClose} className={styles.closeButton} />
                                        </div>
                                        <div className={styles.fourInputSections}>
                                            <TextField
                                                select
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '0 14px',
                                                    },
                                                }}
                                                value={provinceName}
                                                error={validationError && !provinceName}
                                                helperText={(validationError && !provinceName) ? 'Field Required' : null}
                                                onChange={e => setprovinceName(e.target.value)}
                                                id="outlined-basic"
                                                label="Select Province"
                                                variant="outlined"
                                                // className={provinceName === '' && loadingDistrict ? styles.adminLvlSelectionDisabled
                                                //     : styles.adminLvlSelection}
                                            >
                                                {provinceDataIs && provinceDataIs.map(item => (
                                                    <MenuItem style={{ fontSize: 14 }} key={item.title} value={item.title}>{item.title}</MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 17,
                                                    },
                                                }}
                                                error={validationError && !districtName}
                                                // className={provinceName === '' && loadingDistrict ? styles.adminLvlSelectionDisabled
                                                //     : styles.adminLvlSelection}
                                                value={districtName}
                                                onChange={e => setdistrictName(e.target.value)}
                                                id="outlined-basicccc"
                                                label="Select District"
                                                variant="outlined"
                                                // disabled={loadingDistrict}
                                            >
                                                {districtDataIs && districtDataIs.map(item => (
                                                    <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                select
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 17,
                                                    },
                                                }}
                                                // className={districtName === '' || loadingMunicipality ? styles.adminLvlSelectionDisabled
                                                //     : styles.adminLvlSelection}
                                                value={municipalityName}
                                                onChange={e => setmunicipalityName(e.target.value)}
                                                id="outlined-basic2"
                                                label="Select Municipality"
                                                variant="outlined"
                                                error={validationError && !municipalityName}
                                            >
                                                {municipalityDataIs && municipalityDataIs.map(item => (
                                                    <MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                select
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 17,
                                                    },
                                                }}
                                                // className={municipalityName === '' || loadingWard ? styles.adminLvlSelectionDisabled
                                                //     : styles.adminLvlSelection}
                                                value={wardName}
                                                error={validationError && !wardName}
                                                onChange={e => setwardName(e.target.value)}
                                                id="outlined-basic"
                                                label="Select Ward"
                                                variant="outlined"
                                            >
                                                {wardDataIs && wardDataIs.map(item => Number(item.title)).sort((a, b) => a - b).map(item => (
                                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                                ))}
                                            </TextField>
                                        </div>

                                        <h3 className={styles.formGeneralInfo}>Login Information</h3>
                                        {/* <p style={{ color: 'red' }}>{postError ? postError.username : ''}</p> */}
                                        <TextField
                                            style={{ width: '48.5%' }}
                                            size="small"
                                            InputLabelProps={{
                                                style: {
                                                    fontSize: 14,
                                                    color: '#676767',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                            inputProps={{
                                                style: {
                                                    fontSize: 15,
                                                    padding: '4 14px',
                                                    height: 23,
                                                },
                                            }}
                                            value={formDataState.userName}
                                            onChange={e => handleChange(e, 'userName')}
                                            className={styles.hazardInducer}
                                            id="outlined-basic"
                                            label="Username"
                                            variant="outlined"
                                        />
                                        <span style={{ position: 'relative', top: '18px', left: '15px' }}>
                                            Your username will be :
                                            {' '}
                                            <span style={{ color: 'blue' }}>
                                                {formDataState.userName && `${userDataMain.username}_${formDataState.userName}`}
                                            </span>
                                            {' '}

                                        </span>

                                        <p style={{ color: 'red' }}>{passwordNotMatching}</p>
                                        <div className={styles.twoInputSections}>
                                            <TextField
                                                type="password"
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 23,
                                                    },
                                                }}
                                                value={formDataState.password}
                                                onChange={e => handleChange(e, 'password')}
                                                className={styles.hazardInducer}
                                                id="outlined-basic"
                                                label="Password"
                                                variant="outlined"
                                            />


                                            <TextField
                                                type="password"
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 23,
                                                    },
                                                }}
                                                value={formDataState.confirmPassword}
                                                onChange={e => handleChange(e, 'confirmPassword')}
                                                className={styles.hazardInducer}
                                                id="outlined-basic"
                                                label="Confirm Password"
                                                variant="outlined"
                                            />
                                        </div>


                                        <h3 className={styles.formGeneralInfo}>User Information</h3>
                                        <div className={styles.togglingSectionIndividual}>
                                            <div className={styles.twoInputSections}>
                                                <TextField
                                                    size="small"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontSize: 14,
                                                            color: '#676767',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                    inputProps={{
                                                        style: {
                                                            fontSize: 15,
                                                            padding: '4 14px',
                                                            height: 23,
                                                        },
                                                    }}
                                                    value={formDataState.firstName}
                                                    onChange={e => handleChange(e, 'firstName')}
                                                    className={styles.hazardInducer}
                                                    id="outlined-basic"
                                                    label="First Name"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    size="small"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontSize: 14,
                                                            color: '#676767',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                    inputProps={{
                                                        style: {
                                                            fontSize: 15,
                                                            padding: '4 14px',
                                                            height: 23,
                                                        },
                                                    }}
                                                    value={formDataState.lastName}
                                                    onChange={e => handleChange(e, 'lastName')}
                                                    className={styles.hazardInducer}
                                                    id="outlined-basic"
                                                    label="Last Name"
                                                    variant="outlined"
                                                />

                                            </div>

                                            <div className={styles.twoInputSections}>

                                                <TextField
                                                    size="small"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontSize: 14,
                                                            color: '#676767',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                    inputProps={{
                                                        style: {
                                                            fontSize: 15,
                                                            padding: '4 14px',
                                                            height: 23,
                                                        },
                                                    }}
                                                    value={formDataState.email}
                                                    onChange={e => handleChange(e, 'email')}
                                                    className={styles.hazardInducer}
                                                    id="outlined-basic"
                                                    label="E-Mail Address"
                                                    variant="outlined"
                                                />
                                                <TextField

                                                    size="small"
                                                    type="number"
                                                    InputLabelProps={{
                                                        style: {
                                                            fontSize: 14,
                                                            color: '#676767',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                    inputProps={{
                                                        style: {
                                                            fontSize: 15,
                                                            padding: '4 14px',
                                                            height: 23,
                                                        },
                                                    }}
                                                    value={formDataState.phoneNumber}
                                                    onChange={e => handleChange(e, 'phoneNumber')}
                                                    className={styles.hazardInducer}
                                                    id="outlined-basic"
                                                    label="Phone Number"
                                                    variant="outlined"
                                                />


                                            </div>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 23,
                                                    },
                                                }}
                                                value={formDataState.institution}
                                                onChange={e => handleChange(e, 'institution')}
                                                className={styles.hazardInducer}
                                                id="outlined-basic"
                                                label="Institution"
                                                variant="outlined"
                                            />
                                            {/* <div className={styles.twoInputSections}> */}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '4 14px',
                                                        height: 23,
                                                    },
                                                }}
                                                value={formDataState.designation}
                                                onChange={e => handleChange(e, 'designation')}
                                                className={styles.hazardInducer}
                                                id="outlined-basic"
                                                label="Designation"
                                                variant="outlined"
                                            />


                                            {/* </div> */}
                                            <h3 className={styles.formGeneralInfo}>User Role</h3>

                                            <TextField
                                                select
                                                size="small"
                                                fullWidth
                                                defaultValue={'null'}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        color: '#676767',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                                inputProps={{
                                                    style: {
                                                        fontSize: 15,
                                                        padding: '0 14px',
                                                    },
                                                }}
                                                value={formDataState.role}
                                                onChange={e => handleChange(e, 'role')}
                                                id="outlined-basic"
                                                label="Role"
                                                variant="outlined"
                                                className={styles.hazardInducer}
                                            >
                                                <MenuItem value="null">-</MenuItem>
                                                <MenuItem value="editor">Editor</MenuItem>
                                                <MenuItem value="validator">Validator</MenuItem>
                                                <MenuItem value="user">User</MenuItem>
                                            </TextField>
                                        </div>

                                        <div className={styles.saveOrAddButtons}>
                                            <button className={styles.submitButtons} onClick={handlePostData} type="submit">Submit</button>
                                            <button className={styles.submitButtons} onClick={handleClose} type="submit">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                )


            }

            {
                validationError && <p style={{ color: 'red' }}>{validationError}</p>
            }
            <Modal
                open={successFullAdd}
                onClose={handleOK}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <SuccessfullyAdded handleOK={handleOK} />
                </Box>
            </Modal>

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            AdminForm,
        ),
    ),
);
