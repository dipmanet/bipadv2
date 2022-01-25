/// <reference no-default-lib="true"/>

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import { isList } from '@togglecorp/fujs';
import Modal from '../Modal';
import { FormDataType } from '../HealthForm/utils';
import { setResourceID, resetEdit, setHealthFormLoader, setValidationError } from '../../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const MenuItemsAll = [
	{
		name: 'Institution Details',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Disaster Management',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Contact',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Location',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Picture',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Inventories',
		permission:['superuser','editor','validator','user'],
	},
	{
		name: 'Verification',
		permission:['superuser','editor', 'validator'],
	},

];


interface Props { 
    progress: number;
	getActiveMenu: (e:number)=>void;
	activeMenu: number;
	formData?:FormDataType;
	resetForm: ()=>void;
	handleProgress:(e:number)=>void;

}
const baseUrl = process.env.REACT_APP_API_SERVER_URL;
const NextButton = (props: Props):JSX.Element => {

	const [errorNew, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [finish, setFinish] = useState(false);
	const [update, setUpdate] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [openFinishModal, setFinishOpenModal] = useState(false);
	const dispatch = useDispatch();
	const { healthFormEditData, resourceID } = useSelector((state:RootState) => state.health);
	const navigate = useNavigate();
	const { 
		progress,
		getActiveMenu,
		activeMenu,
		formData,
		resetForm,
		handleProgress,
	} = props;

	const {userDataMain} = useSelector((state:RootState) => state.user);
	const [MenuItems, setMenuItems] = useState(MenuItemsAll);

	useEffect(()=>{
		if(userDataMain.isSuperuser){
			setMenuItems(MenuItemsAll);
		} else if(userDataMain.profile && userDataMain.profile.role){
			if(userDataMain.profile.role === 'validator'){
				if(Object.keys(healthFormEditData).length >0){
					console.log('here');
					setMenuItems(MenuItemsAll);
				} else {
					console.log('not here',Object.keys(healthFormEditData).length);
					setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
				}
			} else {
				setMenuItems(MenuItemsAll.filter(mI => mI.permission.includes(userDataMain.profile.role)));
			}
		} else {
			setMenuItems(MenuItemsAll);
		}
		
	},[resourceID]);


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
		const getCurrentIndex = MenuItems.map(m=>m.name).indexOf(activeMenu);
		if(getCurrentIndex > 0){
			getActiveMenu(MenuItems.map(m=>m.name)[getCurrentIndex-1]);
		}
	};

	const checkValidation = (aM) => {
		if(userDataMain.profile && userDataMain.profile.role === 'validator'){
			return true;
		}
		if(userDataMain.profile && !userDataMain.profile.role && !userDataMain.isSuperuser){
			return true;
		}
		if(aM === 'Institution Details'){
			if(formData.title){
				dispatch(setValidationError(null));
				return true;
			} else {
				dispatch(setValidationError('Field Required: Name of the Health Institution' ));
				return false;
			}
		} else if(aM === 'Disaster Management'){
			return true;
		} else if(aM === 'Contact'){
			return true;
		} else if(aM === 'Location'){
			if(
				formData.point && 
				formData.point.coordinates[0] &&
				formData.ward
			){
				dispatch(setValidationError(null));
				return true;
			} else {
				dispatch(setValidationError('Field required: Province, District, Municipality, Ward, Lattitude and Longitude' ));
				return false;
			}
			
		}
		return true;
	};

	const handleNext = () => {
		setError(null);
		//check validation
		if(checkValidation(activeMenu)){
			const getCurrentIndex = MenuItems.map(m=>m.name).indexOf(activeMenu);
			if(getCurrentIndex < MenuItems.length -1){
				handleProgress(getCurrentIndex+1);
				getActiveMenu(MenuItems.map(m=>m.name)[getCurrentIndex+1]);
			}
		}

	};
	const handleFinish = () => {
		console.log('..finishing');
		setError(null);
		setFinish(true);
		setFinishOpenModal(true);
		
	};

	const getResourceId = () => {
		if(formData.id){
			return formData.id;
		}
		if(resourceID){
			return resourceID;
		}
		return null;
	};

	const handleFinishFurther = () => {
		if(userDataMain.profile && 
			userDataMain.profile.role &&
			userDataMain.profile.role === 'validator'
		){
			dispatch(setResourceID(null));
			getActiveMenu('Institution Details');
		}
		// resetForm();
		dispatch(setResourceID(null));
		window.location.reload();
		// getActiveMenu('Institution Details');
	};

	const handleSave = () => {
		setError(null);
		dispatch(setHealthFormLoader(true));
		axios
			.post(`${baseUrl}/resource/?meta=true`,getFormData(props.formData), {
				headers: {
					Accept: 'application/json',
				}
			} ).then(res=>{
				setSuccess('The data has been saved successfully');
				dispatch(setResourceID(res.data.id));
				dispatch(setHealthFormLoader(false));
				const getCurrentIndex = MenuItems.map(m=>m.name).indexOf('Inventories');
				handleProgress(getCurrentIndex);
			})
			.catch(error=>{
				if (error.response) {
					dispatch(setHealthFormLoader(false));

					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log(error.response.data);
					if(error.response.data){
						const msgKey = Object.keys(error.response.data)[0];
						if(typeof error.response.data[msgKey] !== 'object'){
							setError(error.response.data[msgKey]);
						} else {
							setError(`${msgKey}: ${error.response.data[msgKey]}`);
						}
					}
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
			});
	
	};
	const handlePatch = () => {
		setError(null);
		dispatch(setHealthFormLoader(true));
		console.log('data ward', formData);

		if(getResourceId()){
			axios
				.patch(`${baseUrl}/resource/${getResourceId()}/?meta=true`,getFormData({is_verified:formData.is_verified, is_approved:formData.is_approved, verification_message: formData.verfication_message, resource_type:formData.resource_type}), {
					headers: {
						Accept: 'application/json',
					}
				} ).then(res=>{
					dispatch(setHealthFormLoader(false));
					dispatch(resetEdit());
					handleFinish();
				})
				.catch(error=>{
	
					dispatch(setHealthFormLoader(false));
	
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						console.log(error.response.data);
						if(error.response.data){
							const msgKey = Object.keys(error.response.data)[0];
							if(typeof error.response.data[msgKey] !== 'object'){
								setError(error.response.data[msgKey]);
							} else {
								setError(`${msgKey}: ${error.response.data[msgKey]}`);
							}
						}
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
				});
		} else {
			window.location.reload();
		} 
		
	
	};
	const handleEdit = () => {
		setError(null);
		dispatch(setHealthFormLoader(true));
		let patchObj={};
		
		if(typeof formData.picture === 'object'){
			patchObj={...formData};
			console.log('...file');
		} else {
			patchObj={...formData};
			console.log('...not file',typeof formData.picture);
			delete patchObj.picture;
		}


		const newWardObj = {...patchObj};
		delete newWardObj.ward;
		const newPatchObj = {...newWardObj, ward: formData.ward.id};

		axios
			.patch(`${baseUrl}/resource/${formData.id}/?meta=true`,getFormData(newPatchObj), {
				headers: {
					Accept: 'application/json',
				}
			} ).then(res=>{
				dispatch(setHealthFormLoader(false));
				// who message and go to inventories
				setSuccess('The data has been updated successfully');
				// update progress 
				const getCurrentIndex = MenuItems.map(m=>m.name).indexOf('Inventories');
				handleProgress(getCurrentIndex);
				dispatch(resetEdit());
				setUpdate(true);
			})
			.catch(error=>{

				dispatch(setHealthFormLoader(false));

				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log(error.response.data);
					if(error.response.data){
						const msgKey = Object.keys(error.response.data)[0];
						if(typeof error.response.data[msgKey] !== 'object'){
							setError(error.response.data[msgKey]);
						} else {
							setError(`${msgKey}: ${error.response.data[msgKey]}`);
						}
					}
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

	const getBtnLabel = (aM) => {
		if(!resourceID){
			if(
				(Object.keys(userDataMain).length === 0 )
			||
			(!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role)
				
			){
				if(aM === 'Inventories')
				{ 
					return 'Close';
				} 
				return 'Next';
			} else {
				if(aM === 'Institution Details')
				{
					return 'Next';
				} if(aM === 'Disaster Management')
				{
					return 'Next';
				} if(aM === 'Contact')
				{
					return 'Next';
				} if(aM === 'Location') {
					return 'Next';
				} if(aM === 'Verification')
				{
					return 'Submit Verification Info';
				}if(aM === 'Picture'){
					if(userDataMain.profile.role === 'validator'){
						return 'Next';
					}
					return 'Submit';
				} if(aM === 'Inventories'){
					if(userDataMain.profile.role === 'validator'){
						return 'Close';
					}
					if(userDataMain.profile.role === 'user'){
						return 'Finish';
					}
					return 'Next';
				} 
			
			}
				
		} else {
			if(!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role){
				if(aM === 'Inventories')
				{ 
					return 'Close';
				} 
				return 'Next';
			} else {
				if(aM === 'Verification'){
					return 'Update Verification Info';
				}
				if(aM==='Inventories'){
					if(
						userDataMain.profile.role === 'validator' ||
						userDataMain.profile.role === 'editor' ||
						userDataMain.isSuperuser 
					){
						return 'Next';
					}
					return 'Finish';
				}
				if(aM==='Picture'){
					if(
						userDataMain.profile.role === 'editor' ||
						userDataMain.profile.role === 'user' ||
						userDataMain.isSuperuser 
					){
						return 'Update';
					}
					return 'Next';
				}
				return 'Next';
			}
		}
	};
	

	const returnHandleFunction = (aM) => {
		if(!resourceID){
			if(
				(Object.keys(userDataMain).length === 0 )
			||
			(
				!userDataMain.isSuperuser && 
				userDataMain.profile && 
				!userDataMain.profile.role)
			){
				if(aM === 'Inventories')
				{ 
					return handleNavigate;
				} 
				return handleNext;
			} else {
				if(aM === 'Institution Details')
				{
					return handleNext;
				} if(aM === 'Disaster Management')
				{
					return handleNext;
				} if(aM === 'Contact')
				{
					return handleNext;
				} if(aM === 'Location') {
					return handleNext;
				} if(aM === 'Verification')
				{
					return handlePatch;
				}if(aM === 'Picture'){
					if(userDataMain.profile.role === 'validator'){
						return handleNext;
					}
					return handleSave;
				} if(aM === 'Inventories'){
					if(userDataMain.profile.role === 'validator'){
						return handleFinish;
					}
					if(userDataMain.profile.role === 'user'){
						return handleFinish;
					}
					return handleNext;
				} 
			}
				
		} else {
			if(!userDataMain.isSuperuser && userDataMain.profile && !userDataMain.profile.role){
				if(aM === 'Verification')
				{ 
					return handleFinish;
				} 
				return handleNext;
			} else {
				if(aM === 'Verification'){
					return handlePatch;
				}
				if(aM==='Inventories'){
					if(
						userDataMain.profile.role === 'validator' ||
						userDataMain.profile.role === 'editor' ||
						userDataMain.isSuperuser 
					){
						return handleNext;
					}
					return handleFinish;
				}
				if(aM==='Picture'){
					if(
						userDataMain.profile.role === 'editor' ||
						userDataMain.profile.role === 'user' ||
						userDataMain.isSuperuser 
					){
						return handleEdit;
					}
					return handleNext;
				}
				return handleNext;
			}
		}
		
	};

	const handleUpdateSuccess = () => {
		
		//go to inventory
		getActiveMenu('Inventories');

		// setUpdate(false);
		// navigate('/health-table');

	};

	useEffect(()=>{
		if(success){
			setOpenModal(true);
		}
	},[success]);

	const getPrevDisabled = () => {
		if(
			activeMenu === 'Institution Details' ||
			activeMenu === 'Inventories'
		){
			return true;
		}
		return false;
	};

	return(
		<>
			{
				errorNew
			&&
			<p className={styles.error}>{errorNew}</p>
			}
			{
				success
			&&
			<Modal
				open={openModal}
				title={'Thank you. Your data has been saved sucessfully'}
				description={'Please enter Inventory data, if any'}
				handleClose={handleClose}
			/>
			}
			{
				finish
				&&
				<Modal
					open={openFinishModal}
					title={'Thank you!'}
					description={
						(Object.keys(userDataMain).length > 0 &&
						userDataMain.profile &&
						userDataMain.profile.role === 'validator') ?
							''
							:
							'You can now enter new record'}
					handleClose={handleFinishFurther}
				/>
			}
			{
				update
				&&
				<Modal
					open={update}
					title={'Thank you!'}
					description={'Your record has been updated'}
					handleClose={handleUpdateSuccess}
				/>
			}
			<div className={styles.nextContainer}>
				<button
					role="button"
					onClick={handlePrevious}
					className={getPrevDisabled() ? styles.prevDisabled: styles.prevBtn}
					disabled={getPrevDisabled}
				>
            Previous
				</button>
				<button
					role="button"
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


export default NextButton;
