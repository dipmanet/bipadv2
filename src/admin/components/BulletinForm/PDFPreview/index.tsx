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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
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
                            if (key === 'pdfFileNeSummary' || key === 'pdfFileSummary') {
                                formDataNew.append(key, sanitizedVal, `Bulletin_${endDate}.zip`);
                            } else {
                                formDataNew.append(key, sanitizedVal, `Bulletin_${endDate}.pdf`);
                            }
                        } else if (val !== undefined && !isBlob(value)) {
                            const sanitizedVal = sanitizeFormData(val);
                            formDataNew.append(key, sanitizedVal);
                        }
                    });
                } else if (value !== undefined) {
                    const sanitizedValue = sanitizeFormData(value);
                    if (value !== undefined && isBlob(value)) {
                        if (key === 'pdfFileNeSummary' || key === 'pdfFileSummary') {
                            formDataNew.append(key, sanitizedValue, `Bulletin_${endDate || ''}.zip`);
                        } else {
                            formDataNew.append(key, sanitizedValue, `Bulletin_${endDate || ''}.pdf`);
                        }
                    } else {
                        formDataNew.append(key, sanitizedValue);
                    }
                }
            },
        );
        return formDataNew;
    };

    const getPostData = (zipContent, file) => {
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
                pdfFileNe: file,
                pdfFileNeSummary: zipContent,
                temp_min_ne: tempMin,
                temp_min_footer_ne: minTempFooter,
                temp_max_ne: tempMax,
                temp_max_footer_ne: maxTempFooter,
                feedback_ne: feedback,
                // pdf_file_ne: pdfFile,
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
            pdfFileSummary: zipContent,
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

    const getPatchData = (zipContent, file) => {
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
                pdfFileNe: file,
                pdfFileNeSummary: zipContent,
                temp_min_footer_ne: minTempFooter,
                temp_max_footer_ne: maxTempFooter,
                feedback_ne: feedback,
                // pdf_file_ne: pdfFile,
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
            pdfFileSummary: zipContent,
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

    const savePDf = (zipContent, file) => {
        axios
            .post(`${baseUrl}/bipad-bulletin/`, getPostData(zipContent, file), {
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

    const updatePDF = (zipContent, file, id) => {
        axios
            .patch(`${baseUrl}/bipad-bulletin/${id}/`, getPatchData(zipContent, file), {
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
        const reportContentPage1 = document.getElementById('page1');
        const reportContentPage2 = document.getElementById('page2');
        const reportContentPage3 = document.getElementById('page3');
        const reportContent = document.getElementById('bulletinPDFReport');


        const options = {
            pagebreak: { avoid: 'tr', mode: ['css', 'legacy'] },
            // margin: [10, 0, 10, 0],
            html2canvas: { scale: 2 },
        };
        let image1 = '';
        let image2 = '';
        let image3 = '';
        // eslint-disable-next-line no-undef
        await html2pdf().set(options).from(reportContentPage1).outputImg('dataurl')
            .then((bulletin: string) => {
                const imageBase64 = bulletin.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
                image1 = imageBase64;
            });
        // eslint-disable-next-line no-undef
        await html2pdf().set(options).from(reportContentPage2).outputImg('dataurl')
            .then((bulletin: string) => {
                const imageBase64 = bulletin.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
                image2 = imageBase64;
            });
        // eslint-disable-next-line no-undef
        await html2pdf().set(options).from(reportContentPage3).outputImg('dataurl')
            .then((bulletin: string) => {
                const imageBase64 = bulletin.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
                image3 = imageBase64;
            });
        const zip = new JSZip();
        const img = zip.folder('bulletin_pages');
        img.file('page1.jpg', image1, { base64: true });
        img.file('page2.jpg', image2, { base64: true });
        img.file('page3.jpg', image3, { base64: true });

        // eslint-disable-next-line no-undef
        const reportPDF = html2pdf().set(options).from(reportContent).outputPdf('blob')
            .then((bulletin: Blob) => {
                zip.generateAsync({ type: 'blob' })
                    .then((zipContent) => {
                        axios.get(`${baseUrl}/bipad-bulletin/?sitrep=${sitRep}`).then((res) => {
                            if (res.data.results.length === 0) {
                                savePDf(zipContent, bulletin);
                            } else {
                                // const { id } = bulletinEditData;
                                const { id } = res.data.results[0];
                                updatePDF(zipContent, bulletin, id);
                            }
                        });
                        saveAs(zipContent, `bulletin_${endDate}.zip`);
                    });
            })
            .save(`Bipad Bulletin ${bulletinEditData.endDate} || ''}`);
    };

    return (
        <div className={styles.pdfContainer}>
            <div id="bulletinPDFReport">
                <div id="page1" className="page">

                    <BulletinPDFLoss
                        startDate={startDate}
                        endDate={endDate}
                        startTime={startTime}
                        endTime={endTime}
                        bulletinDate={bulletinDate}
                        filterDateType={filterDateType}
                    />
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
