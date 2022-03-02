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
            ordering: '-id',
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
            props.setAdminPage({
                adminDataMainId: [],
            });
        },
        onFailure: ({ error, props }) => {
            // TODO: handle error
            console.error('server failure', error);
        },
        onFatal: ({ error }) => {
            console.error('server failure', error);
        },
    },
    userPut: {
        url: ({ params }) => (`/user/${params.id}/`),
        method: methods.PATCH,
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
    role: '',
};

const validationSchema = {
    userName: null,
    password: null,
    confirmPassword: null,
    serverError: null,
};

const AdminForm = (props) => {
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [municipality, setMunicipality] = useState();
    const [ward, setWard] = useState();
    const [wardName, setwardName] = useState('');
    const { handleClose } = props;
    const [formDataState, setformDataState] = useState(formData);
    const [validationError, setvalidationError] = useState(validationSchema);
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
        setProvince(userDataMain.profile.province);
        setDistrict(userDataMain.profile.district);
        setMunicipality(userDataMain.profile.municipality);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // if (!loadingAdminGetId) {
        if (adminDataMainId.id) {
            setformDataState({ ...formDataState,
                userName: adminDataMainId.username,
                email: adminDataMainId.email,
                firstName: adminDataMainId.firstName,
                lastName: adminDataMainId.lastName,
                phoneNumber: adminDataMainId.phoneNumber,
                role: adminDataMainId.profile.role,
                institution: adminDataMainId.profile.institution,
                designation: adminDataMainId.profile.designation });
        }
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (province) {
            setSubfix(`${provinces.filter(item => item.id === province)[0].code}_`);
        }
        if (district) {
            setSubfix(`${districts.filter(item => item.id === district)[0].code}_`);
        }
        if (municipality) {
            setSubfix(`${municipalities.filter(item => item.id === municipality)[0].code}_`);
        }
        if (wardName) {
            setSubfix(`${municipalities.filter(item => item.id === municipality)[0].code}_ward_${wardName}_`);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [province, district, municipality, ward]);

    const userDataPost = {
        profile: {
            phone_number: formDataState.phoneNumber,
            role: formDataState.role,
            institution: formDataState.institution,
            designation: formDataState.designation,
            ward,
            municipality: userDataMain.profile.municipality || municipality,
            province: userDataMain.profile.province || province,
            district: userDataMain.profile.district || district,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${subfix}${formDataState.userName}`,
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
            municipality: userDataMain.profile.municipality || municipality,
            province: userDataMain.profile.province || province,
            district: userDataMain.profile.district || district,
        },
        first_name: formDataState.firstName,
        last_name: formDataState.lastName,
        username: `${subfix}${formDataState.userName}`,
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
        if (!adminDataMainId && (!formDataState.userName || !formDataState.password || !formDataState.confirmPassword)) {
            const pass = { ...validationError };
            if (!formDataState.userName) {
                pass.userName = 'This field is required';
            }
            if (!formDataState.password) {
                pass.password = 'This field is required';
            }
            if (!formDataState.confirmedPassword) {
                pass.confirmPassword = 'This field is required';
            }
            setvalidationError(pass);
        } else if (!adminDataMainId.id) {
            props.requests.userPost.do({ body: userDataPost, setvalidationError });
        } else {
            props.requests.userPut.do({ id: adminDataMainId.id, body: userDataPatch, setvalidationError });
        }
        setformDataState(formData);
        setwardName('');
    };

    useEffect(() => {
        props.requests.admin.do({ setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
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
                            {(userDataMain.isSuperuser || userDataMain.profile.region === 'municipality')
                                && (
                                    <div className={styles.title}>
                                        <h3>Geographical Information</h3>
                                    </div>
                                )}
                            <div className={styles.myRow}>
                                {userDataMain.isSuperuser
                                && (
                                <>
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
                                </>
                                )}
                                {(userDataMain.isSuperuser || userDataMain.profile.region === 'municipality')
                                && (
                                <>
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
                                </>
                                )}
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
                                            {formDataState.userName && `${subfix}${formDataState.userName}`}
                                        </span>
                                        {' '}

                                    </span>
                                </FormControl>
                            </div>
                            {!adminDataMainId && (
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
                            )}
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
