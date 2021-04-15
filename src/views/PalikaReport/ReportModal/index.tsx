import React, { useState } from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BulletIcon from '#resources/icons/Bullet.svg';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import Budget from './Budget';
import BudgetActivity from './BudgetActivity';
import PreviewPageOne from './Preview/PageOne';
import PreviewPageTwo from './Preview/PageTwo';
import General from './General';
import ProgrammeAndPolicies from './ProgrammeAndPolicies';
import Contacts from './Contacts';
import DRRMembers from './Contacts/DRRMembers';
import Inventory from './Inventory';


interface Props {
    keyTab: number;
    showTabs: boolean;
    hideWelcomePage: () => void;
}

interface SyntheticEvent<T> {
    currentTarget: EventTarget & T;
}

const ReportModal: React.FC<Props> = (props: Props) => {
    const {
        keyTab,
        showTabs,
        hideWelcomePage,
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
            doc.save('whater.pdf');
        });
    };

    const [reportTitle, setreportTitle] = useState('');
    const [datefrom, setdatefrom] = useState('');
    const [dateTo, setdateTo] = useState('');
    const [mayor, setmayor] = useState('');
    const [cao, setcao] = useState('');
    const [focalPerson, setfocalPerson] = useState('');
    const [formationDate, setformationDate] = useState('');
    const [memberCount, setmemberCount] = useState('');

    const handleReportTitle = (val: React.ChangeEvent<HTMLInputElement>) => {
        setreportTitle(val.currentTarget.value);
    };
    const handledateFrom = (val: React.ChangeEvent<HTMLInputElement>) => {
        setdatefrom(val.currentTarget.value);
    };
    const handledateTo = (val: React.ChangeEvent<HTMLInputElement>) => {
        setdateTo(val.currentTarget.value);
    };
    const handleSetMayor = (val: React.ChangeEvent<HTMLInputElement>) => {
        setmayor(val.currentTarget.value);
    };
    const handleSetcao = (val: React.ChangeEvent<HTMLInputElement>) => {
        setcao(val.currentTarget.value);
    };
    const handleFocalPerson = (val: React.ChangeEvent<HTMLInputElement>) => {
        setfocalPerson(val.currentTarget.value);
    };
    const handleFormationDate = (val: React.ChangeEvent<HTMLInputElement>) => {
        setformationDate(val.currentTarget.value);
    };
    const handleMemberCount = (val: React.ChangeEvent<HTMLInputElement>) => {
        setmemberCount(val.currentTarget.value);
    };

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
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the
                    visual form of a document or a typeface without
                    relying on meaningful content. Lorem ipsum may be
                    used as a placeholder before final copy is available.
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
                            Track the progress you palika is doing in terms of implementation of DRR
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
                            Know the capacities and resources you have within the municipality.
                        </div>
                    </div>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                             Check how you palika is spending Budget in DRR
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
                            reportTitle={reportTitle}
                            datefrom={datefrom}
                            dateTo={dateTo}
                            mayor={mayor}
                            cao={cao}
                            focalPerson={focalPerson}
                            formationDate={formationDate}
                            memberCount={memberCount}
                            setreportTitle={handleReportTitle}
                            setdatefrom={handledateFrom}
                            setdateTo={handledateTo}
                            setmayor={handleSetMayor}
                            setcao={handleSetcao}
                            setfocalPerson={handleFocalPerson}
                            setformationDate={handleFormationDate}
                            setmemberCount={handleMemberCount}

                        />
                    )
                    : ''
            }
            {
                (keyTab === 1
               && showTabs)
                    ? (
                        <Budget />
                    )
                    : ''
            }
            {
                (keyTab === 2)
                    ? (
                        <BudgetActivity />
                    )
                    : ''
            }
            {
                (keyTab === 3
               && showTabs)
                    ? (
                        <ProgrammeAndPolicies />
                    )
                    : ''
            }
            {
                (keyTab === 5
               && showTabs)
                    ? (
                        <Inventory width={'100%'} height={'50%'} />
                    )
                    : ''
            }
            {
                (keyTab === 7
               && showTabs)
                    ? (
                        <>
                            <Contacts />
                            <DRRMembers />
                        </>
                    )
                    : ''
            }

            {
                keyTab === 11 && showTabs
                    ? (
                        <div className={styles.tabsPageContainer}>
                            <button
                                type="button"
                                onClick={handlePreviewBtn}
                                className={styles.agreeBtn}
                            >
                                Download this page
                            </button>

                            <div id={'reportPreview'}>
                                <PreviewPageOne
                                    generalData={getGeneralData()}

                                />
                                {/* <PreviewPageTwo
                                    reportData={[<Budget />, <BudgetActivity />]}

                                /> */}

                            </div>
                        </div>
                    ) : ''
            }
        </>
    );
};

export default ReportModal;
