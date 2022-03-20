/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Placeholder from 'src/admin/resources/placeholder.png';
import { Translation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import styles from './styles.scss';

interface Props {

}

const TemperaturesMin = (props: Props) => {
    const {
        rainSummaryPic,
        handleRainSummaryPic,
        hideForm,
    } = props;

    const [picFromEdit, setPicFromEdit] = useState(false);
    const [picLink, setpicLink] = useState(false);

    const showPicMin = (file) => {
        // const file = document.getElementById('file').files[0];
        const reader = new FileReader();
        // eslint-disable-next-line func-names
        reader.onload = function (e) {
            const image = document.createElement('img');
            const picNode = document.getElementById('pictureContainerRain');
            image.src = e.target.result;
            if (picNode.firstChild) {
                picNode.removeChild(picNode.lastChild);
            }
            document.getElementById('pictureContainerRain').appendChild(image);
        };
        reader.readAsDataURL(file);
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            handleRainSummaryPic(acceptedFiles[0]);
            const reader = new FileReader();
            // eslint-disable-next-line func-names
            reader.onload = function (e) {
                const image = document.createElement('img');
                const picNode = document.getElementById('pictureContainerRain');
                image.src = e.target.result;
                if (picNode.firstChild) {
                    picNode.removeChild(picNode.lastChild);
                }
                document.getElementById('pictureContainerRain').appendChild(image);
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles]);

    const handleMinTempInput = (file: File) => {
        handleRainSummaryPic(file);
        showPicMin(file);
    };
    useEffect(() => {
        window.scrollTo({ top: 400, left: 0 });
        if (rainSummaryPic && typeof rainSummaryPic !== 'string') {
            showPicMin(rainSummaryPic);
        }
    }, [rainSummaryPic]);

    return (
        <div className={styles.formContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />

                <div className={hideForm ? styles.subContainerReport : styles.subContainer}>

                    {!hideForm
                      && (
                          <Translation>
                              {
                                  t => <h3>{t('Picture of Daily Rainfall Map')}</h3>
                              }
                          </Translation>
                      )

                    }
                    <div id="pictureContainerRain" className={styles.picture}>
                        {
                            picFromEdit
                            && (
                            <>
                                <img
                                    src={picLink}
                                    alt="temperature"
                                />
                            </>
                            )
                        }
                        {
                            !picFromEdit && !rainSummaryPic
                            && (
                            <>
                                <img
                                    src={Placeholder}
                                    alt="temperature"
                                    title="Click to select picture"
                                    className={styles.placeholder}
                                />
                            </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>


    );
};

export default TemperaturesMin;
