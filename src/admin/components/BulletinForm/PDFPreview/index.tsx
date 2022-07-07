/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import JsPDF from 'jspdf';
import { isList } from '@togglecorp/fujs';
import axios from 'axios';
import BulletinPDFCovid from 'src/admin/components/BulletinPDFCovid';
import BulletinPDFLoss from 'src/admin/components/BulletinPDFLoss';
import BulletinPDFFooter from 'src/admin/components/BulletinPDFFooter';
import BulletinPDFAnnex from 'src/admin/components/BulletinPDFAnnex';
import { navigate } from '@reach/router';
import styles from './styles.scss';
import {
    userSelector,
    bulletinEditDataSelector,
    languageSelector,
    bulletinPageSelector,
} from '#selectors';
import {
    setBulletinEditDataAction,
    setBulletinFeedbackAction,
} from '#actionCreators';

const mapStateToProps = state => ({
    user: userSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
    language: languageSelector(state),
    bulletinData: bulletinPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});

const baseUrl = process.env.REACT_APP_API_SERVER_URL;

const PDFPreview = (props) => {
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [ward, setWard] = useState(null);
    const [pending, setPending] = useState(false);

    const {
        bulletinData: {
            sitRep,
            incidentSummary,
            peopleLoss,
            hazardWiseLoss,
            genderWiseLoss,
            covid24hrsStat,
            covidTotalStat,
            vaccineStat,
            covidProvinceWiseTotal,
            minTempFooter,
            yearlyData,
            tempMin,
            tempMax,
            maxTempFooter,
            feedback,
            pdfFile,
            dailySummary,
            rainSummaryPic,
            hilight,
            rainSummaryFooter,
            bulletinDate,
            addedHazards,
            startDate,
            endDate,
            startTime,
            endTime,
            filterDateType,
        },
        user,
        bulletinEditData,
        setBulletinEditData,
        handlePrevBtn,
        handleFeedbackChange,
        deleteFeedbackChange,
        hazardWiseLossData,
        handleSubFieldChange,
        language: { language },
        setBulletinData,
    } = props;

    const isFile = (input: any): input is File => (
        'File' in window && input instanceof File
    );

    const isBlob = (input: any): input is Blob => (
        'Blob' in window && input instanceof Blob
    );

    const sanitizeFormData = (value: any) => {
        if (value === null) {
            return '';
        }
        if (isFile(value) || isBlob(value) || typeof value === 'string') {
            return value;
        }
        return JSON.stringify(value);
    };

    const getFormData = (jsonData: FormDataType | undefined) => {
        const formDataNew = new FormData();
        if (!jsonData) {
            return formDataNew;
        }

        Object.entries(jsonData).forEach(
            ([key, value]) => {
                if (isList(value)) {
                    value.forEach((val: unknown) => {
                        if (val !== undefined && isBlob(value)) {
                            const sanitizedVal = sanitizeFormData(val);
                            formDataNew.append(key, sanitizedVal, 'Bulletin.pdf');
                        } else if (val !== undefined && !isBlob(value)) {
                            const sanitizedVal = sanitizeFormData(val);
                            formDataNew.append(key, sanitizedVal);
                        }
                    });
                } else if (value !== undefined) {
                    const sanitizedValue = sanitizeFormData(value);
                    if (value !== undefined && isBlob(value)) {
                        formDataNew.append(key, sanitizedValue, `Bipad Bulletin ${bulletinEditData.bulletinDate || ''}.pdf`);
                    } else {
                        formDataNew.append(key, sanitizedValue);
                    }
                }
            },
        );
        return formDataNew;
    };

    const getPostData = (file) => {
        if (language === 'np') {
            return getFormData({
                sitrep: sitRep,
                incidentSummary,
                peopleLoss,
                hazardWiseLoss,
                genderWiseLoss,
                covidTwentyfourHrsStat: covid24hrsStat || {},
                covidTotalStat,
                vaccineStat,
                covidProvinceWiseTotal,
                province,
                district,
                yearlyDataNe: yearlyData,
                municipality,
                ward,
                pdfFile: file,
                temp_min_ne: tempMin,
                temp_min_footer_ne: minTempFooter,
                temp_max_ne: tempMax,
                temp_max_footer_ne: maxTempFooter,
                feedback_ne: feedback,
                pdf_file_ne: pdfFile,
                daily_summary_ne: dailySummary,
                rain_summary_picture_ne: rainSummaryPic,
                highlight_ne: hilight,
                rainSummaryPictureFooterNe: rainSummaryFooter,
                bulletinDate,
                addedHazardsNe: addedHazards,
                fromDateTime: `${startDate}T${startTime || '00:00'}:00+05:45`,
                toDateTime: `${endDate}T${endTime || '23:59'}:59+05:45`,
                filterBy: filterDateType,
            });
        }
        return getFormData({
            sitrep: sitRep,
            incidentSummary,
            peopleLoss,
            hazardWiseLoss,
            genderWiseLoss,
            covidTwentyfourHrsStat: covid24hrsStat || {},
            covidTotalStat,
            vaccineStat,
            covidProvinceWiseTotal,
            minTempFooter,
            province,
            district,
            yearlyData,
            municipality,
            ward,
            tempMin,
            tempMax,
            maxTempFooter,
            feedback,
            pdfFile: file,
            dailySummary,
            rainSummaryPicture: rainSummaryPic,
            hilight,
            rainSummaryPictureFooter: rainSummaryFooter,
            bulletinDate,
            addedHazards,
            fromDateTime: `${startDate}T${startTime || '00:00'}:00+05:45`,
            toDateTime: `${endDate}T${endTime || '23:59'}:59+05:45`,
            filterBy: filterDateType,
        });
    };

    const getPatchData = (file) => {
        if (language === 'np') {
            const picObjects = {};
            if (rainSummaryPic && typeof rainSummaryPic !== 'string') {
                picObjects.rain_summary_picture_ne = rainSummaryPic;
            }
            if (tempMin && typeof tempMin !== 'string') {
                picObjects.temp_min_ne = tempMin;
            }
            if (tempMax && typeof tempMax !== 'string') {
                picObjects.temp_max_ne = tempMax;
            }

            return getFormData({
                sitrep: sitRep,
                incidentSummary,
                peopleLoss,
                hazardWiseLoss,
                genderWiseLoss,
                covidTwentyfourHrsStat: covid24hrsStat || {},
                covidTotalStat,
                vaccineStat,
                covidProvinceWiseTotal,
                province,
                district,
                yearlyData,
                municipality,
                ward,
                pdfFile: file,
                temp_min_footer_ne: minTempFooter,
                temp_max_footer_ne: maxTempFooter,
                feedback_ne: feedback,
                pdf_file_ne: pdfFile,
                daily_summary_ne: dailySummary,
                highlight_ne: hilight,
                rainSummaryPictureFooterNe: rainSummaryFooter,
                bulletinDate,
                addedHazardsNe: addedHazards,
                fromDateTime: `${startDate}T${startTime || '00:00'}:00+05:45`,
                toDateTime: `${endDate}T${endTime || '23:59'}:59+05:45`,
                filterBy: filterDateType,
                ...picObjects,

            });
        }
        const picObjects = {};
        if (rainSummaryPic && typeof rainSummaryPic !== 'string') {
            picObjects.rain_summary_picture = rainSummaryPic;
        }
        if (tempMin && typeof tempMin !== 'string') {
            picObjects.temp_min = tempMin;
        }
        if (tempMax && typeof tempMax !== 'string') {
            picObjects.temp_max = tempMax;
        }
        return getFormData({
            sitrep: sitRep,
            incidentSummary,
            peopleLoss,
            hazardWiseLoss,
            genderWiseLoss,
            covidTwentyfourHrsStat: covid24hrsStat || {},
            covidTotalStat,
            vaccineStat,
            covidProvinceWiseTotal,
            minTempFooter,
            province,
            district,
            yearlyData,
            municipality,
            ward,
            maxTempFooter,
            feedback,
            pdfFile: file,
            dailySummary,
            hilight,
            rainSummaryPictureFooter: rainSummaryFooter,
            bulletinDate,
            addedHazards,
            fromDateTime: `${startDate}T${startTime || '00:00'}:00+05:45`,
            toDateTime: `${endDate}T${endTime || '23:59'}:59+05:45`,
            filterBy: filterDateType,
            ...picObjects,
        });
    };

    const savePDf = (file, doc) => {
        axios
            .post(`${baseUrl}/bipad-bulletin/`, getPostData(file), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                // doc.save('Bulletin.pdf');
                setPending(false);
            })
            .catch((error) => {
                setPending(false);
            });
    };

    const updatePDF = (file, doc, id) => {
        axios
            .patch(`${baseUrl}/bipad-bulletin/${id}/`, getPatchData(file), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                setPending(false);
                setBulletinEditData({});
                navigate('/admin/bulletin/bulletin-data-table');
            })
            .catch((error) => {
                setPending(false);
            });
    };

    useEffect(() => {
        if (user && user.profile) {
            if (user.profile.province) {
                setProvince(user.profile.province);
            }
            if (user.profile.district) {
                setDistrict(user.profile.district);
            }
            if (user.profile.municipality) {
                setMunicipality(user.profile.municipality);
            }
            if (user.profile.ward) {
                setWard(user.profile.ward);
            }
        }
    }, [user]);

    useEffect(() => {
        function addScript(url) {
            const script = document.createElement('script');
            script.type = 'application/javascript';
            script.src = url;
            document.head.appendChild(script);
        }
        addScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }, []);

    const handleDownload = async (reportType: string) => {
        const pageNumber = 0;
        setPending(true);
        const doc = new JsPDF('p', 'mm', 'a4');
        // const doc = new JsPDF('p', 'mm', 'a4');
        const ids = document.querySelectorAll('.page');
        // const { length } = ids;
        const reportContent = document.getElementById('bulletinPDFReport');

        const options = {
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };

        // eslint-disable-next-line no-undef
        const reportPDF = html2pdf().set(options).from(reportContent).outputPdf('blob')
            .then((bulletin: Blob) => {
                axios.get(`${baseUrl}/bipad-bulletin/?sitrep=${sitRep}`).then((res) => {
                    if (res.data.results.length === 0) {
                        savePDf(bulletin, doc);
                    } else {
                        // const { id } = bulletinEditData;
                        const { id } = res.data.results[0];
                        updatePDF(bulletin, doc, id);
                    }
                });
            })
            .save(`Bipad Bulletin ${bulletinEditData.bulletinDate || ''}`);
    };

    return (
        <div className={styles.pdfContainer}>
            <div id="bulletinPDFReport">
                <div id="page1" className="page">

                    <BulletinPDFLoss bulletinDate={bulletinDate} />
                </div>
                <div id="page2" className="page">

                    <BulletinPDFCovid />
                </div>
                <div id="page3" className="page">
                    <BulletinPDFFooter rainSummaryFooter={rainSummaryFooter} />

                </div>
                <div id="page4" className="page">
                    <BulletinPDFAnnex
                        handleFeedbackChange={handleFeedbackChange}
                        feedback={feedback}
                        deleteFeedbackChange={deleteFeedbackChange}
                        hazardWiseLossData={hazardWiseLossData}
                        handleSubFieldChange={handleSubFieldChange}
                    />

                </div>
            </div>
            <div className={styles.btnContainer}>
                <button
                    type="button"
                    onClick={handlePrevBtn}
                    className={styles.prevBtn}
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className={!pending ? styles.downloadBtn : styles.downloadBtnDisabled}
                >
                    {
                        pending
                            ? '...Generating Bulletin'
                            : 'Download Bulletin'
                    }

                </button>
            </div>
        </div>

    );
};


export default connect(mapStateToProps, mapDispatchToProps)(PDFPreview);
