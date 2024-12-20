/* eslint-disable max-len */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line import/no-unresolved
import { _cs } from '@togglecorp/fujs';
import React, { forwardRef, useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import axios from 'axios';
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
import styles from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromState => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),


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
        requests: { nepDatGetRequest } } = props;
    const [selectedReportType, setSelectedReportType] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const reportType = [

        { value: '1', id: 'national', label: 'National' },
        { value: '2', id: 'province', label: 'Province' },
        { value: '3', id: 'district', label: 'District' },
        { value: '4', id: 'municipality', label: 'Municipality' },
    ];
    const language = [
        { value: 'en', label: 'English' },
        { value: 'ne', label: 'Nepali' },

    ];
    const province = provinces.map(data => ({ ...data, label: data.title_en, value: data.id }));
    const district = selectedProvince && districts
        .filter(data => data.province === selectedProvince.id)
        .map(dist => ({ ...dist, label: dist.title_en, value: dist.id }));
    const municipality = selectedDistrict && municipalities
        .filter(data => data.district === selectedDistrict.id)
        .map(mun => ({ ...mun, label: mun.title_en, value: mun.id }));

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
    }, [startDate]);
    useEffect(() => {
        if (endDate) {
            const date = new Date(endDate);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            setSelectedEndDate(formattedDate);
        }
    }, [endDate]);


    return (
        <div className={_cs(className, styles.documents)}>

            <CommonMap sourceKey="profile-document-nepdat" />
            <div className={styles.header}>
                <h2>About</h2>

            </div>
            <div className={styles.content}>
                <p>
                    The Nep Dat Profile generates disaster reports at national,
                    provincial district, and municipal levels for the selected
                    time frame. The report is generated in both English and Nepali
                    versions. Using the data available in the BIPAD portal and DRR
                    portal, the analysis is done to present data in terms of the
                    number of disaster incidents, people deaths due to disaster
                    incidents, estimated economic loss, hazard calendar, seasonal
                    hazards, and most recurrent disasters.

                </p>
            </div>
            <div className={styles.dropdownHeaders}>
                <h2>Provide following details to generate profile</h2>
            </div>
            <div className={styles.dropdowns}>
                <h3>Report Type:</h3>
                <Select
                    value={selectedReportType}
                    onChange={handleChangeReportType}
                    options={reportType}
                    placeholder={'Select Report Type'}
                />

            </div>
            <div className={styles.dropdowns}>
                <h3>Language:</h3>
                <Select
                    value={selectedLanguage}
                    onChange={handleChangeLanguage}
                    options={language}
                    isSearchable={false}
                    placeholder={'Select Language'}
                    isDisabled={!selectedReportType}
                />
            </div>
            {selectedReportType && selectedReportType.value === '4'
                ? (
                    <>
                        <div className={styles.dropdowns}>
                            <h3>Province:</h3>
                            <Select
                                value={selectedProvince}
                                onChange={handleSelectProvince}
                                options={province}
                                placeholder={'Select Province'}
                                isDisabled={!selectedLanguage}

                            />
                        </div>
                        <div className={styles.dropdowns}>
                            <h3>District:</h3>
                            <Select
                                value={selectedDistrict}
                                onChange={handleSelectDistrict}
                                options={district}
                                placeholder={'Select District'}
                                isDisabled={!selectedProvince}
                            />
                        </div>
                        <div className={styles.dropdowns}>
                            <h3>Municipality:</h3>
                            <Select
                                value={selectedMunicipality}
                                onChange={handleSelectedMunicipality}
                                options={municipality}
                                placeholder={'Select Municipality'}
                                isDisabled={!selectedDistrict}
                            />
                        </div>
                    </>
                )
                : selectedReportType && selectedReportType.value === '3'
                    ? (
                        <>
                            <div className={styles.dropdowns}>
                                <h3>Province:</h3>
                                <Select
                                    value={selectedProvince}
                                    onChange={handleSelectProvince}
                                    options={province}
                                    placeholder={'Select Province'}
                                    isDisabled={!selectedLanguage}
                                />
                            </div>
                            <div className={styles.dropdowns}>
                                <h3>District:</h3>
                                <Select
                                    value={selectedDistrict}
                                    onChange={handleSelectDistrict}
                                    options={district}
                                    placeholder={'Select District'}
                                    isDisabled={!selectedProvince}
                                />
                            </div>
                        </>
                    ) : selectedReportType && selectedReportType.value === '2'
                        ? (
                            <>
                                <div className={styles.dropdowns}>
                                    <h3>Province:</h3>
                                    <Select
                                        value={selectedProvince}
                                        onChange={handleSelectProvince}
                                        options={province}
                                        placeholder={'Select Province'}
                                        isDisabled={!selectedLanguage}
                                    />
                                </div>
                            </>
                        ) : ''}

            <div className={styles.dropdownDatePick}>
                <h3>Select Date:</h3>
                <div className={styles.dateSelect}>
                    <div>
                        <DatePicker
                            className={styles.datePick}
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            placeholderText="Start Date"


                        />
                    </div>
                    <h4>to</h4>
                    <div>
                        <DatePicker
                            className={styles.datePick}
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            placeholderText="End Date"
                        />
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
                    GENERATE REPORT
                </PrimaryButton>

            </div>


        </div>
    );
};


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            NepDataProfile,
        ),
    ),
);
