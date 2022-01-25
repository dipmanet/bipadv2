/// <reference no-default-lib="true"/>

/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { SelectChangeEvent } from '@mui/material/Select';

import AccentHeading from '../../AccentHeading';

import { institutionDetails } from '../utils';
import NextButton from '../../NextButton';
import { FormDataType } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../../FileUploader';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';


type EventTarget =  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

interface Props{
	formData: FormDataType;
	progress: number;
	getActiveMenu: (e:number)=>void;
	activeMenu: number;
	handleFile:(e:File,fN:string)=> void;
	handleFormData?: ()=>void;
	handleProgress:(e:number)=>void;

}

    
const Picture = (props: Props): JSX.Element => {
	const { 
		formData,
		progress,
		getActiveMenu,
		activeMenu,
		handleFile,
	} = props;
	const [picFromEdit,setPicFromEdit]= useState(false);
	const [picLink,setpicLink]= useState(false);
	const navigate = useNavigate();
	const handleViewTableBtn = () => {
		navigate('/health-table');
	};
	const { healthFormEditData, resourceID  } = useSelector((state:RootState) => state.health);
	const {userDataMain} = useSelector((state:RootState) => state.user);
	const [fieldsToDisable, setDisableFields] = useState([]);
	const getDisabled = (field:string) => {
		return fieldsToDisable.includes(field);
	};

	useEffect(()=>{
		const allFields = Object.keys(institutionDetails);
		const fieldsToGiveValidator = ['hf_code', 'authority'];
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

	const showPic = () =>  {
		const file = document.getElementById('file').files[0];
		const reader  = new FileReader();
		reader.onload = function(e)  {
			const image = document.createElement('img');
			const picNode = document.getElementById('pictureContainer');
			image.src = e.target.result;
			if (picNode.firstChild) {
				picNode.removeChild(picNode.lastChild);
			  }
			// document.body.appendChild(image);
			document.getElementById('pictureContainer').appendChild(image);
		};
		reader.readAsDataURL(file);
	};

	const handleFileInput = (file:File) => {
		handleFile(file,'picture');
		if(resourceID){
			setPicFromEdit(false);
		}
		showPic();
	};
	useEffect(()=>{
		window.scrollTo({top: 400, left: 0});
		if(resourceID){
			setPicFromEdit(true);
			setpicLink(formData.picture);
			handleFile(null, 'picture');
		}
	},[]);

	return(
		<>
				
			<div id="pictureContainer" className={styles.picture}>
				{
					picFromEdit
					&&
					<>
						<h2>Current Picture</h2>
						<img src={picLink} />
					</>
				}
			</div>
			
			<div className={styles.rowTitle1}>
				<h2>
						 Upload Picture
				</h2>
			</div>

			<div className={styles.rowTitle2}>
				<FontAwesomeIcon 
					icon={faInfoCircle} 
					className={styles.infoIcon}
				/>
				<p>
				While uploading the picture of the facility, make sure that the picture captures the name board (if available) and the building.
				</p>
			</div>
			<div className={styles.row3}>
				<AccentHeading 
					content={'Please upload picture of the facility'}
				/>
			</div>
			
			<div className={styles.containerForm}>

				<FileUploader
				     onFileSelectSuccess={handleFileInput}
					 disable={ getDisabled('picture')}
				/>
			
				<NextButton 
					getActiveMenu= {getActiveMenu} 
					progress={progress}
					activeMenu={activeMenu}
					formData={formData}
					handleProgress={props.handleProgress}

				/>
			</div>
		</>
	);

};

export default Picture;