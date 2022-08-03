/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import FileUploader from 'src/admin/components/FileUploader';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TemperatureMax from 'src/admin/components/BulletinForm/TemperaturesMax';
import TemperatureMin from 'src/admin/components/BulletinForm/TemperaturesMin';
import RainSummaryPic from 'src/admin/components/BulletinForm/RainSummaryPic';
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import {
    bulletinEditDataSelector,
    bulletinPageSelector, languageSelector,
} from '#selectors';
import PromotionImage from '../PromotionImage';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
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
        handlePromotionPic,
        promotionPic,
        selectedTemperatureImageType,
        setSelectedTemperatureImageType,
        language: { language },
        disableOptionButton,
        advertisementFile,
        advertisementFileNe,
        bulletinEditData,
    } = props;
    useEffect(() => {
        // if (Object.keys(bulletinEditData).length > 0) {
        if (selectedTemperatureImageType === null) {
            if (advertisementFile || advertisementFileNe) {
                setSelectedTemperatureImageType(2);
            } else {
                setSelectedTemperatureImageType(1);
            }
        }
    }, []);
    return (
        <div className={styles.formContainer}>
            {disableOptionButton ? ''
                : (
                    <FormControl className={styles.optionButton}>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={selectedTemperatureImageType}
                            onChange={(e) => {
                                {
                                    e.target.value === '1'
                                        ? handlePromotionPic(null)
                                        : handleRainSummaryPic(null);
                                }
                                setSelectedTemperatureImageType(Number(e.target.value));
                            }}
                        >
                            <FormControlLabel value={1} control={<Radio />} label="DHM Data" />
                            <FormControlLabel value={2} control={<Radio />} label="Promotion" />


                        </RadioGroup>
                    </FormControl>
                )}
            {selectedTemperatureImageType === 1
                ? (
                    <>
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

                                <div className={styles.formItemTextRainSummary}>
                                    <FormControl fullWidth>
                                        <Translation>
                                            {
                                                t => (
                                                    <textarea
                                                        placeholder={t('Daily Temperature and Rain Summary')}
                                                        value={dailySummary}
                                                        onChange={e => handleDailySummary(e)}
                                                        rows={5}
                                                        className={styles.textArea}
                                                    />
                                                )
                                            }
                                        </Translation>

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

                                    <div className={styles.formItemTextFull}>
                                        <FormControl fullWidth>
                                            <Translation>
                                                {
                                                    t => (
                                                        <textarea
                                                            placeholder={t('Daily Rainfall Map Description')}
                                                            value={rainSummaryFooter}
                                                            onChange={e => handleRainSummaryFooter(e)}
                                                            rows={5}
                                                            className={styles.textArea}
                                                        />
                                                    )
                                                }
                                            </Translation>
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

                                    <div className={styles.formItemText}>
                                        <FormControl fullWidth>
                                            <Translation>
                                                {
                                                    t => (
                                                        <textarea
                                                            placeholder={t('Daily Max Temperature Map Description')}
                                                            value={maxTempFooter}
                                                            onChange={e => handleFooterMax(e)}
                                                            rows={5}
                                                            className={styles.textArea}
                                                        />
                                                    )
                                                }
                                            </Translation>

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

                                    <div className={styles.formItemText}>
                                        <FormControl fullWidth>
                                            <Translation>
                                                {
                                                    t => (
                                                        <textarea
                                                            placeholder={t('Daily Min Temperature Map Description')}
                                                            value={minTempFooter}
                                                            onChange={e => handleFooterMin(e)}
                                                            rows={5}
                                                            className={styles.textArea}
                                                        />
                                                    )
                                                }
                                            </Translation>
                                        </FormControl>


                                    </div>
                                )}
                        </div>
                    </>
                ) : (
                    <div className={!hideForm ? styles.picContainer : styles.picContainerReport}>
                        <PromotionImage
                            promotionPic={promotionPic}
                            handlePromotionPic={handlePromotionPic}

                        />
                    </div>
                )}

        </div>
    );
};

export default connect(mapStateToProps)(Bulletin);
