/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import Budget from './Sections/Budget';
import BudgetActivity from './Sections/BudgetActivity';
import PreviewPageOne from './Sections/Preview/PageOne';
import PreviewPageTwo from './Sections/Preview/PageTwo';
import General from './Sections/General';
import ProgrammeAndPolicies from './Sections/ProgrammeAndPolicies';
import Contacts from './Sections/Contacts';
import DRRMembers from './Sections/Contacts/DRRMembers';
import Inventory from './Sections/Inventory';
import DamageAndLoss from './Sections/DamageAndLoss';
import CriticalInfra from './Sections/CriticalInfra';
import WardwiseDeath from './Sections/DamageAndLoss/WardwiseDeath';
import Organisation from './Sections/Organisation';
import Relief from './Sections/Relief';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { userSelector, palikaRedirectSelector,
    generalDataSelector, provincesSelector,
    districtsSelector, municipalitiesSelector } from '#selectors';
import Simulation from './Sections/Simulation';
import Preparedness from './Sections/Preparedness';
import NextPrevBtns from './NextPrevBtns';
import Recovery from './Sections/Recovery';
import Annex from './Sections/Preview/Annex';

interface Props {
    keyTab: number;
    showTabs: boolean;
    hideWelcomePage: () => void;
}

interface SyntheticEvent<T> {
    currentTarget: EventTarget & T;
}
const mapStateToProps = (state, props) => ({
    user: userSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    generalData: generalDataSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    // PalikaReportGetRequest: {
    //     url: ({ params }) => `${params.url}`,
    //     query: ({ params, props }) => {
    //         if (params) {
    //             return {
    //                 province: params.province,
    //                 district: params.district,
    //                 municipality: params.municipality,
    //             };
    //         }


    //         return { limit: params.page, offset: params.offset };
    //     },
    //     method: methods.GET,
    //     onMount: false,

    //     onSuccess: ({ response, params }) => {
    //         let citizenReportList: CitizenReport[] = [];
    //         const citizenReportsResponse = response as MultiResponse<CitizenReport>;
    //         citizenReportList = citizenReportsResponse.results;

    //         if (params && params.reportData) {
    //             params.reportData(citizenReportList);
    //         }
    //     },
    // },
    // FiscalYearFetch: {
    //     url: '/nepali-fiscal-year/',
    //     method: methods.GET,
    //     onMount: true,

    //     onSuccess: ({ response, params }) => {
    //         let citizenReportList: CitizenReport[] = [];
    //         const citizenReportsResponse = response as MultiResponse<CitizenReport>;
    //         citizenReportList = citizenReportsResponse.results;
    //         params.fiscalYearList(citizenReportList);
    //     },
    // },
    DisasterProfileGetRequest: {
        url: '/disaster-profile/',
        query: ({ params, props }) => ({
            province: params.province,
            district: params.district,
            municipality: params.municipality,
            // eslint-disable-next-line @typescript-eslint/camelcase
            fiscal_year: params.fiscalYear,

        }),
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.disasterProfile) {
                params.disasterProfile(citizenReportList);
            }
        },
    },

};
const formdata = new FormData();
const ReportModal: React.FC<Props> = (props: Props) => {
    const {
        keyTab,
        showTabs,
        hideWelcomePage,
        tableHeader,
        mayor,
        cao,
        focalPerson,
        updateTab,
        keyTabUrl,
        tabsLength,
        handlePrevClick,
        handleNextClick,
        localMembers,
        palikaRedirect,
        requests: { DisasterProfileGetRequest, FiscalYearFetch },
        generalData,
        user: { profile },
        user,
        provinces,
        districts,
        municipalities,
    } = props;
    const {
        fiscalYear,
    } = generalData;
    const { showForm } = palikaRedirect;
    const [reportTitle, setreportTitle] = useState('');
    const [datefrom, setdatefrom] = useState('');
    const [dateTo, setdateTo] = useState('');
    const [formationDate, setformationDate] = useState('');
    const [memberCount, setmemberCount] = useState('');
    const [reportData, setReportData] = useState([]);
    const [savePDF, setSavePDF] = useState();
    const [disasterProfile, setDisasterProfile] = useState([]);
    const [pending, setPending] = useState(false);
    const [totalFiscalYear, setTotalFiscalYear] = useState([]);
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [fiscalYearTitle, setFYTitle] = useState('');

    const getGeneralData = () => ({
        reportTitle,
        datefrom,
        dateTo,
        mayor,
        cao,
        focalPerson,
        formationDate,
        memberCount,
    });

    let municipalityName = '';


    if (user && user.profile && user.profile.municipality) {
        const {
            profile: {
                municipality,
            },
        } = user;

        municipalityName = municipalities.find(item => item.id === municipality);
    }
    // if (user && user.profile && !user.profile.municipality && user.profile.district) {
    //     const {
    //         profile: {
    //             district,

    //         },
    //     } = user;
    //     loginUserDetails = districts.find(item => item.id === district);
    // }


    const handleWelcomePage = () => hideWelcomePage();

    const handleDisasterProfile = (response) => {
        setDisasterProfile(response);
    };
    // const handleFiscalYearList = (response) => {
    //     setFiscalYearList(response);
    // };
    // DisasterProfileGetRequest.setDefaultParams({
    //     province: profile.province,
    //     district: profile.district,
    //     municipality: profile.municipality,
    //     fiscalYear: generalData.fiscalYear,
    //     disasterProfile: handleDisasterProfile,

    // });
    // FiscalYearFetch.setDefaultParams({
    //     fiscalYearList: handleFiscalYearList,
    // });

    const handlePending = (data) => {
        setPending(data);
    };
    useEffect(() => {
        if (fiscalYearList.length > 0 && fiscalYear) {
            const FY = fiscalYearList.filter(item => item.id === Number(fiscalYear));

            setFYTitle(FY);
        }
    }, [fiscalYear, fiscalYearList]);

    // const handlePreviewBtn = async () => {
    //     const divToDisplay = document.getElementById('reportPreview');

    //     setPending(true);
    //     html2canvas(divToDisplay).then(async (canvas) => {
    //         // const formData = new FormData();
    //         const imgData = canvas.toDataURL('image/png');
    //         const imgWidth = 210;
    //         const pageHeight = 295;
    //         const imgHeight = canvas.height * imgWidth / canvas.width;
    //         let heightLeft = imgHeight;
    //         const doc = new JsPDF('p', 'mm', 'a4', true);
    //         let position = 0; // give some top padding to first page

    //         doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    //         heightLeft -= pageHeight;
    //         let count = 0;
    //         while (heightLeft >= 0) {
    //             count += 1;
    //             if (count >= 2) {
    //                 position = heightLeft - imgHeight; // top padding for other pages
    //                 doc.addPage('a4', 'portrait');
    //                 doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    //                 heightLeft -= pageHeight;
    //             } else {
    //                 position = heightLeft - imgHeight; // top padding for other pages
    //                 doc.addPage('a4', 'portrait');
    //                 doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    //                 heightLeft -= pageHeight;
    //             }
    //         }
    //         const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    //         // const file = new File([blob], 'image.pdf');
    //         // const blob = await doc.output('blob');
    //         // formdata.append('file', blob);
    //         // const base64 = doc.output('datauristring');
    //         // canvas.toBlob((blob) => {

    //         // });
    //         let profileUser = {};
    //         if (user) {
    //             profileUser = user.profile;
    //         }

    //         formdata.append('file', blob, `${municipalityName.title_en}_DRRM Report FY_${fiscalYearTitle[0].titleEn}.pdf`);
    //         formdata.append('title', `${municipalityName.title_en} DRRM Report FY ${fiscalYearTitle[0].titleEn}`);
    //         formdata.append('fiscalYear', generalData.fiscalYear);
    //         formdata.append('drrmCommitteeFormationDate', generalData.formationDate);
    //         formdata.append('drrmCommitteeMembersCount', generalData.committeeMembers);
    //         formdata.append('province', (profileUser.province || ''));
    //         formdata.append('district', (profileUser.district || ''));
    //         formdata.append('municipality', (profileUser.municipality || ''));
    //         // formdata.append('mayorChairperson', generalData.mayor);
    //         // formdata.append('chiefAdministrativeOfficer', generalData.cao);
    //         // formdata.append('drrFocalPerson', generalData.focalPerson);
    //         if (disasterProfile.length) {
    //             axios.put(`http://bipaddev.yilab.org.np/api/v1/disaster-profile/${disasterProfile[0].id}/`, formdata, { headers: {
    //                 'content-type': 'multipart/form-data',
    //             } })
    //                 .then((response) => {    //                     alert('Your palika report has been uploaded sucessfully');
    //                 }).catch((error) => {    //                 });
    //         } else {
    //             axios.post('http://bipaddev.yilab.org.np/api/v1/disaster-profile/', formdata, { headers: {
    //                 'content-type': 'multipart/form-data',
    //             } })
    //                 .then((response) => {    //                     alert('Your palika report has been uploaded sucessfully');
    //                 }).catch((error) => {    //                 });
    //         }    //         doc.save('file.pdf');
    //     });
    // };

    const handlePreviewBtn = async () => {
        const divToDisplay = document.getElementById('reportPreview');
        setPending(true);
        let pageNumber = 1;
        const doc = new JsPDF('p', 'mm', 'a4');
        const ids = document.querySelectorAll('.page');
        const { length } = ids;
        console.log('ids:', ids);
        for (let i = 0; i < length; i += 1) {
            const reportPage = document.getElementById(ids[i].id);

            await html2canvas(reportPage).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                let imgWidth = 210;
                let pageHeight = 295;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                if (i < (length - 1) && i > 2) {
                    imgWidth = 295;
                    pageHeight = 210;
                }

                let heightLeft = imgHeight;
                let position = 0;
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                    if (i < (length - 1) && i < 2) {
                        position = heightLeft - imgHeight; // top padding for other pages
                        pageNumber += 1;
                        doc.text(285, 200, `page ${pageNumber}`);
                        doc.addPage('a4', 'portrait');
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                        heightLeft -= pageHeight;
                    }
                    if (i < (length - 1) && i > 2) {
                        position = heightLeft - imgHeight; // top padding for other pages
                        pageNumber += 1;
                        doc.text(200, 285, `page ${pageNumber}`);
                        doc.addPage('a4', 'landscape');
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                        heightLeft -= pageHeight;
                    }
                }

                if (i < (length - 1) && i < 2) {
                    pageNumber += 1;
                    doc.text(210, 285, `page ${pageNumber}`);
                    doc.addPage('a4', 'portrait');
                }
                if (i < (length - 1) && i > 2) {
                    pageNumber += 1;
                    doc.text(270, 200, `page ${pageNumber}`);
                    doc.addPage('a4', 'landscape');
                }
            });
        }
        // download the pdf with all reportPages
        doc.save(`All_reportPages_${Date.now()}.pdf`);
        // });

        // old code
        // async generateAllPdf() {

        // }

        // html2canvas(divToDisplay).then(async (canvas) => {
        //     // const formData = new FormData();
        //     const imgData = canvas.toDataURL('image/png');
        //     const imgWidth = 210;
        //     const pageHeight = 295;
        //     const imgHeight = canvas.height * imgWidth / canvas.width;
        //     let heightLeft = imgHeight;
        //     const doc = new JsPDF('p', 'mm', '', true);
        //     let position = 0; // give some top padding to first page

        //     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        //     heightLeft -= pageHeight;
        //     let count = 0;
        //     while (heightLeft >= 0) {
        //         count += 1;
        //         if (count >= 2) {
        //             const imgHeightL = canvas.width * imgWidth / canvas.height;
        //             position = heightLeft - imgHeightL; // top padding for other pages
        //             doc.addPage('a4', 'landscape');
        //             doc.addImage(imgData, 'PNG', 0, position, 295, imgHeightL, '', 'FAST');
        //             heightLeft -= 210;
        //         } else {
        //             position = heightLeft - imgHeight; // top padding for other pages
        //             doc.addPage('a4', 'portrait');
        //             doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        //             heightLeft -= pageHeight;
        //         }
        //     }
        //     const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
        //     // const file = new File([blob], 'image.pdf');
        //     // const blob = await doc.output('blob');
        //     // formdata.append('file', blob);
        //     // const base64 = doc.output('datauristring');
        //     // canvas.toBlob((blob) => {

        //     // });
        //     let profileUser = {};
        //     if (user) {
        //         profileUser = user.profile;
        //     }

        //     formdata.append('file', blob, `${municipalityName.title_en}_DRRM Report FY_${fiscalYearTitle[0].titleEn}.pdf`);
        //     formdata.append('title', `${municipalityName.title_en} DRRM Report FY ${fiscalYearTitle[0].titleEn}`);
        //     formdata.append('fiscalYear', generalData.fiscalYear);
        //     formdata.append('drrmCommitteeFormationDate', generalData.formationDate);
        //     formdata.append('drrmCommitteeMembersCount', generalData.committeeMembers);
        //     formdata.append('province', (profileUser.province || ''));
        //     formdata.append('district', (profileUser.district || ''));
        //     formdata.append('municipality', (profileUser.municipality || ''));
        //     // formdata.append('mayorChairperson', generalData.mayor);
        //     // formdata.append('chiefAdministrativeOfficer', generalData.cao);
        //     // formdata.append('drrFocalPerson', generalData.focalPerson);
        //     // if (disasterProfile.length) {
        //     //     axios.put(`${process.env.REACT_APP_API_SERVER_URL}/disaster-profile/${disasterProfile[0].id}/`, formdata, { headers: {
        //     //         'content-type': 'multipart/form-data',
        //     //     } })
        //     //         .then((response) => {
        //     //             doc.save('file.pdf');
        //     //             alert('Your palika report has been uploaded sucessfully');
        //     //         }).catch((error) => { });
        //     // } else {
        //     //     axios.post(`${process.env.REACT_APP_API_SERVER_URL}/disaster-profile/`, formdata, { headers: {
        //     //         'content-type': 'multipart/form-data',
        //     //     } })
        //     //         .then((response) => {
        //     //             doc.save(`${municipalityName.title_en}_DRRM Report FY_${fiscalYearTitle[0].titleEn}.pdf`);
        //     //             alert('Your palika report has been uploaded sucessfully');
        //     //         }).catch((error) => { });
        //     // }
        //     doc.save('DRRM Report.pdf');
        // // });
        // });
    };


    return (
        <>

            {
                (keyTab === 0
                )
                    ? (
                        <General
                            mayor={mayor}
                            cao={cao}
                            focalPerson={focalPerson}
                            updateTab={updateTab}
                            page={-1}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                            localMembers={localMembers}
                            handleShowErr={props.handleShowErr}

                        />
                    )
                    : ''
            }
            {
                (keyTab === 1
                )
                    ? (
                        <Budget
                            reportData={reportData}
                            tableHeader={tableHeader}
                            updateTab={updateTab}
                            page={-1}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}

                        />
                    )
                    : ''
            }
            {
                (keyTab === 2)
                    ? (
                        <BudgetActivity
                            updateTab={updateTab}
                            page={-1}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}

                        />
                    )
                    : ''
            }
            {
                (keyTab === 3
                )
                    ? (
                        <ProgrammeAndPolicies
                            updateTab={updateTab}
                            page={-1}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 4
                )
                    ? (

                        <Organisation
                            url={keyTabUrl}
                            updateTab={updateTab}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 5
                )
                    ? (
                        <Inventory
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                            // page={-1}
                            updateTab={updateTab}
                            width={'100%'}
                            height={'40%'}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 6
                )
                    ? (
                        <CriticalInfra
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                            page={-1}
                            updateTab={updateTab}
                            width={'100%'}
                            height={'50%'}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 7
                )
                    ? (
                        <>
                            <Contacts
                                handlePrevClick={handlePrevClick}
                                handleNextClick={handleNextClick}
                                page={-1}
                                updateTab={updateTab}
                            />
                            {/* <DRRMembers updateTab={updateTab} /> */}
                        </>
                    )
                    : ''
            }
            {
                (keyTab === 8
                )
                    ? (
                        <Relief
                            updateTab={updateTab}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                            page={-1}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 9
                )
                    ? (
                        <>
                            <Simulation
                                handlePrevClick={handlePrevClick}
                                handleNextClick={handleNextClick}
                                page={-1}
                                updateTab={updateTab}
                            />
                        </>
                    )
                    : ''
            }
            {
                keyTab === (tabsLength - 1)
                    ? (
                        <div className={styles.tabsPageContainer}>

                            {
                                pending
                                    && (
                                        <div className={styles.loaderContainer}>
                                            <Loader
                                                type="TailSpin"
                                                color="#00BFFF"
                                                height={50}
                                                width={50}
                                                timeout={7000}
                                            />
                                        </div>
                                    )
                            }
                            <div className={styles.buttonContainer}>
                                <button
                                    type="button"
                                    onClick={handlePreviewBtn}
                                    className={styles.agreeBtn}
                                >
                                Submit and Download Report

                                </button>
                                {/* <NextPrevBtns lastpage /> */}
                            </div>


                            {/* <div id={'reportPreview'} className={styles.reportContainer}> */}
                            <div id={'page1'} className={_cs(styles.page, 'page')}>
                                <PreviewPageOne
                                    generalData={getGeneralData()}
                                    url={keyTabUrl}
                                />
                            </div>
                            <div id={'page2'} className={_cs(styles.page, 'page')}>

                                <PreviewPageTwo
                                    reportData={[<Budget />, <BudgetActivity />]}
                                />

                            </div>
                            <div id={'page3'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex A</h1>
                                <General
                                    annex
                                    mayor={mayor}
                                    cao={cao}
                                    focalPerson={focalPerson}
                                    updateTab={() => {}}
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                    localMembers={localMembers}
                                />

                            </div>
                            <div id={'page5'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex B</h1>

                                <Budget
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>

                            <div id={'page6'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex C</h1>

                                <BudgetActivity
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>

                            <div id={'page7'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex D</h1>
                                <ProgrammeAndPolicies
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>

                            <div id={'page8'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex E</h1>
                                <Organisation
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>
                            <div id={'page9'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex F</h1>
                                <Inventory
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>

                            <div id={'page10'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex G</h1>
                                <CriticalInfra
                                    annex
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                />
                            </div>


                            <div id={'page11'} className={_cs(styles.annexPage, 'page')}>
                                <h1>Annex H</h1>
                                <Relief
                                // AnnexDetails
                                    reportData={''}
                                    tableHeader={() => {}}
                                    updateTab={() => {}}
                                    page={-1}
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                    annex
                                />
                            </div>

                            <div id={'page12'} className={_cs(styles.annexPage, 'page')}>
                                <h1> Annex I </h1>
                                <Simulation
                                    handlePrevClick={() => {}}
                                    handleNextClick={() => {}}
                                    annex
                                />
                            </div>


                            {/* </div> */}


                        </div>
                    ) : ''
            }
        </>
    );
};

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            ReportModal,
        ),
    ),
);
