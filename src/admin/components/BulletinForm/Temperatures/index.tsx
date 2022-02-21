/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TemperatureMax from 'src/admin/components/BulletinForm/TemperaturesMax';
import TemperatureMin from 'src/admin/components/BulletinForm/TemperaturesMin';
import RainSummaryPic from 'src/admin/components/BulletinForm/RainSummaryPic';
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
        rainSummaryPic,
        handleRainSummaryPic,
        handleFooterMax,
        handleFooterMin,
        maxTempFooter,
        minTempFooter,
    } = props;

    return (
        <div className={styles.formContainer}>
            {
                !hideForm
                    && <p>Drag drop temperature files here, or click to select files</p>
            }
            {
                !hideForm
                && (

                    <div className={styles.formItemDailySummary}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'दैनिक बर्षा को सारांश'}
                            </InputLabel>
                            {' '}
                            <Input
                                type="text"
                                value={dailySummary}
                                onChange={e => handleDailySummary(e)}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #cecccc;', borderRadius: '3px', padding: '0 10px' }}
                            />
                            {/* <TextareaAutosize
                                aria-label="minimum height"
                                value={dailySummary}
                                onChange={e => handleDailySummary(e)}
                                minRows={8}
                                placeholder=""
                                style={{ border: '1px solid #cecccc', borderRadius: '3px', padding: '0 10px' }}
                            /> */}
                        </FormControl>


                    </div>
                )}
            <RainSummaryPic
                rainSummaryPic={rainSummaryPic}
                handleRainSummaryPic={handleRainSummaryPic}
                hideForm={hideForm}
            />
            <div className={!hideForm ? styles.picContainer : styles.picContainerReport}>
                <TemperatureMax
                    maxTemp={maxTemp}
                    handleMaxTemp={handleMaxTemp}
                    hideForm={hideForm}
                    maxTempFooter={maxTempFooter}
                />
                {
                    !hideForm
                && (

                    <div className={styles.formItemfooter}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'दैनिक अधिकतम तापक्रम नक्सा वर्णन'}
                            </InputLabel>
                            {' '}
                            <Input
                                type="text"
                                value={maxTempFooter}
                                onChange={e => handleFooterMax(e)}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #cecccc;', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>


                    </div>
                )}
                <TemperatureMin
                    minTemp={minTemp}
                    handleMinTemp={handleMinTemp}
                    hideForm={hideForm}
                    minTempFooter={minTempFooter}
                />
                {
                    !hideForm
                && (

                    <div className={styles.formItemfooter}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'दैनिक न्युनतम तापक्रम नक्सा वर्णन'}
                            </InputLabel>
                            {' '}
                            <Input
                                type="text"
                                value={minTempFooter}
                                onChange={e => handleFooterMin(e)}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #cecccc;', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>


                    </div>
                )}
            </div>


        </div>
    );
};

export default Bulletin;
