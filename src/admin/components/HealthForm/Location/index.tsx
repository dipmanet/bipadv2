/// <reference no-default-lib="true"/>

/* eslint-disable no-mixed-spaces-and-tabs */
import React, { createContext, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
// import Map from '../../Mappointpicker/index';
import Map from '../../Mappointpicker/index';
import { useDispatch, useSelector } from 'react-redux';
import { provinceData, districtData, municipalityData, wardData } from '../../../Redux/actions';
import { RootState } from '../../../Redux/store';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import AccentHeading from '../../AccentHeading';
import NextButton from '../../NextButton';
import { useNavigate } from 'react-router';
 
export const LngLatContext = createContext([]);

export default function index(props) {
	const {
		handleFormData,
		setPoint,
		handleDate,
		formData,
		progress,
	} = props;


	const [provinceName, setprovinceName] = useState('');
	const [districtName, setdistrictName] = useState('');
	const [municipalityName, setmunicipalityName] = useState('');
	const [wardName, setwardName] = useState('');
	const [LocalAddress, setLocalAddress] = useState('');
	const [verified, setverified] = useState(false);
	const [approved, setApproved] = useState(false);
	const addedSuccessfullyRef = useRef(null);
	const [visibility, setvisibility] = useState('hidden');
	const [lattitude, setLattitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [provinceDataIs, setProvinceDataIs] = useState([]);
	const [districtDataIs, setdistrictDataIs] = useState([]);
	const [municipalityDataIs, setmunicipalityDataIs] = useState([]);
	const [wardDataIs, setwardDataIs] = useState([]);
	const [provinceId, setprovinceId] = useState(0);
	const [provinceCentriodForMap , setprovinceCentriodForMap ] =  useState<mapboxgl.LngLatLike>(null);
	const [initialProvinceCenter, setinitialProvinceCenter] = useState([]);
	const [initialDistrictCenter, setinitialDistrictCenter] = useState([]);
	const [initialMunCenter, setinitialMunCenter] = useState([]);
	const [districtId, setdistrictId] = useState(0);
	const [districtCentriodForMap , setdistrictCentriodForMap ] =  useState<mapboxgl.LngLatLike>(null);
	const [municipalityId, setmunicipalityId] = useState(0);
	const [municipalityCentriodForMap , setmunicipalityCentriodForMap ] =  useState<mapboxgl.LngLatLike>(null);
	const [wardId, setwardId] = useState(0);
	const [wardCentriodForMap , setwardCentriodForMap ] =  useState<mapboxgl.LngLatLike>(null);

	const dispatch = useDispatch();
	const { healthFormEditData } = useSelector((state:RootState) => state.health);
	const navigate = useNavigate();
	const handleViewTableBtn = () => {
		navigate('/health-table');
	};
	const {userDataMain} = useSelector((state:RootState) => state.user);
	const {validationError, resourceID} = useSelector((state:RootState) => state.health);

	const getDisabled = () => {
		if (userDataMain.isSuperuser) {
			return false;
		}
		if(
			userDataMain.profile && 
			userDataMain.profile.role && 
			userDataMain.profile.role === 'validator'
		){
			return true;
		} else if(
			userDataMain.profile && 
			userDataMain.profile.role === null
		){
			return true;
		} else if(Object.keys(userDataMain).length === 0){
			return true;
		}else{
			return false;
		}
	};
	const { provincialData,loading } = useSelector((state : RootState)=> state.province);
	const { districtDataMain,loadingDistrict} = useSelector((state : RootState)=> state.district);
	const { municipalityDataMain,loadingMunicipality} = useSelector((state : RootState)=> state.municipality);
	const { wardDataMain,loadingWard} = useSelector((state : RootState)=> state.ward);

	useEffect(() => {
		if (userDataMain && userDataMain.profile && userDataMain.profile.province && provincialData && provincialData.length > 0) {
			const nameOfProvince = provincialData.filter(item => item.id === userDataMain.profile.province).map(item=> item.title)[0];
			setprovinceName(nameOfProvince);
			const provinceCenter = provincialData.filter(item => item.id === userDataMain.profile.province).map(item => item.centroid.coordinates)[0];
			setinitialProvinceCenter(provinceCenter);

		}
		if (userDataMain && userDataMain.profile && userDataMain.profile.district && districtDataMain && districtDataMain.length>0) {
			const nameOfDistrict = districtDataMain.filter(item => item.id === userDataMain.profile.district).map(item=> item.title)[0];
			setdistrictName(nameOfDistrict);
			const districtCenter = districtDataMain.filter(item => item.id === userDataMain.profile.district).map(item => item.centroid.coordinates)[0];
			setinitialDistrictCenter(districtCenter);
		}
		if (userDataMain && userDataMain.profile && userDataMain.profile.municipality && municipalityDataMain && municipalityDataMain.length>0) {
			const nameOfMunicipality = municipalityDataMain.filter(item => item.id === userDataMain.profile.municipality).map(item=> item.title)[0];
			setmunicipalityName(nameOfMunicipality);
			const munCenter = municipalityDataMain.filter(item => item.id === userDataMain.profile.municipality).map(item => item.centroid.coordinates)[0];
			setinitialMunCenter(munCenter);
		}
		if (userDataMain && userDataMain.profile && userDataMain.profile.ward && wardDataMain && wardDataMain.length >0) {
			const nameOfWard = wardDataMain.filter(item => item.id === userDataMain.profile.ward).map(item=> item.title)[0];
			setprovinceName(nameOfWard);
		}
	}, [provincialData,districtDataMain,municipalityDataMain,wardDataMain]);

	// useEffect(() => {
	// 	if (formData && Object.keys(formData).length > 0 ) {
		
	// 		setprovinceName(formData.ward.municipality.district.province.title);
	// 		setdistrictName(formData.ward.municipality.district.title);
	// 		setmunicipalityName(formData.ward.municipality.title);
	// 		console.log('district',formData.ward.municipality.title);
	// 	}
	// }, [formData]);

	useEffect(() => {
		dispatch(provinceData());
	}, [dispatch]);

	useEffect(() => {
		if(resourceID){
			setmunicipalityName((formData.ward && formData.ward.municipality) ? formData.ward.municipality.title:'' );
			setwardName(formData.ward ?formData.ward.title:'' );
			if(formData.point && formData.point.coordinates && formData.point.coordinates[0]){
				setLongitude(formData.point.coordinates[0]);
			}
			if(formData.point && formData.point.coordinates && formData.point.coordinates[1]){
				setLattitude(formData.point.coordinates[1]);
			}
		}
	}, [resourceID]);


	useEffect(()=>{
		if(Object.keys(healthFormEditData).length > 0){
			setLattitude(healthFormEditData.point.coordinates[1]);
			setLongitude(healthFormEditData.point.coordinates[0]);
		}
	},[]);

	useEffect(() => {
		if (visibility==='visible') {
			addedSuccessfullyRef.current.style.visibility=visibility;
		}
	}, [visibility]);



	useEffect(() => {
		if (!loading) {
			setProvinceDataIs(provincialData);	
		}
	}, [loading]);



	useEffect(() => {

		const provinceId = provinceDataIs.filter(item=> item.title === provinceName).map(item => item.id)[0];
		if (provinceName) {
			dispatch(districtData(provinceId));
			setprovinceId(provinceId);
		}
	}, [provinceName]);

	

	useEffect(() => {
		if (!loadingDistrict) {
			setdistrictDataIs(districtDataMain);
		}
	}, [loadingDistrict]);
		

	useEffect(() => {
		const districtId = districtDataIs.filter(item=> item.title === districtName).map(item => item.id)[0];
		if (districtName) {
			dispatch(municipalityData(districtId));
			setdistrictId(districtId);
			
		}
	}, [districtName]);

		
	useEffect(() => {
		if (!loadingMunicipality) {
			setmunicipalityDataIs(municipalityDataMain);
		}
	}, [loadingMunicipality]);


	useEffect(() => {
		console.log('municipalityName',municipalityName);
		if (municipalityDataIs && municipalityDataIs.length > 0) {
			const munId = municipalityDataIs.filter(item=> item.title === municipalityName).map(item => item.id)[0];
			if (municipalityName) {
				dispatch(wardData(munId));
				setmunicipalityId(munId);
			}
		}
	
	}, [municipalityName]);


	useEffect(() => {
		if (!loadingWard) {
			setwardDataIs(wardDataMain);
		}
	}, [loadingWard]);

	useEffect(() => {
		console.log('wardName',wardName);

		const wardId = wardDataIs.filter(item=> item.title === String(wardName)).map(item => item.id)[0];
		if (wardName) {
			setwardId(wardId);
			console.log('ward id',wardId);
			handleFormData(wardId,'ward');
		}
	}, [wardName]);

	useEffect(() => {
		if (provinceId) {
			const provinceCentriodForMap = provinceDataIs.filter(item => item.id === provinceId)
				.map(item=> item.centroid.coordinates)[0];
			setprovinceCentriodForMap(provinceCentriodForMap); 
		}
	}, [provinceId]);

	useEffect(() => {
		if (districtId) {
			const districtCentriodForMap = districtDataIs.filter(item => item.id === districtId)
				.map(item=> item.centroid.coordinates)[0];
			setdistrictCentriodForMap(districtCentriodForMap); 
		}
	}, [districtId]);

	useEffect(() => {
		if (municipalityId) {
			const municipalityCentriodForMap = municipalityDataIs.filter(item => item.id === municipalityId)
				.map(item=> item.centroid.coordinates)[0];
			setmunicipalityCentriodForMap(municipalityCentriodForMap); 
		}
	}, [municipalityId]);

	useEffect(() => {
		if (wardId) {
			const wardCentriodForMap = wardDataIs.filter(item => item.id === wardId)
				.map(item=> item.centroid.coordinates)[0];
			setwardCentriodForMap(wardCentriodForMap); 
		}
	}, [wardId]);



	const centriodsForMap = {
		provinceDataIs,
		districtDataIs,
		municipalityDataIs,
		wardDataIs,
		provinceCentriodForMap,
		districtCentriodForMap,
		municipalityCentriodForMap,
		wardCentriodForMap,
		provinceId,
		districtId,
		municipalityId,
		wardId,
		setLattitude,
		setLongitude,
		lattitude,
		longitude,
	};


	
	// useEffect(() => {
	// 	if(wardName){
	// 		handleFormData(wardName,'ward');
	// 	}
	// }, [wardName]);
	useEffect(()=>{
		setPoint(lattitude,'lat');
	},[lattitude]);
	useEffect(()=>{
		setPoint(longitude,'lng');
	},[longitude]);

	return (
		<>
			<div className={styles.rowTitle1}>
				<h2>
							Location
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
				This section contains the address and geolocation of the institutions. Location is required to submit the form.
				</p>
			</div>
			<div className={styles.row3}>
				<AccentHeading 
					content={'Please click on the map to set latitude and longitude of the health institution'}
				/>
			</div>
			<div className={styles.locationPage}>
				<div className={styles.infoBar}>
					<p className={styles.instInfo}> <span style={{color :'#003572'}}>A.</span>  {' '}
						 Geographical Information on the area</p>
				</div>
				{
					Object.keys(healthFormEditData).length === 0 
					&&
					<>
						<div className={styles.fourInputSections}>
							<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
								<InputLabel id="demo-simple-select-label">Select Province</InputLabel>
								<Select
									disabled={getDisabled() || (userDataMain.profile && userDataMain.profile.province)}
									className={styles.adminLvlSelection}
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={provinceName}
									error={typeof validationError === 'string'}
									label="Select Province"
									style={(typeof validationError === 'string' && !provinceName )? { border: '1px solid #ff0000'} : { border: '1px solid #d5d5d5'} }
									disableUnderline
									onChange={e => setprovinceName(e.target.value)}
								>
									{provinceDataIs && provinceDataIs.map(item =>(
										<MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
								<InputLabel id="demo-simple-select-label">Select District</InputLabel>
								<Select
									className={provinceName==='' && loadingDistrict? styles.adminLvlSelectionDisabled : 
										styles.adminLvlSelection}
									disabled={provinceName === '' || getDisabled() || (userDataMain.profile && userDataMain.profile.district)}
									labelId="demo-simple-select-label"
									error={typeof validationError === 'string'}
									id="demo-simple-select"
									value={districtName}
									label="Select District"
									style={(typeof validationError === 'string' && !districtName ) ? { border: '1px solid #ff0000'} : { border: '1px solid #d5d5d5'} }
									disableUnderline
									onChange={e => setdistrictName(e.target.value)}
								>
									{districtDataIs && districtDataIs.map(item =>(
										<MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
								<InputLabel id="demo-simple-select-label">Select Municipality</InputLabel>
								<Select
									className={districtName==='' || loadingMunicipality ? styles.adminLvlSelectionDisabled : 
										styles.adminLvlSelection}
									disabled={districtName === '' || getDisabled() || (userDataMain.profile && userDataMain.profile.municipality)}
									error={typeof validationError === 'string'}
									helperText={typeof validationError === 'string' ? 'This field is required' : null}
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={municipalityName}
									label="Select Municipality"
									style={(typeof validationError === 'string' && !municipalityName )? { border: '1px solid #ff0000'} : { border: '1px solid #d5d5d5'} }
									disableUnderline
									onChange={e => setmunicipalityName(e.target.value)}
								>
									{municipalityDataIs && municipalityDataIs.map(item =>(
										<MenuItem key={item.title} value={item.title}>{item.title}</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
								<InputLabel id="demo-simple-select-label">Select Ward</InputLabel>
								<Select
									disableUnderline
									error={typeof validationError === 'string'}
									helperText={typeof validationError === 'string' ? 'This field is required' : null}
									disabled={municipalityName === '' || getDisabled()}
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={wardName}
									label="Select Ward"
									// style={{ border: '1px solid #d5d5d5',borderRadius:'3px'}}
									style={(typeof validationError === 'string' && !wardName )? { border: '1px solid #ff0000'} : { border: '1px solid #d5d5d5'}  }
									onChange={(e)=>setwardName(e.target.value)}
								>
									{wardDataIs && wardDataIs.map(item => Number(item.title)).sort((a,b) => a-b ).map(item =>(
										<MenuItem key={item} value={item}>{item}</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* <FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
						<TextField 
							disabled={getDisabled('ward')}
							error={typeof validationError === 'string'}
							helperText={typeof validationError === 'string' ? 'This field is required' : null}
							id="wardID" 
							label="In what ward is the facility located?" 
							variant="filled" 
							value={formData.ward}
							onChange={(e)=>handleFormData(e,'ward')}
							InputProps={{ 
								disableUnderline: true,
							}}
							style={{ border: '1px solid #d5d5d5'}}
						/>
					</FormControl> */}

							{/* <FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
								<InputLabel id="demo-simple-select-label">Select Ward</InputLabel>
								<Select
									className={municipalityName==='' || loadingWard ? styles.adminLvlSelectionDisabled : 
										styles.adminLvlSelection}
									disabled={municipalityName === '' && true}
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={handleFormData.ward}
									label="Select Ward"
									style={{ border: '1px solid #d5d5d5',borderRadius:'3px'}}
									disableUnderline
									onChange={e => handleFormData(e,'ward')}
								>
									{wardDataIs && wardDataIs.map(item => Number(item.title)).sort((a,b) => a-b ).map(item =>(
										<MenuItem key={item} value={item}>{item}</MenuItem>
									))}
								</Select>
							</FormControl> */}
						</div>

					</>
				}

								
											
				<div className={styles.twoInputSections}>
					<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
						<TextField className={styles.materialUiInput}
							value={lattitude}
							error={typeof validationError === 'string' && !lattitude}
							helperText={typeof validationError === 'string' ? 'This field is required' : null}
							disabled={getDisabled()}
							onChange={e => setPoint(e.target.value,'lat')}
							id="outlined-basic" label="Lattitude" 
							InputProps={{ disableUnderline: true}}
							variant="filled" 
							style={{ border: '1px solid #d5d5d5',borderRadius:'3px'}}
							fullWidth
						/>
					</FormControl>
					<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
						<TextField className={styles.materialUiInput}
							value={longitude}
							disabled={getDisabled()}
							error={typeof validationError === 'string' && !longitude}
							helperText={typeof validationError === 'string' ? 'This field is required' : null}
							onChange={e => setPoint(e.target.value,'lng')}
							id="outlined-basic" label="Longitude"  
							InputProps={{ disableUnderline: true}}
							variant="filled" 
							style={{ border: '1px solid #d5d5d5',borderRadius:'3px'}}
							fullWidth

						/>
					</FormControl>
				</div>
				
				<FormControl style={{margin: '15px 0'}} variant="filled" fullWidth>
					<TextField 
						disabled={getDisabled('local_address')}
						id="local_addressID" 
						label="What is the local address of the facility?" 
						variant="filled" 
						value={formData.local_address}
						onChange={(e)=>handleFormData(e,'local_address')}
						InputProps={{ 
							disableUnderline: true,
						}}
						style={{ border: '1px solid #d5d5d5'}}
					/>
				</FormControl>
				<LngLatContext.Provider value={[longitude, setLongitude,lattitude, setLattitude]}>
					{
						(resourceID) &&
						<Map 
							disabled={getDisabled('point')} 
							centriodsForMap={centriodsForMap} 
							editedCoordinates ={formData}/>
															
					}
					{
						(!resourceID) &&
						<Map 
							disabled={getDisabled('point')}
							centriodsForMap={centriodsForMap}
							// resetMap={resetMap}		
							initialProvinceCenter = {initialProvinceCenter}
							initialDistrictCenter = {initialDistrictCenter}
							initialMunCenter = {initialMunCenter}
						/>
															
					}

				</LngLatContext.Provider>
				{
					validationError && 
					<p style={{color: 'red'}}>{validationError}</p>
				}
				<NextButton 
					getActiveMenu={props.getActiveMenu} 
					progress={progress}
					activeMenu={props.activeMenu}
					handleProgress={props.handleProgress}
					formData={formData}
				/>
			</div>
		</>
	);
}
