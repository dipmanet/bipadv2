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

    useEffect(() => {
        props.requests.admin.do({ setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePostData = (formData) => {
        console.log(formData);
    };

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
                                    <div className={styles.myCol}>
                                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                                            <TextField
                                                fullWidth
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
                                    </div>
                                    <div className={styles.myCol}>
                                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                                            <TextField
                                                fullWidth
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
                                    </div>
                                    <div className={styles.myCol}>

                                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                                            <TextField
                                                fullWidth
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
                                    </div>
                                    <div className={styles.myCol}>
                                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                onChange={e => setWard(e.target.value)}
                                                label="Ward"
                                                value={ward}
                                            >
                                                {
                                                    wards
                                                        .filter(item => item.municipality === municipality)
                                                        .map(item => Number(item.title)).sort((a, b) => a - b)
                                                        .map(item => (
                                                            <MenuItem key={item} value={item}>{item}</MenuItem>
                                                        ))}
                                            </TextField>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className={styles.myRow}>
                                    <div className={styles.title}>
                                        <h3>Login Information</h3>
                                    </div>
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
