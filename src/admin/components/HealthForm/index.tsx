/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CamelCase from 'snakecase-keys';
import InstitutionDetails from './InstitutionDetails';
import DisasterManagement from './DisasterManagement';
import Contact from './Contact';
import Inventories from './Inventories';
import Location from './Location';
import { institutionDetails, FormDataType } from './utils';

import Picture from './Picture';
import Verification from './Verification';
import { RootState } from '../../Redux/store';
import { setResourceID, getInventoryItem, clearFormEdit } from '../../Redux/actions';
import styles from './styles.module.scss';

interface Props {
    progress: number;
    activeMenu: number;
    getActiveMenu: (e: number) => void;
    handleProgress: (e: number) => void;
}

const HealthForm = (props: Props): JSX.Element => {
    const [formData, setFormData] = useState<FormDataType>(institutionDetails);
    const { progress, activeMenu, getActiveMenu, handleProgress } = props;
    const { healthFormEditData } = useSelector((state: RootState) => state.health);
    const dispatch = useDispatch();


    useEffect(() => {
        if (Object.keys(healthFormEditData).length > 0) {
            console.log('edit data', healthFormEditData);
            const newObj = CamelCase(healthFormEditData);
            const editData = { ...newObj, resource_type: 'health' };
            setFormData(editData);
            dispatch(setResourceID(healthFormEditData.id));
            dispatch(getInventoryItem(healthFormEditData.id));
            dispatch(clearFormEdit());
        }
    }, [dispatch, healthFormEditData]);


    const getVal = (fN, e: string) => {
        if (e === 'on') {
            return !formData[fN];
        }
        if (e === 'Yes') {
            return true;
        }
        if (e === 'No') {
            return false;
        }
        return e;
    };
    const handleFormData = (e, fN: string) => {
        // console.log('ward is this',e.target.value);
        if (fN === 'ward') {
            setFormData({ ...formData, ward: e });
        } else {
            setFormData({ ...formData, [fN]: getVal(fN, e.target.value) });
        }
    };

    const resetForm = () => {
        setFormData(institutionDetails);
    };
    const handleDate = (e: Date, fN: string) => {
        const mm = e.getMonth() + 1;
        const dd = e.getDate();
        const yy = e.getFullYear();
        setFormData({ ...formData, [fN]: `${yy}-${mm}-${dd}` });
    };
    const handleTime = (e: Date, fN: string) => {
        const time = e.toLocaleTimeString([], { hour12: false }).split(':');
        setFormData({ ...formData, [fN]: `${time[0]}:${time[1]}` });
    };
    const setPoint = (e: string, latlng: string) => {
        let pointData = { type: 'Point', coordinates: [] };
        if (!formData.point) {
            pointData = { type: 'Point', coordinates: [] };
        } else {
            pointData = formData.point;
        }
        if (latlng === 'lat') {
            // eslint-disable-next-line prefer-const
            let newPoint = { ...pointData };

            newPoint.coordinates = [newPoint.coordinates[0], e];
            setFormData({ ...formData, point: newPoint });
        }
        if (latlng === 'lng') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newPoint = { ...pointData };

            newPoint.coordinates = [e, newPoint.coordinates[1]];
            setFormData({ ...formData, point: newPoint });
        }
    };


    const handleFile = (file: File, fN: string) => {
        setFormData({ ...formData, [fN]: file });
    };


    return (
        <>
            {
			    activeMenu === 'Institution Details'
            &&			(
                <InstitutionDetails
                    handleFormData={handleFormData}
                    handleDate={handleDate}
                    formData={formData}
                    progress={progress}
                    getActiveMenu={getActiveMenu}
                    handleProgress={handleProgress}
                    activeMenu={activeMenu}
                />
            )
            }
            {
			    activeMenu === 'Disaster Management'
            &&			(
                <DisasterManagement
                    handleFormData={handleFormData}
                    handleTime={handleDate}
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    handleProgress={handleProgress}
                />
            )
            }
            {
			    activeMenu === 'Contact'
            &&			(
                <Contact
                    handleFormData={handleFormData}
                    handleTime={handleTime}
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    handleProgress={handleProgress}
                />
            )
            }
            {
			    activeMenu === 'Location'
            &&			(
                <Location
                    handleFormData={handleFormData}
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    setPoint={setPoint}
                    handleProgress={handleProgress}
                />
            )
            }
            {
			    activeMenu === 'Verification'
            &&			(
                <Verification
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    handleFile={handleFile}
                    handleFormData={handleFormData}
                    handleProgress={handleProgress}
                />
            )
            }
            {
			    activeMenu === 'Picture'
            &&			(
                <Picture
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    handleFile={handleFile}
                    handleFormData={handleFormData}
                    handleProgress={handleProgress}
                />
            )
            }
            {
			    activeMenu === 'Inventories'
            &&			(
                <Inventories
                    formData={formData}
                    progress={progress}
                    activeMenu={activeMenu}
                    getActiveMenu={getActiveMenu}
                    resetForm={resetForm}
                    handleProgress={handleProgress}
                />
            )
            }

        </>
    );
};

export default HealthForm;
