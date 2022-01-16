/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import styles from './styles.scss';

interface Props {

}

const Bulletin = (props: Props) => {
    const {
        minTemp,
        maxTemp,
        handleMaxTemp,
        handleMinTemp,
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
    }, []);

    return (
        <div className={styles.formContainer}>

            <div className={styles.pictureContainer}>
                <div id="pictureContainerMax" className={styles.picture}>
                    <h2>
                        Maximum Temperatures
                    </h2>
                    {
                        picFromEdit
                        && (
                        <>
                            <h2>Max Temp</h2>
                            <img src={picLink} alt="temperature" />
                        </>
                        )
                    }
                </div>
                <div id="pictureContainerMin" className={styles.picture}>
                    <h2>
                        Minimum Temperatures
                    </h2>
                    {
                        picFromEdit
                        && (
                        <>
                            <h2>Min Temp</h2>
                            <img src={picLink} alt="temperature" />
                        </>
                        )
                    }
                </div>
            </div>

            <div className={styles.rowTitle1}>
                <h2>
                             Upload Picture
                </h2>
            </div>
            <h3>दैनिक अधिकतम तापक्रम</h3>
            <div className={styles.containerForm}>

                <FileUploader
                    onFileSelectSuccess={handleMaxTempInput}
                />
            </div>
            <div className={styles.containerForm}>

                <FileUploader
                    onFileSelectSuccess={handleMinTempInput}
                />
            </div>
        </div>


    );
};

export default Bulletin;
