/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Placeholder from 'src/admin/resources/placeholder.png';
import { useDropzone } from 'react-dropzone';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import {
    bulletinPageSelector, languageSelector, bulletinEditDataSelector,
} from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
});

interface Props {

}

const TemperaturesMin = (props: Props) => {
    const {
        minTemp,
        handleMinTemp,
        hideForm,
        minTempFooter,
        bulletinEditData,
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

    useEffect(() => {
        if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
            if (bulletinEditData.language === 'nepali' && bulletinEditData.rainSummaryPictureNe) {
                setpicLink(bulletinEditData.tempMinNe);
                setPicFromEdit(true);
            } else if (bulletinEditData.language === 'english' && bulletinEditData.rainSummaryPicture) {
                setpicLink(bulletinEditData.tempMin);
                setPicFromEdit(true);
            }
        }
    }, [bulletinEditData]);

    return (
        <div className={styles.formContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input disabled={hideForm} {...getInputProps()} />

                <div className={styles.subContainer} style={{ marginLeft: '5px' }}>


                    <Translation>
                        {
                            t => <p>{t('Daily Min Temperature')}</p>
                        }
                    </Translation>

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

export default connect(mapStateToProps)(TemperaturesMin);
