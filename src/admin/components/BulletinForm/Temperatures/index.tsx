/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TemperatureMax from 'src/admin/components/BulletinForm/TemperaturesMax';
import TemperatureMin from 'src/admin/components/BulletinForm/TemperaturesMin';
import RainSummaryPic from 'src/admin/components/BulletinForm/RainSummaryPic';
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import {
    bulletinPageSelector, languageSelector,
} from '#selectors';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
});


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
        rainSummaryFooter,
        handleRainSummaryFooter,
    } = props;

    return (
        <div className={styles.formContainer}>
            {
                !hideForm
                && (
                    <Translation>
                        {
                            t => <p>{t('Please click on the image to select files')}</p>
                        }
                    </Translation>
                )
            }
            {
                !hideForm
                && (

                    <div className={styles.formItemDailySummary}>
                        <FormControl fullWidth>
                            <InputLabel>
                                <Translation>
                                    {
                                        t => <span>{t('Daily Temperature and Rain Summary')}</span>
                                    }
                                </Translation>
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
            <div className={!hideForm ? styles.picContainer : styles.picContainerReport}>
                <RainSummaryPic
                    rainSummaryPic={rainSummaryPic}
                    handleRainSummaryPic={handleRainSummaryPic}
                    hideForm={hideForm}
                    rainSummaryFooter={rainSummaryFooter}
                />
                {
                    !hideForm
                    && (

                        <div className={styles.formItemfooter}>
                            <FormControl fullWidth>

                                <InputLabel>
                                    <Translation>
                                        {
                                            t => <span>{t('Daily Rainfall Map Description')}</span>
                                        }
                                    </Translation>
                                </InputLabel>
                                {' '}
                                <Input
                                    type="text"
                                    value={rainSummaryFooter}
                                    onChange={e => handleRainSummaryFooter(e)}
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
                                    <Translation>
                                        {
                                            t => <span>{t('Daily Max Temperature Map Description')}</span>
                                        }
                                    </Translation>
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
                                    <Translation>
                                        {
                                            t => <span>{t('Daily Min Temperature Map Description')}</span>
                                        }
                                    </Translation>
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

export default connect(mapStateToProps)(Bulletin);
