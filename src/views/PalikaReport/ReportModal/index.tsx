import React, { useEffect, useState } from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { connect } from 'react-redux';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BulletIcon from '#resources/icons/Bullet.svg';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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
import { userSelector } from '#selectors';
import Simulation from './Sections/Simulation';
import Preparedness from './Sections/Preparedness';
import NextPrevBtns from './NextPrevBtns';
import Recovery from './Sections/Recovery';

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
                    limit: -1,
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

};


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
    } = props;

    const handleWelcomePage = () => hideWelcomePage();
    const handlePreviewBtn = () => {
        const divToDisplay = document.getElementById('reportPreview');
        html2canvas(divToDisplay).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            /*
            Here are the numbers (paper width and height) that I found to work.
            It still creates a little overlap part between the pages, but good enough for me.
            if you can find an official number from jsPDF, use them.
            */
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const doc = new JsPDF('p', 'mm');
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('palika-report.pdf');
        });
    };

    const [reportTitle, setreportTitle] = useState('');
    const [datefrom, setdatefrom] = useState('');
    const [dateTo, setdateTo] = useState('');
    const [formationDate, setformationDate] = useState('');
    const [memberCount, setmemberCount] = useState('');
    const [reportData, setReportData] = useState([]);

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

    return (
        <>
            {!showTabs
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

            }
            {
                (keyTab === 0
               && showTabs)
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
               && showTabs)
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
               && showTabs)
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
               && showTabs)
                    ? (

                        <Organisation
                            url={keyTabUrl}
                            page={-1}
                            updateTab={updateTab}
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 5
               && showTabs)
                    ? (
                        <Inventory
                            handlePrevClick={handlePrevClick}
                            handleNextClick={handleNextClick}
                            page={-1}
                            updateTab={updateTab}
                            width={'100%'}
                            height={'40%'}
                        />
                    )
                    : ''
            }
            {
                (keyTab === 6
               && showTabs)
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
               && showTabs)
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
               && showTabs)
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
               && showTabs)
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
,
            {
                keyTab === (tabsLength - 1) && showTabs
                    ? (
                        <div className={styles.tabsPageContainer}>
                            <div className={styles.buttonContainer}>
                                <button
                                    type="button"
                                    onClick={handlePreviewBtn}
                                    className={styles.agreeBtn}
                                >
                                Download this page
                                </button>
                                {/* <NextPrevBtns lastpage /> */}
                            </div>


                            <div id={'reportPreview'}>
                                <PreviewPageOne
                                    generalData={getGeneralData()}
                                    url={keyTabUrl}

                                />
                                <PreviewPageTwo
                                    reportData={[<Budget />, <BudgetActivity />]}

                                />

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
