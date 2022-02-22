/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { InputLabel,
    MenuItem,
    FormControl,
    FormHelperText,
    Select,
    Modal,
    Box,
    Grid,
    TextField } from '@mui/material';

import SuccessfullyAdded from 'src/admin/components/SucessfullyAdded';
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
};

const AdminForm = (props) => {
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [ward, setWard] = useState('');
    const [wardId, setWardId] = useState();
    const { handleClose } = props;

    const {
        userDataMain,
        adminPage: {
            adminDataMain,
        },
        provinces,
        districts,
        municipalities,
        wards,
    } = props;

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
    const [formDataState, setformDataState] = useState(formData);
    const handleChange = (e, name) => {
        setformDataState({ ...formDataState, [name]: e.target.value });
    };

    const handlePostData = () => {
        console.log('posting');
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

    useEffect(() => {
        props.requests.admin.do({ setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (ward !== '') {
            setWardId(wards
                .filter(item => item.municipality === Number(municipality))
                .filter(item => item.title === String(ward))[0].id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ward]);
    return (
        <>
            {(loading) ? <div>Loading</div>
                : (
                    <form>
                        <Box>
                            <div className={styles.myForm}>
                                <div className={styles.title}>
                                    <h3>Geographical Information</h3>
                                </div>
                                <div className={styles.myRow}>
                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
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

                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                                        <TextField
                                            size="small"
                                            select
                                            onChange={e => setWard(e.target.value)}
                                            label="Ward"
                                            value={ward}
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
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            value={formDataState.userName}
                                            onChange={e => handleChange(e, 'userName')}
                                            id="outlined-basic"
                                            label="Username"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <span style={{ position: 'relative', top: '18px', left: '15px' }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            type="password"
                                            value={formDataState.password}
                                            onChange={e => handleChange(e, 'password')}
                                            id="outlined-basic"
                                            label="Password"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            type="password"
                                            value={formDataState.confirmPassword}
                                            onChange={e => handleChange(e, 'confirmPassword')}
                                            id="outlined-basic"
                                            label="Confirm Password"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                </div>

                                <div className={styles.myRow}>
                                    <div className={styles.title}>
                                        <h3>User Information</h3>
                                    </div>
                                </div>
                                <div className={styles.myRow}>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            value={formDataState.firstName}
                                            onChange={e => handleChange(e, 'firstName')}
                                            id="outlined-basic"
                                            label="First Name"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            value={formDataState.email}
                                            onChange={e => handleChange(e, 'email')}
                                            id="outlined-basic"
                                            label="E-Mail Address"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
                                        <TextField
                                            size="small"
                                            value={formDataState.institution}
                                            onChange={e => handleChange(e, 'institution')}
                                            id="outlined-basic"
                                            label="Institution"
                                            variant="outlined"
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 420 }}>
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
                                    <FormControl sx={{ m: 1, minWidth: 860 }}>
                                        <TextField
                                            fullWidth
                                            select
                                            size="small"
                                            defaultValue={'null'}
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
                                        <button className={styles.submitButtons} onClick={handleClose} type="submit">Close</button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </form>
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
