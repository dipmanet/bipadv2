/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import Placeholder from 'src/admin/resources/placeholder.png';
import { useDropzone } from 'react-dropzone';
import styles from './styles.scss';

interface Props {

}

const TemperatureMax = (props: Props) => {
    const {
        maxTemp,
        handleMaxTemp,
        hideForm,
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

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        console.log('acceptedFiles', acceptedFiles);
        if (acceptedFiles.length > 0) {
            handleMaxTemp(acceptedFiles[0]);
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
            reader.readAsDataURL(acceptedFiles[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles]);


    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
        if (maxTemp && typeof maxTemp !== 'string') {
            showPicMax(maxTemp);
        }
    }, [maxTemp]);

    return (
        <div className={styles.formContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />

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
            </div>
        </div>


    );
};

export default TemperatureMax;
