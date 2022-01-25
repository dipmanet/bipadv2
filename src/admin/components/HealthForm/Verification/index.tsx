/// <reference no-default-lib="true"/>

/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import TextField from '@mui/material/TextField';
import { SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from '@mui/material';
import AccentHeading from '../../AccentHeading';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { institutionDetails } from '../utils';
import NextButton from '../../NextButton';
import { FormDataType } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

type EventTarget =  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

interface Props{
	handleFormData: (e: EventTarget, fN: string)=> void;
	formData: FormDataType;
	progress: number;
	handleTime:(e: Date, fN:string) => void;
	getActiveMenu:(e:number)=>void;
	activeMenu: number;
	handleProgress:(e:number)=>void;

}

    
const InstitutionDetails = (props: Props): JSX.Element => {

	const { 
		handleFormData,
		handleTime,
		formData,
		progress,
	} = props;

	const navigate = useNavigate();
	const handleViewTableBtn = () => {
		navigate('/health-table');
	};
	const {userDataMain} = useSelector((state:RootState) => state.user);
	const [fieldsToDisable, setDisableFields] = useState([]);
	const getDisabled = (field:string) => {
		return fieldsToDisable.includes(field);
	};

	useEffect(()=>{
		const allFields = Object.keys(institutionDetails);
		const fieldsToGiveValidator = ['is_verified', 'is_approved','verfication_message'];
		window.scrollTo({top: 400, left: 0});
		if(userDataMain.isSuperuser){
			setDisableFields([]);
		} else if(
			userDataMain.profile && 
			userDataMain.profile.role && 
			userDataMain.profile.role === 'validator'
		){
			setDisableFields(allFields.filter(f=>!fieldsToGiveValidator.includes(f)));
		} else if(
			userDataMain.profile && 
			userDataMain.profile.role && 
			userDataMain.profile.role === 'user'
		){
			setDisableFields(allFields.filter(f=>fieldsToGiveValidator.includes(f)));
		} else if(
			userDataMain.profile && 
			userDataMain.profile.role && 
			userDataMain.profile.role === 'editor'
		){
			setDisableFields([]);
		} else {
			setDisableFields(allFields);
		}
	},[]);
	useEffect(()=>{
		window.scrollTo({top: 400, left: 0});
	},[]);

	return(
		<>
			<div className={styles.rowTitle1}>
				<h2>
							Verification
				</h2>
				<button
					className={styles.viewTablebtn}
					onClick={handleViewTableBtn}
				>
							View Data Table
				</button>
			</div>
			<div className={styles.rowTitle2}>
				<FontAwesomeIcon 
					icon={faInfoCircle} 
					className={styles.infoIcon}
				/>
				<p>
				This section contains the verfication details of the health infastructure
				</p>
			</div>
			<div className={styles.row3}>
				<AccentHeading 
					content={'Verification and approval: required to publish the data in Bipad Portal'}
				/>
			</div>
			<div className={styles.containerForm}>
			
				<h2>
					Verified				
				</h2>
				<div className={styles.checkBoxGrp}>
					<Box sx={{ display: 'flex' }}>
						<FormControl style={{margin: '15px 0'}} sx={{ m: 1 }} component="fieldset" variant="standard">
							<FormGroup>
								
								<FormControlLabel 
									control={
										<Checkbox 
											disabled={getDisabled('is_verified')}
											checked={formData['is_verified']} 
											onChange={(e=>handleFormData(e,'is_verified'))}/>
									} 
									label={'YES'} 
								/>
								<FormControlLabel 
									control={
										<Checkbox 
											disabled={getDisabled('is_verified')}
											checked={!formData['is_verified']} 
											onChange={(e=>handleFormData(e,'is_verified'))}/>
									} 
									label={'NO'} 
								/>
								
							</FormGroup>
						</FormControl>
						
					</Box>
				</div>
				<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
					<TextField 
						id="veriMessageID" 
						label="Verification Message" 
						variant="filled" 
						value={formData.verfication_message}
						onChange={(e)=>handleFormData(e,'verfication_message')}
						disabled={getDisabled('verfication_message')}
						InputProps={{ 
							disableUnderline: true,
						}}
						style={{ border: '1px solid #d5d5d5'}}
					/>
				</FormControl>
				<h2>
					Approved				
				</h2>
				<div className={styles.checkBoxGrp}>
					<Box sx={{ display: 'flex' }}>
						<FormControl style={{margin: '15px 0'}} sx={{ m: 1 }} component="fieldset" variant="standard">
							<FormGroup>
								
								<FormControlLabel 
									control={
										<Checkbox 
											disabled={getDisabled('is_approved')}
											checked={formData['is_approved']} 
											onChange={(e=>handleFormData(e,'is_approved'))}/>
									} 
									label={'YES'} 
								/>
								<FormControlLabel 
									control={
										<Checkbox 
											disabled={getDisabled('is_approved')}
											checked={!formData['is_approved']} 
											onChange={(e=>handleFormData(e,'is_approved'))}/>
									} 
									label={'NO'} 
								/>
								
							</FormGroup>
						</FormControl>
						
					</Box>
				</div>
				<NextButton 
					getActiveMenu={props.getActiveMenu} 
					progress={progress}
					activeMenu={props.activeMenu}
					formData={formData}
					handleProgress={props.handleProgress}

				/>
			</div>
		</>
	);

};

export default InstitutionDetails;