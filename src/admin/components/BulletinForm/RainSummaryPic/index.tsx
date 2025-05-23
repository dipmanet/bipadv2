/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import Placeholder from 'src/admin/resources/placeholder.png';
import { Translation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { setBulletinEditDataAction } from '#actionCreators';
import { bulletinEditDataSelector } from '#selectors';
import styles from './styles.scss';

interface Props {

}

const mapStateToProps = state => ({
    bulletinEditData: bulletinEditDataSelector(state),
});


const TemperaturesMin = (props: Props) => {
    const {
        rainSummaryPic,
        handleRainSummaryPic,
        hideForm,
        rainSummaryFooter,
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

    useEffect(() => {
        if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
            if (bulletinEditData.language === 'nepali' && bulletinEditData.rainSummaryPictureNe) {
                setpicLink(bulletinEditData.rainSummaryPictureNe);
                setPicFromEdit(true);
            } else if (bulletinEditData.language === 'english' && bulletinEditData.rainSummaryPicture) {
                setpicLink(bulletinEditData.rainSummaryPicture);
                setPicFromEdit(true);
            }
        }
    }, [bulletinEditData]);

    return (
        <div className={styles.formContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input disabled={hideForm} {...getInputProps()} />

                <div className={hideForm ? styles.subContainerReport : styles.subContainer} style={{ marginLeft: '0px' }}>

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
                                        style={{ objectFit: 'contain' }}
                                    />
                                </>
                            )
                        }
                        {
                            !picFromEdit && !rainSummaryPic
                            && (
                                <>
                                    <img
                                        style={{ objectFit: 'contain' }}
                                        src={Placeholder}
                                        alt="temperature"
                                        title="Click to select picture"
                                        className={styles.placeholder}
                                    />
                                </>
                            )
                        }
                    </div>
                    {hideForm && rainSummaryFooter
                        && (
                            <p className={styles.footerText}>
                                {rainSummaryFooter}
                            </p>
                        )
                    }
                </div>
            </div>
        </div>


    );
};

export default connect(mapStateToProps)(TemperaturesMin);
