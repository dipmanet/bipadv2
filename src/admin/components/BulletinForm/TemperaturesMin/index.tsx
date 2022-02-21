/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Placeholder from 'src/admin/resources/placeholder.png';
import { useDropzone } from 'react-dropzone';
import styles from './styles.scss';

interface Props {

}

const TemperaturesMin = (props: Props) => {
    const {
        minTemp,
        handleMinTemp,
        hideForm,
        minTempFooter,
    } = props;

    const [picFromEdit, setPicFromEdit] = useState(false);
    const [picLink, setpicLink] = useState(false);

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

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        console.log('acceptedFiles', acceptedFiles);
        if (acceptedFiles.length > 0) {
            handleMinTemp(acceptedFiles[0]);
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
            reader.readAsDataURL(acceptedFiles[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles]);

    const handleMinTempInput = (file: File) => {
        handleMinTemp(file);
        showPicMin(file);
    };
    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
        if (minTemp && typeof minTemp !== 'string') {
            showPicMin(minTemp);
        }
    }, [minTemp]);

    return (
        <div className={styles.formContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />

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
                    {hideForm && minTempFooter
                        && (
                            <p className={styles.footerText}>
                                {minTempFooter}
                            </p>
                        )
                    }
                </div>
            </div>
        </div>


    );
};

export default TemperaturesMin;
