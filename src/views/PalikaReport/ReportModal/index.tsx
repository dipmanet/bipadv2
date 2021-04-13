import React, { useState } from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Table } from 'react-bootstrap';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BulletIcon from '#resources/icons/Bullet.svg';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import Budget from './Budget';
import BudgetActivity from './BudgetActivity';
import Preview from './Preview';
import PreviewPage from './PreviewPage';


interface Props {
    keyTab: number;
    showTabs: boolean;
    hideWelcomePage: () => void;
}

const ReportModal: React.FC<Props> = (props: Props) => {
    const {
        keyTab,
        showTabs,
        hideWelcomePage,
    } = props;
    const handleWelcomePage = () => hideWelcomePage();
    const handlePreviewBtn = () => {
        // eslint-disable-next-line no-var
        // var pdf = new JsPDF();

        const divToDisplay = document.getElementById('reportPreview');
        // const divToDisplay1 = document.getElementById('reportPreview1');
        html2canvas(divToDisplay).then((canvas) => {
            // const divImage = canvas.toDataURL('image/png');

            // pdf.addImage(divImage, 'PNG', 5, 5);
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
        // pdf.addPage();
        // html2canvas(divToDisplay1).then((canvas) => {
        //     const divImage1 = canvas.toDataURL('image/png');

        //     pdf.addImage(divImage1, 'PNG', 5, 5);
        // });

        // pdf.save('preview.pdf');
    };

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
                (keyTab === 1
               && showTabs)
                    ? (
                        <Budget />
                    )
                    : ''
            }
            {
                (keyTab > 1 && keyTab <= 10
               && showTabs)
                    ? (
                        <BudgetActivity />
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
                                <Preview
                                    reportData={[<Budget />, <BudgetActivity />]}

                                />
                                <PreviewPage
                                    reportData={[<Budget />, <BudgetActivity />]}

                                />

                            </div>
                        </div>
                    ) : ''
            }
        </>
    );
};

export default ReportModal;
