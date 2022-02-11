/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Placeholder from 'src/admin/resources/placeholder.png';
import { useDropzone } from 'react-dropzone';
import TemperatureMax from 'src/admin/components/BulletinForm/TemperaturesMax';
import TemperatureMin from 'src/admin/components/BulletinForm/TemperaturesMin';
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
        title,
    } = props;

    return (
        <div className={styles.formContainer}>
            {
                !hideForm
                    && <p>Drag drop temperature files here, or click to select files</p>
            }
            <div className={!hideForm ? styles.picContainer : styles.picContainerReport}>
                <TemperatureMax
                    maxTemp={maxTemp}
                    handleMaxTemp={handleMaxTemp}
                    hideForm={hideForm}
                />
                <TemperatureMin
                    minTemp={minTemp}
                    handleMinTemp={handleMinTemp}
                    hideForm={hideForm}
                />
            </div>
            {
                !hideForm
                && (
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
                )}
        </div>
    );
};

export default Bulletin;
