/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MenuItem,
    FormControl,
    Box,
    TextField } from '@mui/material';

import styles from './styles.module.scss';

import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetAdminPageAction } from '#actionCreators';
import { adminPageSelector, districtsSelector, municipalitiesSelector, provincesSelector, userSelector, wardsSelector } from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    adminPage: adminPageSelector(state),
    userDataMain: userSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
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
    userPost: {
        url: '/user/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            console.log('posted data', response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
            }
        },

    },
};

const formData = {
    userName: null,
    password: null,
    confirmPassword: null,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    institution: '',
    designation: '',
    role: 'null',
};

const validationSchema = {
    userName: null,
    password: null,
    confirmPassword: null,
};

const AdminForm = (props) => {
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [ward, setWard] = useState('');
    const [provinceName, setprovinceName] = useState('');
    const [districtName, setdistrictName] = useState('');
    const [municipalityName, setmunicipalityName] = useState('');
    const [wardName, setwardName] = useState('');
    const { handleClose } = props;
    const [formDataState, setformDataState] = useState(formData);
    const [validationError, setvalidationError] = useState(validationSchema);
    const [loggedUserName, setloggedUserName] = useState('');
    const [subfix, setSubfix] = useState('');
    const {
        userDataMain,
        adminPage: {
            adminDataMain,
            adminDataMainId,
        },
        provinces,
        districts,
        municipalities,
        wards,
    } = props;

    useEffect(() => {
        if (userDataMain.profile.region === 'province') {
            setSubfix(provinces.filter(item => item.id === userDataMain.profile.province)[0].title);
        }
        if (userDataMain.profile.region === 'district') {
            setSubfix(districts.filter(item => item.id === userDataMain.profile.district)[0].title);
        }
        if (userDataMain.profile.region === 'municipality') {
            setSubfix(municipalities.filter(item => item.id === userDataMain.profile.municipality)[0].title);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userDataPost = {
        profile: {
            phone_number: formDataState.phoneNumber,
            role: formDataState.role,
            institution: formDataState.institution,
            designation: formDataState.designation,
            ward,
            municipality,
            province,
            district,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${subfix}_${formDataState.userName}`,
        email: formDataState.email,
        password: formDataState.password,
    };

    const userDataPatch = {
        profile: {
            phone_number: formDataState.phoneNumber,
            role: formDataState.role,
            institution: formDataState.institution,
            designation: formDataState.designation,
            ward,
            municipality,
            province,
            districts,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${loggedUserName}_${formDataState.userName}`,
        email: formDataState.email,
    };

    const handleChange = (e, name) => {
        e.preventDefault();
        const myerror = { ...validationError };
        switch (name) {
            case 'userName':
                myerror.userName = e.target.value.length < 1
                    ? 'This field is required'
                    : '';
                break;
            case 'password':
                myerror.password = e.target.value.length < 8
                    ? 'Password must be at least 8 characters long!'
                    : '';
                break;
            case 'confirmPassword':
                console.log('tetst', e.target.value, formDataState.confirmPassword);
                if (formDataState.password !== e.target.value) {
                    myerror.confirmPassword = 'Password does not match';
                } else {
                    myerror.confirmPassword = '';
                }
                break;
            default:
                break;
        }
        setvalidationError(myerror);
        setformDataState({ ...formDataState, [name]: e.target.value });
    };

    const handlePostData = () => {
        if (!formDataState.userName && !formDataState.password && !formDataState.confirmPassword) {
            const pass = { ...validationError };
            pass.userName = 'This field is required';
            pass.password = 'This field is required';
            pass.confirmPassword = 'This field is required';
            setvalidationError(pass);
        } else {
            props.requests.userPost.do({ body: userDataPost });
        }
        // console.info('Valid Form');
        // if (validateForm(validationError)) {
        //     // props.requests.userPost.do({ body: userDataPost });
        // } else {
        //     console.error('Invalid Form');
        // }
        // if (Object.values(validationError)) {
        //     console.log('threre is error', validationError.userNameError);
        // } else {
        //     console.log('testing validation error', validationError);
        //     if (!Object.values(validationError)) {
        //         console.log('there is error');
        //         // if (formDataState.password !== formDataState.confirmPassword) {
        //         //     setpasswordNotMatching('Password is not matching');
        //         // }
        //         // setvalidationError('All fields are required');
        //     } else {
        //         setvalidationError(null);
        //         if (adminDataMainId.id) {
        //         // dispatch(adminDataPut(adminDataMainId.id, userDataPatch));
        //         } else {
        //             console.log('posting submmit', userDataPost);
        //             props.requests.userPost.do({ body: userDataPost });
        //         // dispatch(adminDataPost(userDataPost));
        //         }
        //         setsuccessFullAdd(true);
        //         setmunicipalityName('');
        //         setwardName('');
        //         setformDataState(formData);
        //     }
        // }
    };


    useEffect(() => {
        const provinceId = provinces.filter(item => item.title === provinceName).map(item => item.id)[0];
        if (provinceName) {
            setProvince(provinceId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceName]);

    useEffect(() => {
        const districtId = districts.filter(item => item.title === districtName).map(item => item.id)[0];
        if (districtName) {
            setDistrict(districtId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [districtName]);


    useEffect(() => {
        const munId = municipalities.filter(item => item.title === municipalityName).map(item => item.id)[0];
        if (municipalityName) {
            // dispatch(wardData(munId));
            setMunicipality(munId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipalityName]);

    useEffect(() => {
        props.requests.admin.do({ setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log('testing ward change', wardName, municipality);
        if (municipality && wardName !== '') {
            setWard(wards
                .filter(item => item.municipality === municipality)
                .filter(item => item.title === String(wardName))[0].id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wardName]);

    return (
        <>
            {(loading) ? <div>Loading</div>
                : (
                    <Box>
                        <div className={styles.myForm}>
                            <div className={styles.title}>
                                <h3>Geographical Information</h3>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        select
                                        onChange={e => setProvince(e.target.value)}
                                        label="Province"
                                        value={province}

                                    >
                                        {provinces.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.title}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        select
                                        onChange={e => setDistrict(e.target.value)}
                                        label="District"
                                        value={district}

                                    >
                                        {
                                            districts
                                                .filter(item => item.province === province)
                                                .map(option => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.title}
                                                    </MenuItem>
                                                ))}
                                    </TextField>
                                </FormControl>

                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        select
                                        onChange={e => setMunicipality(e.target.value)}
                                        label="Municipality"
                                        value={municipality}
                                    >
                                        {
                                            municipalities
                                                .filter(item => item.district === district)
                                                .map(option => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.title}
                                                    </MenuItem>
                                                ))}
                                    </TextField>

                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        select
                                        onChange={e => setwardName(e.target.value)}
                                        label="Ward"
                                        value={wardName}
                                    >
                                        {
                                            wards
                                                .filter(item => item.municipality === municipality)
                                                .map(item => Number(item.title)).sort((a, b) => a - b)
                                                .map(idx => (
                                                    <MenuItem key={idx} value={idx}>{idx}</MenuItem>
                                                ))}
                                    </TextField>
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <div className={styles.title}>
                                    <h3>Login Information</h3>
                                </div>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.userName}
                                        onChange={e => handleChange(e, 'userName')}
                                        id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        error={validationError.userName}
                                        helperText={validationError.userName ? validationError.userName : null}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 2 }}>
                                    <span style={{ position: 'relative', top: '18px' }}>
                                        Your username will be :
                                        {' '}
                                        <span style={{ color: 'blue' }}>
                                            {formDataState.userName && `${userDataMain.username}_${formDataState.userName}`}
                                        </span>
                                        {' '}

                                    </span>
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        type="password"
                                        value={formDataState.password}
                                        onChange={e => handleChange(e, 'password')}
                                        id="outlined-basic"
                                        label="Password"
                                        variant="outlined"
                                        error={validationError.password}
                                        helperText={validationError.password ? validationError.password : null}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        type="password"
                                        value={formDataState.confirmPassword}
                                        onChange={e => handleChange(e, 'confirmPassword')}
                                        id="outlined-basic"
                                        label="Confirm Password"
                                        variant="outlined"
                                        error={validationError.confirmPassword}
                                        helperText={validationError.confirmPassword ? validationError.confirmPassword : null}
                                    />
                                </FormControl>
                            </div>

                            <div className={styles.myRow}>
                                <div className={styles.title}>
                                    <h3>User Information</h3>
                                </div>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.firstName}
                                        onChange={e => handleChange(e, 'firstName')}
                                        id="outlined-basic"
                                        label="First Name"
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.lastName}
                                        onChange={e => handleChange(e, 'lastName')}
                                        id="outlined-basic"
                                        label="Last Name"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.email}
                                        onChange={e => handleChange(e, 'email')}
                                        id="outlined-basic"
                                        label="E-Mail Address"
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.phoneNumber}
                                        onChange={e => handleChange(e, 'phoneNumber')}
                                        id="outlined-basic"
                                        label="Phone Number"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.institution}
                                        onChange={e => handleChange(e, 'institution')}
                                        id="outlined-basic"
                                        label="Institution"
                                        variant="outlined"
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        size="small"
                                        value={formDataState.designation}
                                        onChange={e => handleChange(e, 'designation')}
                                        id="outlined-basic"
                                        label="Designation"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <div className={styles.title}>
                                    <h3>User Role</h3>
                                </div>
                            </div>
                            <div className={styles.myRow}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        size="small"
                                        value={formDataState.role}
                                        onChange={e => handleChange(e, 'role')}
                                        id="outlined-basic"
                                        label="Role"
                                        variant="outlined"
                                    >
                                        <MenuItem value="null">-</MenuItem>
                                        <MenuItem value="editor">Editor</MenuItem>
                                        <MenuItem value="validator">Validator</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </TextField>
                                </FormControl>
                            </div>
                            <div className={styles.myRow}>
                                <div className={styles.saveOrAddButtons}>
                                    <button className={styles.submitButtons} onClick={handlePostData} type="submit">Submit</button>
                                    <button className={styles.submitButtons} onClick={handleClose} type="button">Close</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                )
            }
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
