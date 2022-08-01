/* eslint-disable no-useless-concat */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line import/no-unresolved
import { _cs } from '@togglecorp/fujs';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { BSToAD } from 'bikram-sambat-js';
import 'nepali-datepicker-reactjs/dist/index.css';

import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';

import { Translation } from 'react-i18next';
import styles from './styles.scss';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import {
    resourceTypeListSelector,
    authStateSelector,
    filtersSelectorDP,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    carKeysSelector,
    dataDateRangeFilterSelector,
    languageSelector,
} from '#selectors';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import CommonMap from '#components/CommonMap';
import Loading from '#components/Loading';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import nepDatDownload from '#resources/icons/Download2.svg';

const mapStateToProps = (state: AppState): PropsFromState => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    language: languageSelector(state),


});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    nepDatGetRequest: {
        url: 'https://profile.bipad.gov.np/',
        method: methods.GET,
        query: ({ params }) => {
            if (!params) {
                return undefined;
            }

            return {

                generate_report: 'Generate+Report',
                report_type: params.report_type,
                language: params.language,
                province: params.province,
                district: params.district,
                municipality: params.municipality,
                start_date: params.start_date,
                end_date: params.end_date,
            };
        },
        onSuccess: ({ response, params }) => {
            console.log('this is output', response);
        },


        onMount: false,

    },

};
const NepDataProfile = (props) => {
    const { className, provinces, districts, municipalities,
        requests: { nepDatGetRequest }, language: { language } } = props;
    const [selectedReportType, setSelectedReportType] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState(null);
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [nepaliDate, setNepalidate] = useState({ start: '', end: '' });
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const reportType = [

        { value: '1', id: 'national', label: language === 'en' ? 'National' : 'राष्ट्रिय' },
        { value: '2', id: 'province', label: language === 'en' ? 'Province' : 'प्रदेश' },
        { value: '3', id: 'district', label: language === 'en' ? 'District' : 'जिल्‍ला' },
        { value: '4', id: 'municipality', label: language === 'en' ? 'Municipality' : 'नगरपालिका' },
    ];
    const languages = [
        { value: 'en', label: language === 'en' ? 'English' : 'अंग्रेजी' },
        { value: 'ne', label: language === 'en' ? 'Nepali' : 'नेपाली' },

    ];
    const province = provinces.map(data => ({ ...data, label: language === 'en' ? data.title_en : data.title_ne, value: data.id }));
    const district = selectedProvince && districts
        .filter(data => data.province === selectedProvince.id)
        .map(dist => ({ ...dist, label: language === 'en' ? dist.title_en : dist.title_ne, value: dist.id }));
    const municipality = selectedDistrict && municipalities
        .filter(data => data.district === selectedDistrict.id)
        .map(mun => ({ ...mun, label: language === 'en' ? mun.title_en : mun.title_ne, value: mun.id }));

    const handleChangeReportType = (e) => {
        setSelectedReportType(e);
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedMunicipality(null);
    };
    const handleChangeLanguage = (e) => {
        setSelectedLanguage(e);
    };

    const handleSelectProvince = (e) => {
        setSelectedProvince(e);
        setSelectedDistrict(null);
        setSelectedMunicipality(null);
    };
    const handleSelectDistrict = (e) => {
        setSelectedDistrict(e);
        setSelectedMunicipality(null);
    };
    const handleSelectedMunicipality = (e) => {
        setSelectedMunicipality(e);
    };
    const handleSubmit = () => {
        const baseUrl = 'https://profile.bipad.gov.np/';

        window.open(`${baseUrl}?report_type=${selectedReportType.id}` + `&language=${selectedLanguage.value}` + `&province=${selectedProvince ? selectedProvince.id : ''}` + `&district=${selectedDistrict ? selectedDistrict.id : ''}` + `&municipality=${selectedMunicipality ? selectedMunicipality.id : ''}`
            + `&start_date=${selectedStartDate}` + `&end_date=${selectedEndDate}` + '&generate_report=Generate+Report', '_blank');
        // axios.get(`${baseUrl}?report_type=${selectedReportType.id}` + `&language=${selectedLanguage.value}` + `&province=${selectedProvince ? selectedProvince.id : ''}` + `&district=${selectedDistrict ? selectedDistrict.id : ''}` + `&municipality=${selectedMunicipality ? selectedMunicipality.id : ''}`
        // + `&start_date=${selectedStartDate}` + `&end_date=${selectedEndDate}` + '&generate_report=Generate+Report')
        //     .then((res) => {
        //         console.log('This response', res);
        //     })
        //     .catch((err) => {
        //         console.log('This is error', err.message);
        //     });
    };
    useEffect(() => {
        if (startDate) {
            const date = new Date(startDate);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            setSelectedStartDate(formattedDate);
        }

        if (startDate === null && language === 'en') {
            setNepalidate({});
        }

        if (startDate && language === 'np') {
            setStartDate(null);
            setSelectedStartDate(null);
        }
    }, [language, startDate]);
    useEffect(() => {
        if (endDate) {
            const date = new Date(endDate);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            setSelectedEndDate(formattedDate);
        }
        if (endDate === null && language === 'en') {
            setNepalidate({});
        }

        if (endDate && language === 'np') {
            setEndDate(null);
            setSelectedEndDate(null);
        }
    }, [endDate, language]);

    useEffect(() => {
        if (nepaliDate.start) {
            const date = BSToAD(nepaliDate.start);
            // const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            setSelectedStartDate(date);
        }

        if (nepaliDate.start && language === 'en') {
            setStartDate(null);
            setSelectedStartDate(null);
        }
    }, [language, nepaliDate.start]);

    useEffect(() => {
        if (nepaliDate.end) {
            const date = BSToAD(nepaliDate.end);
            // const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            setSelectedEndDate(date);
        }

        if (nepaliDate.end && language === 'en') {
            setEndDate(null);
            setSelectedEndDate(null);
        }
    }, [language, nepaliDate.end]);

    return (
        <Translation>
            {
                t => (
                    <div className={_cs(className, styles.documents)}>

                        <CommonMap sourceKey="profile-document-nepdat" />
                        <div className={styles.header}>
                            <h2>{t('About')}</h2>

                        </div>
                        <div className={styles.content}>
                            <p>
                                {
                                    language === 'en'
                                        ? `The Nep Dat Profile generates disaster reports at national,
                                   provincial district, and municipal levels for the selected
                                   time frame. The report is generated in both English and Nepali
                                   versions. Using the data available in the BIPAD portal and DRR
                                   portal, the analysis is done to present data in terms of the
                                   number of disaster incidents, people deaths due to disaster
                                   incidents, estimated economic loss, hazard calendar, seasonal
                                   hazards, and most recurrent disasters.`
                                        : `Nep Dat Profile ले राष्ट्रिय, प्रादेशिक जिल्ला र नगरपालिका स्तरहरूमा चयन गरिएको समय सीमामा विपद् रिपोर्टहरू उत्पन्न गर्दछ।
                                        ।प्रतिवेदन अंग्रेजी र नेपाली दुवै संस्करणमा तयार पारिएको छ
                                        ।BIPAD पोर्टल र DRR पोर्टलमा उपलब्ध तथ्याङ्कहरू प्रयोग गरी, विपद् घटनाहरूको सङ्ख्या,
                                         विपद् घटनाहरूबाट हुने मानिसहरूको मृत्यु, अनुमानित आर्थिक क्षति,
                                        जोखिम क्यालेन्डर, मौसमी प्रकोपहरू,
                                           र धेरैजसो दोहोरिने प्रकोपहरूको सन्दर्भमा तथ्याङ्क प्रस्तुत गर्न विश्लेषण गरिन्छ।`

                                }

                            </p>
                        </div>
                        <div className={styles.dropdownHeaders}>
                            <h2>
                                {
                                    language === 'en'
                                        ? 'Provide following details to generate profile'
                                        : 'प्रोफाइल उत्पन्‍न गर्न निम्न विवरणहरू प्रदान गर्नुहोस्'
                                }

                            </h2>
                        </div>
                        <div className={styles.dropdowns}>
                            <h3>
                                {t('Report Type')}
                                :
                            </h3>
                            <Select
                                value={selectedReportType}
                                onChange={handleChangeReportType}
                                options={reportType}
                                placeholder={language === 'en' ? 'Select Report Type' : 'रिपोर्ट प्रकार चयन गर्नुहोस्'}
                            />

                        </div>
                        <div className={styles.dropdowns}>
                            <h3>
                                {t('Language')}
                                :
                            </h3>
                            <Select
                                value={selectedLanguage}
                                onChange={handleChangeLanguage}
                                options={languages}
                                isSearchable={false}
                                placeholder={language === 'en' ? 'Select Language' : 'भाषा छनोट गर्नुस'}
                                isDisabled={!selectedReportType}
                            />
                        </div>
                        {selectedReportType && selectedReportType.value === '4'
                            ? (
                                <>
                                    <div className={styles.dropdowns}>
                                        <h3>
                                            {t('Province')}
                                            :
                                        </h3>
                                        <Select
                                            value={selectedProvince}
                                            onChange={handleSelectProvince}
                                            options={province}
                                            placeholder={language === 'en' ? 'Select Province' : 'प्रदेश छनोट गर्नुस'}
                                            isDisabled={!selectedLanguage}

                                        />
                                    </div>
                                    <div className={styles.dropdowns}>
                                        <h3>
                                            {t('District')}
                                            :
                                        </h3>
                                        <Select
                                            value={selectedDistrict}
                                            onChange={handleSelectDistrict}
                                            options={district}
                                            placeholder={language === 'en' ? 'Select District' : 'जिल्‍ला छनोट गर्नुस'}
                                            isDisabled={!selectedProvince}
                                        />
                                    </div>
                                    <div className={styles.dropdowns}>
                                        <h3>
                                            {t('Municipality')}
                                            :
                                        </h3>
                                        <Select
                                            value={selectedMunicipality}
                                            onChange={handleSelectedMunicipality}
                                            options={municipality}
                                            placeholder={language === 'en' ? 'Select Municipality' : 'नगरपालिका छनोट गर्नुस'}
                                            isDisabled={!selectedDistrict}
                                        />
                                    </div>
                                </>
                            )
                            : selectedReportType && selectedReportType.value === '3'
                                ? (
                                    <>
                                        <div className={styles.dropdowns}>
                                            <h3>
                                                {t('Province')}
                                                :
                                            </h3>
                                            <Select
                                                value={selectedProvince}
                                                onChange={handleSelectProvince}
                                                options={province}
                                                placeholder={language === 'en' ? 'Select Province' : 'प्रदेश छनोट गर्नुस'}
                                                isDisabled={!selectedLanguage}
                                            />
                                        </div>
                                        <div className={styles.dropdowns}>
                                            <h3>
                                                {t('District')}
                                                :
                                            </h3>
                                            <Select
                                                value={selectedDistrict}
                                                onChange={handleSelectDistrict}
                                                options={district}
                                                placeholder={language === 'en' ? 'Select District' : 'जिल्‍ला छनोट गर्नुस'}
                                                isDisabled={!selectedProvince}
                                            />
                                        </div>
                                    </>
                                ) : selectedReportType && selectedReportType.value === '2'
                                    ? (
                                        <>
                                            <div className={styles.dropdowns}>
                                                <h3>
                                                    {t('Province')}
                                                    :
                                                </h3>
                                                <Select
                                                    value={selectedProvince}
                                                    onChange={handleSelectProvince}
                                                    options={province}
                                                    placeholder={language === 'en' ? 'Select Province' : 'प्रदेश छनोट गर्नुस'}
                                                    isDisabled={!selectedLanguage}
                                                />
                                            </div>
                                        </>
                                    ) : ''}

                        <div className={styles.dropdownDatePick}>
                            <h3>
                                {t('Select Date')}
                                :
                            </h3>
                            <div className={styles.dateSelect}>
                                <div>
                                    {
                                        language === 'en' ? (
                                            <DatePicker
                                                className={styles.datePick}
                                                selected={startDate}
                                                onChange={date => setStartDate(date)}
                                                placeholderText={t('Start Date')}
                                            />
                                        )
                                            : (
                                                <NepaliDatePicker
                                                    className="NepaliDate"
                                                    inputClassName={styles.datePick}
                                                    // className={styles.datePick}
                                                    value={nepaliDate.start}
                                                    onChange={value => setNepalidate({ ...nepaliDate, start: value })}
                                                    options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                                />
                                            )
                                    }
                                </div>
                                <h4>{language === 'en' ? 'to' : 'देखि'}</h4>
                                <div>
                                    {language === 'en'
                                        ? (
                                            <DatePicker
                                                className={styles.datePick}
                                                selected={endDate}
                                                onChange={date => setEndDate(date)}
                                                placeholderText={t('End Date')}
                                            />
                                        )
                                        : (
                                            <NepaliDatePicker
                                                className="NepaliDate"
                                                inputClassName={styles.datePick}
                                                // className={styles.datePick}
                                                value={nepaliDate.end}
                                                onChange={value => setNepalidate({ ...nepaliDate, end: value })}
                                                options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.dropdowns}>
                            <PrimaryButton
                                type="button"
                                className={styles.agreeBtn}
                                disabled={!(selectedReportType && selectedLanguage && selectedStartDate && selectedEndDate)}
                                onClick={handleSubmit}

                            >
                                <div style={{ marginRight: '10px' }}>
                                    <ScalableVectorGraphics
                                        src={nepDatDownload}
                                    />
                                </div>
                                {t('GENERATE REPORT')}
                            </PrimaryButton>

                        </div>


                    </div>
                )
            }
        </Translation>

    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            NepDataProfile,
        ),
    ),
);
