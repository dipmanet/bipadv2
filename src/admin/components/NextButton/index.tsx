/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isList } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { SetHealthInfrastructurePageAction } from '#actionCreators';
import { healthInfrastructurePageSelector, userSelector } from '#selectors';
import { AppState } from '#types';
import Modal from '../Modal';
import { FormDataType } from '../HealthForm/utils';
import styles from './styles.module.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});


const MenuItemsAll = [
    {
        name: 'Institution Details',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Disaster Management',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Contact',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Location',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Picture',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Inventories',
        permission: ['superuser', 'editor', 'validator', 'user'],
    },
    {
        name: 'Verification',
        permission: ['superuser', 'editor', 'validator'],
    },

];


interface Props {
    progress: number;
    getActiveMenu: (e: number) => void;
    activeMenu: number;
    formData?: FormDataType;
    resetForm: () => void;
    handleProgress: (e: number) => void;

}
const baseUrl = process.env.REACT_APP_API_SERVER_URL;
const NextButton = (props) => {
    const [errorNew, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [finish, setFinish] = useState(false);
    const [update, setUpdate] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFinishModal, setFinishOpenModal] = useState(false);
    const [MenuItems, setMenuItems] = useState(MenuItemsAll);

    const {
        progress,
        getActiveMenu,
        activeMenu,
        formData,
        resetForm,
        handleProgress,
        setHealthInfrastructurePage,
        userDataMain,
        healthInfrastructurePage: {
            healthFormEditData,
            resourceID,
        },
    } = props;


    useEffect(() => {
        if (userDataMain.isSuperuser) {
            setMenuItems(MenuItemsAll);
        } else if (userDataMain.profile && userDataMain.profile.role) {
            if (userDataMain.profile.role === 'validator') {
                if (Object.keys(healthFormEditData).length > 0) {
                    setMenuItems(MenuItemsAll);
                } else {
                    setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
                }
            } else {
                setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
            }
        } else {
            setMenuItems(MenuItemsAll);
        }
    }, [healthFormEditData, resourceID, userDataMain.isSuperuser, userDataMain.profile]);


    const isFile = (input: any): input is File => (
        'File' in window && input instanceof File
    );
    const isBlob = (input: any): input is Blob => (
        'Blob' in window && input instanceof Blob
    );

    const sanitizeFormData = (value: any) => {
        if (value === null) {
            return '';
        }
        if (isFile(value) || isBlob(value) || typeof value === 'string') {
            return value;
        }
        return JSON.stringify(value);
    };

    const getFormData = (jsonData: FormDataType | undefined) => {
        const formDataNew = new FormData();
        if (!jsonData) {
            return formDataNew;
        }

        Object.entries(jsonData).forEach(
            ([key, value]) => {
                if (isList(value)) {
                    value.forEach((val: unknown) => {
                        if (val !== undefined) {
                            const sanitizedVal = sanitizeFormData(val);
                            formDataNew.append(key, sanitizedVal);
                        }
                    });
                } else if (value !== undefined) {
                    const sanitizedValue = sanitizeFormData(value);
                    formDataNew.append(key, sanitizedValue);
                }
            },
        );
        return formDataNew;
    };

    const handlePrevious = () => {
        setError(null);
        const getCurrentIndex = MenuItems.map(m => m.name).indexOf(activeMenu);
        if (getCurrentIndex > 0) {
            handleProgress(getCurrentIndex - 1);
            getActiveMenu(MenuItems.map(m => m.name)[getCurrentIndex - 1]);
        }
    };

    const checkValidation = (aM) => {
        if (userDataMain.profile && userDataMain.profile.role === 'validator') {
            return true;
        }
        if (userDataMain.profile && !userDataMain.profile.role && !userDataMain.isSuperuser) {
            return true;
        }
        if (aM === 'Institution Details') {
            if (formData.title) {
                setHealthInfrastructurePage({ validationError: null });
                // dispatch(setValidationError(null));
                return true;
            }
            setHealthInfrastructurePage({ validationError: 'Field Required: Name of the Health Institution' });
            // dispatch(setValidationError('Field Required: Name of the Health Institution'));
            return false;
        } if (aM === 'Disaster Management') {
            return true;
        } if (aM === 'Contact') {
            return true;
        } if (aM === 'Location') {
            if (
                formData.point && formData.point.coordinates[0] && formData.ward) {
                setHealthInfrastructurePage({ validationError: null });
                // dispatch(setValidationError(null));
                return true;
            }
            setHealthInfrastructurePage({ validationError: 'Field required: Province, District, Municipality, Ward, Lattitude and Longitude' });
            // dispatch(setValidationError('Field required: Province, District, Municipality, Ward, Lattitude and Longitude'));
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError(null);
        // check validation
        if (checkValidation(activeMenu)) {
            const getCurrentIndex = MenuItems.map(m => m.name).indexOf(activeMenu);
            if (getCurrentIndex < MenuItems.length - 1) {
                handleProgress(getCurrentIndex + 1);
                getActiveMenu(MenuItems.map(m => m.name)[getCurrentIndex + 1]);
            }
        }
    };
    const handleFinish = () => {
        setError(null);
        setFinish(true);
        setFinishOpenModal(true);
    };

    const getResourceId = () => {
        if (formData.id) {
            return formData.id;
        }
        if (resourceID) {
            return resourceID;
        }
        return null;
    };

    const handleFinishFurther = () => {
        if (userDataMain.profile && userDataMain.profile.role && userDataMain.profile.role === 'validator') {
            setHealthInfrastructurePage({ resourceID: null });
            // dispatch(setResourceID(null));
            getActiveMenu('Institution Details');
        }
        // resetForm();
        setHealthInfrastructurePage({ resourceID: null });
        // dispatch(setResourceID(null));
        // window.location.reload();
        getActiveMenu('Institution Details');
    };

    const handleSave = () => {
        setError(null);
        // dispatch(setHealthFormLoader(true));
        axios
            .post(`${baseUrl}/resource/?meta=true`, getFormData(props.formData), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                setSuccess('The data has been saved successfully');
                setHealthInfrastructurePage({ resourceID: res.data.id });
                // dispatch(setResourceID(res.data.id));
                // setHealthInfrastructurePage({ healthFormLoader: false });
                // dispatch(setHealthFormLoader(false));
                const getCurrentIndex = MenuItems.map(m => m.name).indexOf('Inventories');
                handleProgress(getCurrentIndex);
            });
    };
    const handlePatch = () => {
        setError(null);
        // setHealthInfrastructurePage({ healthFormLoader: true });

        if (getResourceId()) {
            axios
                .patch(`${baseUrl}/resource/${getResourceId()}/?meta=true`, getFormData({ is_verified: formData.is_verified, is_approved: formData.is_approved, verfication_message: formData.verfication_message, resource_type: formData.resource_type }), {
                    headers: {
                        Accept: 'application/json',
                    },
                }).then((res) => {
                    // setHealthInfrastructurePage({ healthFormLoader: false });
                    // dispatch(setHealthFormLoader(false));
                    setHealthInfrastructurePage({ healthFormEditData: {} });
                    // dispatch(resetEdit());
                    handleFinish();
                });
        } else {
            window.location.reload();
        }
    };
    const handleEdit = () => {
        setError(null);
        // setHealthInfrastructurePage({ healthFormLoader: true });
        // dispatch(setHealthFormLoader(true));
        let patchObj = {};

        if (typeof formData.picture === 'object') {
            patchObj = { ...formData };
        }
        if (formData.picture === null) {
            patchObj = { ...formData };
            delete patchObj.picture;
        }


        const newWardObj = { ...patchObj };
        delete newWardObj.ward;
        const newPatchObj = { ...newWardObj, ward: formData.ward.id };

        axios
            .patch(`${baseUrl}/resource/${formData.id}/?meta=true`, getFormData(newPatchObj), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                // setHealthInfrastructurePage({ healthFormLoader: false });
                // dispatch(setHealthFormLoader(false));
                // who message and go to inventories
                setSuccess('The data has been updated successfully');
                // update progress
                const getCurrentIndex = MenuItems.map(m => m.name).indexOf('Inventories');
                handleProgress(getCurrentIndex);
                setHealthInfrastructurePage({ healthFormEditData: {} });
                // dispatch(resetEdit());
                setUpdate(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleNavigate = () => {
        // navigate('/health-form');
        window.location.reload();
    };

    const handleClose = () => {
        setOpenModal(false);
        getActiveMenu('Inventories');
    };

    // eslint-disable-next-line consistent-return
    const getBtnLabel = (aM) => {
        if (!resourceID) {
            if (
                (Object.keys(userDataMain).length === 0)
                || (!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role)

            ) {
                if (aM === 'Inventories') {
                    return 'Close';
                }
                return 'Next';
            }
            if (aM === 'Institution Details') {
                return 'Next';
            } if (aM === 'Disaster Management') {
                return 'Next';
            } if (aM === 'Contact') {
                return 'Next';
            } if (aM === 'Location') {
                return 'Next';
            } if (aM === 'Verification') {
                return 'Submit Verification Info';
            } if (aM === 'Picture') {
                if (userDataMain.profile.role === 'validator') {
                    return 'Next';
                }
                return 'Submit';
            } if (aM === 'Inventories') {
                if (userDataMain.profile.role === 'validator') {
                    return 'Close';
                }
                if (userDataMain.profile.role === 'user') {
                    return 'Finish';
                }
                return 'Next';
            }
        } else {
            if (!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role) {
                if (aM === 'Inventories') {
                    return 'Close';
                }
                return 'Next';
            }
            if (aM === 'Verification') {
                return 'Update Verification Info';
            }
            if (aM === 'Inventories') {
                if (
                    userDataMain.profile.role === 'validator' || userDataMain.profile.role === 'editor' || userDataMain.isSuperuser
                ) {
                    return 'Next';
                }
                return 'Finish';
            }
            if (aM === 'Picture') {
                if (
                    userDataMain.profile.role === 'editor' || userDataMain.profile.role === 'user' || userDataMain.isSuperuser
                ) {
                    return 'Update';
                }
                return 'Next';
            }
            return 'Next';
        }
    };


    // eslint-disable-next-line consistent-return
    const returnHandleFunction = (aM) => {
        if (!resourceID) {
            if (
                (Object.keys(userDataMain).length === 0) || (
                    !userDataMain.isSuperuser
                    && userDataMain.profile
                    && !userDataMain.profile.role)
            ) {
                if (aM === 'Inventories') {
                    return handleNavigate;
                }
                return handleNext;
            }
            if (aM === 'Institution Details') {
                return handleNext;
            } if (aM === 'Disaster Management') {
                return handleNext;
            } if (aM === 'Contact') {
                return handleNext;
            } if (aM === 'Location') {
                return handleNext;
            } if (aM === 'Verification') {
                return handlePatch;
            } if (aM === 'Picture') {
                if (userDataMain.profile.role === 'validator') {
                    return handleNext;
                }
                return handleSave;
            } if (aM === 'Inventories') {
                if (userDataMain.profile.role === 'validator') {
                    return handleFinish;
                }
                if (userDataMain.profile.role === 'user') {
                    return handleFinish;
                }
                return handleNext;
            }
        } else {
            if (!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role) {
                if (aM === 'Verification') {
                    return handleFinish;
                }
                return handleNext;
            }
            if (aM === 'Verification') {
                return handlePatch;
            }
            if (aM === 'Inventories') {
                if (
                    userDataMain.profile.role === 'validator'
                    || userDataMain.profile.role === 'editor'
                    || userDataMain.isSuperuser
                ) {
                    return handleNext;
                }
                return handleFinish;
            }
            if (aM === 'Picture') {
                if (
                    userDataMain.profile.role === 'editor'
                    || userDataMain.profile.role === 'user'
                    || userDataMain.isSuperuser
                ) {
                    return handleEdit;
                }
                return handleNext;
            }
            return handleNext;
        }
    };

    const handleUpdateSuccess = () => {
        // go to inventory
        getActiveMenu('Inventories');

        // setUpdate(false);
        // navigate('/health-table');
    };

    useEffect(() => {
        if (success) {
            setOpenModal(true);
        }
    }, [success]);

    const getPrevDisabled = () => {
        if (
            activeMenu === 'Institution Details'
            || activeMenu === 'Inventories'
        ) {
            return true;
        }
        return false;
    };

    return (
        <>
            {
                errorNew
                && <p className={styles.error}>{errorNew}</p>
            }
            {
                success
                && (
                    <Modal
                        open={openModal}
                        title={'Thank you. Your data has been saved sucessfully'}
                        description={'Please enter Inventory data, if any'}
                        handleClose={handleClose}
                    />
                )
            }
            {
                finish
                && (
                    <Modal
                        open={openFinishModal}
                        title={'Thank you!'}
                        description={
                            (Object.keys(userDataMain).length > 0
                                && userDataMain.profile
                                && userDataMain.profile.role === 'validator')
                                ? ''
                                : 'You can now enter new record'}
                        handleClose={handleFinishFurther}
                    />
                )
            }
            {
                update
                && (
                    <Modal
                        open={update}
                        title={'Thank you!'}
                        description={'Your record has been updated'}
                        handleClose={handleUpdateSuccess}
                    />
                )
            }
            <div className={styles.nextContainer}>
                <button
                    type="button"
                    onClick={handlePrevious}
                    className={getPrevDisabled() ? styles.prevDisabled : styles.prevBtn}
                // disabled={getPrevDisabled}
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={returnHandleFunction(activeMenu)}
                    className={styles.nextBtn}
                >
                    {
                        getBtnLabel(activeMenu)
                    }
                </button>
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    NextButton,
);
