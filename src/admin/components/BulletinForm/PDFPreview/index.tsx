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
import Loader from 'react-loader';
import { navigate } from '@reach/router';
import styles from './styles.scss';
import {
    userSelector,
    bulletinEditDataSelector,
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
            console.log('response', response);
            params.doc.save('Bulletin.pdf');
        },
    },
};

const PDFPreview = (props) => {
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [municipality, setMunicipality] = useState(null);
    const [ward, setWard] = useState(null);
    const [pending, setPending] = useState(false);

    const {
        bulletinData,
        user,
        requests: { bulletinPostRequest },
        bulletinEditData,
        setBulletinEditData,
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
                        if (val !== undefined) {
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
    const savePDf = (pdfFile, doc) => {
        axios
            .post(`${baseUrl}/bipad-bulletin/`, getFormData({
                ...bulletinData,
                province,
                district,
                municipality,
                ward,
                pdfFile,
            }), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                doc.save('Bulletin.pdf');
                setPending(false);
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
    const updatePDF = (pdfFile, doc) => {
        axios
            .patch(`${baseUrl}/bipad-bulletin/${bulletinEditData.id}/`, getFormData({
                ...bulletinData,
                province,
                district,
                municipality,
                ward,
                pdfFile,
            }), {
                headers: {
                    Accept: 'application/json',
                },
            }).then((res) => {
                doc.save('Bulletin.pdf');
                setPending(false);
                setBulletinEditData({});
                navigate('/admin/bulletin/bulletin-table');
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

    const handleDownload = async (reportType: string) => {
        let pageNumber = 0;
        setPending(true);
        const doc = new JsPDF('p', 'mm', 'a4');
        // const docSummary = new JsPDF('p', 'mm', 'a4');


        const ids = document.querySelectorAll('.page');
        const { length } = ids;
        for (let i = 0; i < length; i += 1) {
            const reportPage = document.getElementById(ids[i].id);
            await html2canvas(reportPage).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 295;

                const imgHeight = canvas.height * imgWidth / canvas.width;
                const heightLeft = imgHeight;
                const position = 0;
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');

                if (i <= 2) {
                    // doc.text(270, 10, `page ${pageNumber}`);
                    doc.addPage('a4', 'portrait');
                    pageNumber += 1;
                }
            });
        }

        const bulletin = new Blob([doc.output('blob')], { type: 'application/pdf' });
        if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
            updatePDF(bulletin, doc);
        } else {
            savePDf(bulletin, doc);
        }
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
                <BulletinPDFAnnex />

            </div>
            <div className={styles.btnContainer}>
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
