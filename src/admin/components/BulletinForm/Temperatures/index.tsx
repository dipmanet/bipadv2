/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Placeholder from 'src/admin/resources/placeholder.png';
import styles from './styles.scss';

interface Props {

}

const Bulletin = (props: Props) => {
    const {
        minTemp,
        maxTemp,
        handleMaxTemp,
        handleMinTemp,
        hideForm,
        handleDailySummary,
        dailySummary,
    } = props;
    const [picFromEdit, setPicFromEdit] = useState(false);
    const [picLink, setpicLink] = useState(false);


    const showPicMax = (file) => {
        // const file = document.getElementById('file').files[0];
        const reader = new FileReader();
        // eslint-disable-next-line func-names
        reader.onload = function (e) {
            const image = document.createElement('img');
            const picNode = document.getElementById('pictureContainerMax');
            image.src = e.target.result;
            if (picNode.firstChild) {
                picNode.removeChild(picNode.lastChild);
            }
            document.getElementById('pictureContainerMax').appendChild(image);
        };
        reader.readAsDataURL(file);
    };

    const showPicMin = (file) => {
        // const file = document.getElementById('file').files[0];
        const reader = new FileReader();
        // eslint-disable-next-line func-names
        reader.onload = function (e) {
            const image = document.createElement('img');
            const picNode = document.getElementById('pictureContainerMin');
            image.src = e.target.result;
            if (picNode.firstChild) {
                picNode.removeChild(picNode.lastChild);
            }
            document.getElementById('pictureContainerMin').appendChild(image);
        };
        reader.readAsDataURL(file);
    };

    const handleMaxTempInput = (file: File) => {
        handleMaxTemp(file);
        // if (resourceID) {
        //     setPicFromEdit(false);
        // }
        showPicMax(file);
    };
    const handleMinTempInput = (file: File) => {
        handleMinTemp(file);
        // if (resourceID) {
        //     setPicFromEdit(false);
        // }
        showPicMin(file);
    };
    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
        // if (resourceID) {
        //     setPicFromEdit(true);
        //     setpicLink(formData.picture);
        //     handleFile(null, 'picture');
        // }

        if (minTemp && typeof minTemp !== 'string') {
            showPicMin(minTemp);
        }
        if (maxTemp && typeof maxTemp !== 'string') {
            showPicMax(maxTemp);
        }
    }, [maxTemp, minTemp]);

    return (
        <div className={styles.formContainer}>

            <div className={styles.pictureContainer}>
                <div className={styles.subContainer}>
                    <h3>दैनिक अधिकतम तापक्रम</h3>
                    <div id="pictureContainerMax" className={styles.picture}>
                        {
                            picFromEdit
                        && (
                        <>
                            <img src={picLink} alt="temperature" />
                        </>
                        )
                        }
                        {
                            !picFromEdit && !maxTemp
                        && (
                        <>
                            <img className={styles.placeholder} src={Placeholder} alt="temperature" />
                        </>
                        )
                        }
                    </div>
                </div>
                <div className={styles.subContainer}>

                    <h3>दैनिक न्युनतम तापक्रम</h3>
                    <div id="pictureContainerMin" className={styles.picture}>
                        {
                            picFromEdit
                        && (
                        <>
                            <img src={picLink} alt="temperature" />
                        </>
                        )
                        }
                        {
                            !picFromEdit && !minTemp
                        && (
                        <>
                            <img className={styles.placeholder} src={Placeholder} alt="temperature" />
                        </>
                        )
                        }
                    </div>
                </div>
            </div>


            {
                !hideForm
            && (
            <>
                <div className={styles.rowTitle1}>
                    <h2>
                    तस्विर अपलोड गर्नुहोस्
                    </h2>
                </div>
                <h3>दैनिक अधिकतम तापक्रम</h3>
                <div className={styles.containerForm}>

                    <FileUploader
                        onFileSelectSuccess={handleMaxTempInput}
                    />
                </div>
                <h3>दैनिक न्युनतम तापक्रम</h3>
                <div className={styles.containerForm}>

                    <FileUploader
                        onFileSelectSuccess={handleMinTempInput}
                    />
                </div>
                <div className={styles.formItem}>

                    <FormControl fullWidth>
                        <InputLabel>
                            {'दैनिक बर्षा को सारांश'}
                        </InputLabel>
                        <Input
                            type="text"
                            value={dailySummary}
                            onChange={e => handleDailySummary(e)}
                            className={styles.select}
                            disableUnderline
                            inputProps={{
                                disableUnderline: true,
                            }}
                            style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                        />
                    </FormControl>
                </div>

            </>
            )
            }
        </div>


    );
};

export default Bulletin;
