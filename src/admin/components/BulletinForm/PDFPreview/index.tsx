/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { isList } from '@togglecorp/fujs';
import axios from 'axios';
import BulletinPDFCovid from 'src/admin/components/BulletinPDFCovid';
import BulletinPDFLoss from 'src/admin/components/BulletinPDFLoss';
import BulletinPDFFooter from 'src/admin/components/BulletinPDFFooter';
import BulletinPDFAnnex from 'src/admin/components/BulletinPDFAnnex';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from 'react-loader';
import { navigate } from '@reach/router';
import styles from './styles.scss';
import {
    userSelector,
    bulletinEditDataSelector,
    languageSelector,
} from '#selectors';
import {
    setBulletinEditDataAction,
} from '#actionCreators';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import Document from '#views/Profile/Document';

const mapStateToProps = state => ({
    user: userSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
    language: languageSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});

const baseUrl = process.env.REACT_APP_API_SERVER_URL;

// const requestQuery = ({
//     params = {},
// }) => ({
//     incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
//     incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
//     ordering: '-incident_on',
//     // lnd: true,
// });

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    bulletinPostRequest: {
        url: '/bipad-bulletin/',
        method: methods.POST,
        // query: requestQuery,
        onMount: false,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, params }) => {
            params.doc.save('Bulletin.pdf');
        },
    },
    getSitRep: {
        url: '/bipad-bulletin/',
        method: methods.GET,
        // query: requestQuery,
        onMount: true,
        onSuccess: ({ response, params }) => {
            if (response && response.results.length > 0) {
                params.setSitRepArr(response.results.map(j => j.sitrep));
                params.setAllBulletinData(response.results);
            }
        },
    },
};

const PDFPreview = (props) => {
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [ward, setWard] = useState(null);
    const [sitRepArr, setSitRepArr] = useState([]);
    const [allBulletinData, setAllBulletinData] = useState([]);
    const [pending, setPending] = useState(false);

    const {
        bulletinData: {
            sitrep,
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
            // feedback,
            pdfFile,
            dailySummary,
            rainSummaryPic,
            hilight,
            rainSummaryFooter,
            bulletinDate,
        },
        user,
        requests: { bulletinPostRequest, getSitRep },
        bulletinEditData,
        setBulletinEditData,
        handlePrevBtn,
        handleFeedbackChange,
        feedback,
        deleteFeedbackChange,
        hazardWiseLossData,
        handleSubFieldChange,
        language,
    } = props;

    getSitRep.setDefaultParams({
        setSitRepArr,
        setAllBulletinData,
    });


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
                    formDataNew.append(key, sanitizedValue);
                }
            },
        );
        return formDataNew;
    };

    const getPostData = (file) => {
        if (language === 'np') {
            return getFormData({
                sitrep,
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
            });
        }
        return getFormData({
            sitrep,
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
            rainSummaryPic,
            hilight,
            rainSummaryPictureFooter: rainSummaryFooter,
            bulletinDate,
        });
    };

    const getPatchData = (file) => {
        if (language === 'np') {
            return getFormData({
                sitrep,
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

            });
        }
        return getFormData({
            sitrep,
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
            rainSummaryPic,
            hilight,
            rainSummaryPictureFooter: rainSummaryFooter,
            bulletinDate,
        });
    };

    const savePDf = (file, doc) => {
        axios
            .post(`${baseUrl}/bipad-bulletin/`, getPostData(file), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                doc.save('Bulletin.pdf');
                setPending(false);
                // navigate('/admin/bulletin/bulletin-data-table');
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
                doc.save('Bulletin.pdf');
                setPending(false);
                setBulletinEditData({});
                navigate('/admin/bulletin/bulletin-data-table');
            })
            .catch((error) => {
                setPending(false);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
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
    const getIdFromSitrep = (sR) => {
        const filtered = allBulletinData.filter(j => j.sitrep === sR);
        if (filtered.length > 0) {
            return filtered[0].id;
        }
        return 0;
    };

    const handleDownload = async (reportType: string) => {
        let pageNumber = 0;
        setPending(true);
        const doc = new JsPDF('p', 'mm', 'a4');
        // const doc = new JsPDF('p', 'mm', 'a4');


        const ids = document.querySelectorAll('.page');
        const { length } = ids;
        for (let i = 0; i < length; i += 1) {
            const reportPage = document.getElementById(ids[i].id);
            await html2canvas(reportPage).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                // if (i < (length - 1) && i > 2) {
                //     imgWidth = 295;
                //     pageHeight = 210;
                // }
                let heightLeft = imgHeight;
                let position = 0;
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                if (i < 3) {
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                    // if (i < 1) {
                    //     doc.addPage('a4', 'portrait');
                    // }
                }
                if (i >= 3) {
                    heightLeft -= pageHeight;
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight; // top padding for other pages
                        pageNumber += 1;
                        doc.addPage('a4', 'portrait');
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                        // doc.text(200, 285, `page ${pageNumber}`);
                        heightLeft -= pageHeight;
                    }
                }

                if (i < (length - 1) && i < 1) {
                    // doc.text(270, 10, `page ${pageNumber}`);
                    doc.addPage('a4', 'portrait');
                    pageNumber += 1;
                }
                if (i < (length - 1) && i >= 1) {
                    // doc.text(270, 10, `page ${pageNumber}`);
                    doc.addPage('a4', 'portrait');
                    pageNumber += 1;
                }

                // const imgData = canvas.toDataURL('image/png');
                // const imgWidth = 210;
                // const pageHeight = 295;

                // const imgHeight = canvas.height * imgWidth / canvas.width;
                // const heightLeft = imgHeight;
                // const position = 0;
                // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');

                // if (i <= 2) {
                //     // doc.text(270, 10, `page ${pageNumber}`);
                //     doc.addPage('a4', 'portrait');
                //     pageNumber += 1;
                // }
            });
        }

        const bulletin = new Blob([doc.output('blob')], { type: 'application/pdf' });

        if (sitrep) {
            // if the sitrep is in DB
            if (sitRepArr.includes(sitrep)) {
                // do patch
                const id = getIdFromSitrep(sitrep);
                updatePDF(bulletin, doc, id);
            } else {
                // do post
                savePDf(bulletin, doc);
            }
        }
        // if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
        //     updatePDF(bulletin, doc);
        // } else {
        //     savePDf(bulletin, doc);
        // }
    };

    return (
        <div className={styles.pdfContainer}>
            <div id="page1" className="page">

                <BulletinPDFLoss />
            </div>
            <div id="page2" className="page">

                <BulletinPDFCovid />
            </div>
            <div id="page3" className="page">
                <BulletinPDFFooter />

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


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            PDFPreview,
        ),
    ),
);
