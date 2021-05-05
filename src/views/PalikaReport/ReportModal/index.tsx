import React, { useEffect, useState } from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { connect } from 'react-redux';
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
import { userSelector, palikaRedirectSelector, generalDataSelector } from '#selectors';
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
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    PalikaReportGetRequest: {
        url: ({ params }) => `${params.url}`,
        query: ({ params, props }) => {
            if (params) {
                return {
                    province: params.province,
                    district: params.district,
                    municipality: params.municipality,

                };
            }


            return { limit: params.page, offset: params.offset };
        },
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.reportData) {
                params.reportData(citizenReportList);
            }
        },
    },
    FiscalYearFetch: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: false,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
            params.fiscalYear(citizenReportList);
        },
    },

    PreviewDataPost: {
        url: '/disaster-profile/',
        method: methods.POST,
        body: ({ params }) => params && params.body,

        onSuccess: ({ response, props, params }) => {
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
            }
        },
        onFatal: ({ params }) => {
        },
        extras: {
            hasFile: true,

        },


    },

};
const formdata = new FormData();
const config = {};
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
        requests: { PreviewDataPost },
        generalData,
        user,
    } = props;
    const [reportTitle, setreportTitle] = useState('');
    const [datefrom, setdatefrom] = useState('');
    const [dateTo, setdateTo] = useState('');
    const [formationDate, setformationDate] = useState('');
    const [memberCount, setmemberCount] = useState('');
    const [reportData, setReportData] = useState([]);
    const [savePDF, setSavePDF] = useState();
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
    const handleWelcomePage = () => hideWelcomePage();

    const handlePreviewBtn = async () => {
        const divToDisplay = document.getElementById('reportPreview');
        html2canvas(divToDisplay).then(async (canvas) => {
            // const formData = new FormData();
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const doc = new JsPDF('p', 'mm', 'a4', true);
            let position = 0; // give some top padding to first page

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight; // top padding for other pages
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                heightLeft -= pageHeight;
            }
            const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
            // const file = new File([blob], 'image.pdf');
            // const blob = await doc.output('blob');
            // formdata.append('file', blob);
            // const base64 = doc.output('datauristring');
            // canvas.toBlob((blob) => {

            // });
            let profileUser = {};
            if (user) {
                profileUser = user.profile;
            }

            formdata.append('file', blob, 'report.pdf');
            formdata.append('title', 'This is title');
            formdata.append('fiscalYear', generalData.fiscalYear);
            formdata.append('drrmCommitteeFormationDate', generalData.formationDate);
            formdata.append('drrmCommitteeMembersCount', generalData.committeeMembers);
            formdata.append('province', (profileUser.province || ''));
            formdata.append('district', (profileUser.district || ''));
            formdata.append('municipality', (profileUser.municipality || ''));
            formdata.append('mayorChairperson', generalData.mayor);
            formdata.append('chiefAdministrativeOfficer', generalData.cao);
            formdata.append('drrFocalPerson', generalData.focalPerson);

            axios.post('http://bipaddev.yilab.org.np/api/v1/disaster-profile/', formdata, { headers: {
                'content-type': 'multipart/form-data',
            } })
                .then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error);
                });

            doc.save('file.pdf');
        });
    };
    // useEffect(() => {
    //     formdata.append('title', 'title');


    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    const { showForm } = palikaRedirect;
    console.log('local members:', localMembers);

    useEffect(() => {
        console.log('local members:', localMembers);
    }, [localMembers]);
    return (
        <>
            {/* {!showTabs && !showForm
                    && (
                        <div className={styles.firstPageContainer}>
                            <div className={styles.title}>
                                GET STARTED
                            </div>
                            <div className={styles.description}>
                                This module will generate disaster risk reduction and
                                management report for your Municipality.
                            </div>

                            <div className={styles.subtitle}>
                                What you can do with palika report.
                            </div>
                            <div className={styles.bulletPtRow}>
                                <div className={styles.bulletsContainer}>
                                    <ScalableVectorGraphics
                                        className={styles.bulletPoint}
                                        src={BulletIcon}
                                        alt="Bullet Point"
                                    />
                                    <div className={styles.bulletText}>
                                        Know where your palika is in terms of DRR
                                    </div>
                                </div>
                                <div className={styles.bulletsContainer}>
                                    <ScalableVectorGraphics
                                        className={styles.bulletPoint}
                                        src={BulletIcon}
                                        alt="Bullet Point"
                                    />
                                    <div className={styles.bulletText}>
                                        Track the progress your palika
                                        is doing in terms of implementation of DRR
                                    </div>
                                </div>
                            </div>
                            <div className={styles.bulletPtRow}>
                                <div className={styles.bulletsContainer}>
                                    <ScalableVectorGraphics
                                        className={styles.bulletPoint}
                                        src={BulletIcon}
                                        alt="Bullet Point"
                                    />
                                    <div className={styles.bulletText}>
                                        Know the capacities and resources
                                        you have within the municipality.
                                    </div>
                                </div>
                                <div className={styles.bulletsContainer}>
                                    <ScalableVectorGraphics
                                        className={styles.bulletPoint}
                                        src={BulletIcon}
                                        alt="Bullet Point"
                                    />
                                    <div className={styles.bulletText}>
                                        Check how your palika is spending Budget in DRR
                                    </div>
                                </div>
                            </div>
                            <div className={styles.btnContainer}>
                                <PrimaryButton
                                    type="button"
                                    className={styles.agreeBtn}
                                    onClick={handleWelcomePage}
                                >
                                    PROCEED
                                </PrimaryButton>
                            </div>

                        </div>
                    )

            } */}
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


                            <div id={'reportPreview'} className={styles.reportContainer}>
                                <div className={styles.page}>
                                    <PreviewPageOne
                                        generalData={getGeneralData()}
                                        url={keyTabUrl}
                                    />
                                </div>
                                <div className={styles.page}>

                                    <PreviewPageTwo
                                        reportData={[<Budget />, <BudgetActivity />]}

                                    />
                                </div>
                                <div className={styles.page}>

                                    <Annex
                                        localMembers={localMembers}

                                    />
                                </div>

                            </div>
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
