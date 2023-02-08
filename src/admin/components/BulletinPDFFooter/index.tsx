import React from 'react';
import { connect } from 'react-redux';
import Temperatures from 'src/admin/components/BulletinForm/Temperatures';
// import tempMin from 'src/admin/resources/tempMin.png';
// import tempMax from 'src/admin/resources/tempMax.png';
import { Translation } from 'react-i18next';
import {
    bulletinPageSelector, languageSelector,
} from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
});


const BulletinPDFFooter = (props) => {
    const {
        tempMin,
        tempMax,
        handleRainSummaryPic,
        dailySummary,
        rainSummaryPic,
        maxTempFooter,
        minTempFooter,

    } = props.bulletinData;

    const { language: { language }, rainSummaryFooter, selectedTemperatureImageType,
        promotionPic,
        handlePromotionPic, setSelectedTemperatureImageType, advertisementFile,
        advertisementFileNe } = props;

    return (
        <div className={language === 'np' ? styles.footerContainer : styles.footerContainerEnglish}>
            {selectedTemperatureImageType === 1
                ? (
                    <div className={styles.dailySummary}>
                        <Translation>
                            {
                                t => <h2>{t('Daily Temperature and Rain Summary')}</h2>
                            }
                        </Translation>

                        <p>{dailySummary}</p>
                    </div>
                ) : ''}
            {/*
            <div className={styles.temperaturePics}>
                <img src={tempMin} alt="temp min" />
                <img src={tempMax} alt="temp max" />
            </div> */}

            <Temperatures
                hideForm
                minTemp={tempMin}
                maxTemp={tempMax}
                handleRainSummaryPic={handleRainSummaryPic}
                rainSummaryPic={rainSummaryPic}
                maxTempFooter={maxTempFooter}
                minTempFooter={minTempFooter}
                rainSummaryFooter={rainSummaryFooter}
                selectedTemperatureImageType={selectedTemperatureImageType}
                setSelectedTemperatureImageType={setSelectedTemperatureImageType}
                handlePromotionPic={handlePromotionPic}
                promotionPic={promotionPic}
                disableOptionButton
                advertisementFile={advertisementFile}
                advertisementFileNe={advertisementFileNe}

            />

            {/* <p>
                <strong>
                    <Translation>
                        {
                            t => <span>{t('Annex')}</span>
                        }
                    </Translation>
                    {' '}
                    1
                    :
                    {' '}

                </strong>
                <Translation>
                    {
                        t => <span>{t('Complete details of the incidents')}</span>
                    }
                </Translation>

                {' '}
            </p> */}

            <div className={styles.footer}>
                <h2>
                    {' '}
                    <Translation>
                        {
                            t => <span>{t('For additional info')}</span>
                        }
                    </Translation>

                </h2>
                <hr className={styles.horLine} />
                <p>
                    <Translation>
                        {
                            t => <span>{t('National Disaster Risk Reduction and Management Authority')}</span>
                        }
                    </Translation>

                </p>
                <p>
                    <Translation>
                        {
                            t => <span>{t('GPO Box Number')}</span>
                        }
                    </Translation>
                    :
                    213213
                    {' '}

                </p>
                <p>
                    <Translation>
                        {
                            t => <span>{t('Phone')}</span>
                        }
                    </Translation>
                    :  +977-1-4211195, +977-1-4211196
                    {' '}

                </p>
                <p>
                    <Translation>
                        {
                            t => <span>{t('Email')}</span>
                        }
                    </Translation>
                    : info@bipad.gov.np
                </p>
            </div>

        </div>
    );
};

export default connect(mapStateToProps)(
    // createConnectedRequestCoordinator<ReduxProps>()(
    // createRequestClient(requests)(
    BulletinPDFFooter,
    // ),
    // ),
);
