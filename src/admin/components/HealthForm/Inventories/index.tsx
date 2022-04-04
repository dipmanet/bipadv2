/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { connect } from 'react-redux';
import Healthinfrastructure from 'src/admin/views/Healthinfrastructure';
import AccentHeading from '../../AccentHeading';
import NextButton from '../../NextButton';
import { FormDataType, institutionDetails } from '../utils';
// import { setInventoryItem, getInventoryItem } from '../../../Redux/actions';
// import { RootState } from '../../../Redux/store';
import InventoryTable from './InventoryTable';
import EditModal from './EditModal';

import styles from './styles.module.scss';


import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
    healthInfrastructurePageSelector,
    userSelector,
} from '#selectors';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    getInventoryData: {
        url: '/inventory/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            resource: `${params.resource}`,
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                inventoryData: response.results,
            });
        },
    },
    getInventoryItem: {
        url: '/inventory-item/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                inventoryItem: response.results,
            });
        },
    },
};

const baseUrl = process.env.REACT_APP_API_SERVER_URL;
type EventTarget = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
| SelectChangeEvent<string>;

interface InventoryItem {
    id: number;
    category: string;
    title: string;
    titleNp: string;
    description: string;
    unit: string;
    unitNp: string;
}

interface OurState{
    resourceID: number;
    loadingInv: boolean;
    inventoryErr: Record<string, unknown>;
    inventoryData?: {unit: string | number};
    inventoryItem: Record<string, unknown>;
    invItemSuccess: boolean;
    invItemError: Record<string, unknown>;
    health: {resourceID: number;inventoryItem: []};
}
interface Item {
    unit: string | number;
}
interface InventoryData{
    id: number;
    item: InventoryItem;
    itemId: number;
    createdOn: string;
    modifiedOn: string;
    quantity: number;
    description: string;
    status: string;
    incharge: string;
    resource: number;
    unit: string;
    title: string;
}


interface Props{
    formData: FormDataType;
    progress: number;
    getActiveMenu: (e: number) => void;
    resetForm: () => void;
    activeMenu: number;
    handleProgress: (e: number) => void;

}

const Inventories = (props: Props): JSX.Element => {
    const {
        // handleInvData,
        formData,
        progress,
        getActiveMenu,
        activeMenu,
        resetForm,
        userDataMain,
        setHealthInfrastructurePage,
        healthInfrastructurePage: {
            resourceID,
            inventoryItem,
            inventoryData,
        },
    } = props;

    const [inventoryNeeded, setNeeded] = useState<boolean | null>(false);
    const [invData, setInv] = useState([]);
    const [units, setUnits] = useState([]);
    const [inventory, setinventory] = useState('');
    const [quantity, setquantity] = useState('');
    const [unit, setunit] = useState('');
    const [openEditModal, setEditOpen] = useState(false);
    const [editRowData, setEditRowData] = useState('');
    // const dispatch = useDispatch();
    // const { resourceID, inventoryItem, inventoryData } =
    // useSelector((state: OurState) => state.health);
    const [fieldsToDisable, setDisableFields] = useState([]);
    // const { userDataMain } = useSelector((state: RootState) => state.user);
    const getDisabled = (field: string) => fieldsToDisable.includes(field);

    useEffect(() => {
        const allFields = Object.keys(institutionDetails);
        const fieldsToGiveValidator = ['is_verified', 'is_approved', 'verfication_message'];
        window.scrollTo({ top: 400, left: 0 });
        if (userDataMain.isSuperuser) {
            setDisableFields([]);
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'validator'
        ) {
            setDisableFields(allFields.filter(f => !fieldsToGiveValidator.includes(f)));
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'user'
        ) {
            setDisableFields(allFields.filter(f => fieldsToGiveValidator.includes(f)));
        } else if (
            userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'editor'
        ) {
            setDisableFields([]);
        } else {
            setDisableFields(allFields);
        }
    }, [userDataMain.isSuperuser, userDataMain.profile]);

    const handleClose = () => {
        setEditOpen(false);
    };

    const openModal = () => {
        setEditOpen(true);
    };

    const handleInvNeeded = (e, item) => {
        if (item === 'No') {
            setNeeded(false);
        } else {
            setNeeded(true);
        }
    };

    useEffect(() => {
        if (resourceID) {
            props.requests.getInventoryItem.do();
            props.requests.getInventoryData.do({ resource: resourceID });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceID]);

    // useEffect(() => {
    //     props.requests.getInventoryData.do({ resource: resourceID });
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const handleInvAdd = () => {
        // setInv([...invData, { [fN]: e.target.value }]);
        const postData = { itemId: 1, quantity, description: inventory, resource: resourceID };
        axios
            .post(`${baseUrl}/inventory/`, postData, {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                props.requests.getInventoryData.do({ resource: resourceID });
                // dispatch(getInventoryItem(resourceID));
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    // if(error.response.data){
                    // const msgKey = Object.keys(error.response.data)[0];
                    // if(typeof error.response.data[msgKey] === 'array'){
                    // setError(error.response.data[msgKey][0]);
                    // } else {
                    // setError(`${msgKey}: ${error.response.data[msgKey]}`);
                    // }
                    // }
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    };


    const handleInventory = (e: EventTarget) => {
        setinventory(e.target.value);
    };
    const handleQuantity = (e: EventTarget) => {
        setquantity(e.target.value);
    };
    const handleUnit = (e: EventTarget) => {
        setunit(e.target.value);
    };

    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
        axios.get(`${baseUrl}/inventory-item/`).then(
            (data) => {
                setHealthInfrastructurePage({ inventoryItem: data.results });
            },
        );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (inventoryItem) {
            const uV = inventoryItem.map(item => item.unit);
            const temp = [...Array.from(new Set(uV))];
            setUnits(temp);
        }
    }, [inventoryItem]);
    useEffect(() => {
        if (resourceID) {
            props.requests.getInventoryData.do({ resource: resourceID });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTableClick = () => {
        console.log('fds');
    };

    const getEditRowData = (data) => {
        setEditRowData(data);
    };

    return (

        <>
            <div className={styles.rowTitle1}>
                <h2>Inventory Details</h2>
                <button className={styles.viewTablebtn} onClick={handleTableClick} type="button">
                    View Data Table
                </button>
            </div>

            <div className={styles.rowTitle2}>
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={styles.infoIcon}
                />
                <p>
                    Inventories details include what inventories are available at the facility to respond in case of disaster.
                </p>
            </div>
            {
                inventoryData && inventoryData.length === 0
                    ? (
                        <div className={styles.row3}>
                            <AccentHeading
                                content={'Please add all inventories below and click Finish'}
                            />
                        </div>
                    )
                    : (
                        <div className={styles.row3}>
                            <AccentHeading
                                content={'Please add/edit all inventories below and click Finish'}
                            />
                        </div>
                    )

            }

            <div className={styles.containerForm}>
                {
                    inventoryData && inventoryData.length === 0
                    && (
                        <>
                            <h2>01. Are inventories available for disaster response?</h2>
                            <Box sx={{ display: 'flex' }}>
                                <FormControl style={{ margin: '15px 0' }} sx={{ m: 1 }} component="fieldset" variant="standard">
                                    <FormGroup>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled('hf_code')}
                                                    checked={inventoryNeeded}
                                                    onChange={(e => handleInvNeeded(e, 'Yes'))}
                                                />
                                            )}
                                            label={'Yes'}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    disabled={getDisabled('hf_code')}
                                                    checked={!inventoryNeeded}
                                                    onChange={(e => handleInvNeeded(e, 'No'))}
                                                />
                                            )}
                                            label={'No'}
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Box>
                        </>
                    )
                }
                {
                    (inventoryNeeded || inventoryData.length > 0)
                    && (
                        <>
                            <div className={styles.invContainer}>
                                <div className={styles.col1}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <InputLabel id="has_internet_facility-Input">Inventory</InputLabel>
                                        <Select
                                            disabled={getDisabled('inventory')}
                                            labelId="has_internet_facility-Label"
                                            id="has_internet_facilityID"
                                            value={inventory}
                                            label="Internet Facility"
                                            onChange={handleInventory}
                                            style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                            disableUnderline
                                        >
                                            {
                                                inventoryItem && inventoryItem.map(iD => (
                                                    <MenuItem
                                                        value={iD.title}
                                                        key={iD.id}
                                                    >
                                                        {iD.title}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>

                                </div>
                                <div className={styles.col2}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <TextField
                                            disabled={getDisabled('inventory')}
                                            id="outlined-basic"
                                            label="Quantity"
                                            variant="filled"
                                            value={quantity}
                                            onChange={handleQuantity}
                                            InputProps={{ disableUnderline: true }}
                                            style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                        />
                                    </FormControl>
                                </div>
                                <div className={styles.col3}>
                                    <FormControl style={{ margin: '15px 0' }} variant="filled" fullWidth>
                                        <InputLabel id="has_internet_facility-Input">Unit</InputLabel>
                                        <Select
                                            disabled={getDisabled('inventory')}
                                            labelId="has_internet_facility-Label"
                                            id="has_internet_facilityID"
                                            value={unit}
                                            onChange={handleUnit}
                                            style={{ border: '1px solid #d5d5d5', borderRadius: '3px' }}
                                            disableUnderline
                                        >
                                            {
                                                units.map(u => (
                                                    <MenuItem
                                                        value={u}
                                                        key={u}
                                                    >
                                                        {u}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className={styles.btnContainer}>
                                <button
                                    type="button"
                                    onClick={handleInvAdd}
                                    disabled={getDisabled('inventory')}
                                >
                                    + Add Inventory
                                </button>
                            </div>
                        </>
                    )
                }

                <InventoryTable
                    getEditRowData={getEditRowData}
                    openModal={openModal}
                />

                <EditModal
                    units={units}
                    currentEditData={editRowData}
                    open={openEditModal}
                    handleClose={handleClose}
                    inventoryItem={inventoryItem}
                    inventoryData={editRowData}
                    resourceID={resourceID}
                />


                <NextButton
                    getActiveMenu={getActiveMenu}
                    progress={progress}
                    activeMenu={activeMenu}
                    resetForm={resetForm}
                    formData={formData}
                    handleProgress={props.handleProgress}
                />
            </div>
        </>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Inventories,
        ),
    ),
);
