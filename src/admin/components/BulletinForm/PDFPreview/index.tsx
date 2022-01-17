/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import React from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import BulletinPDFCovid from 'src/admin/components/BulletinPDFCovid';
import BulletinPDFLoss from 'src/admin/components/BulletinPDFLoss';
import BulletinPDFFooter from 'src/admin/components/BulletinPDFFooter';
import styles from './styles.scss';


const PDFPreview = () => {
    const handleDownload = async (reportType: string) => {
        let pageNumber = 1;
        const doc = new JsPDF('p', 'mm', 'a4');
        // const docSummary = new JsPDF('p', 'mm', 'a4');


        const ids = document.querySelectorAll('.page');
        console.log('ids', ids);
        const { length } = ids;
        console.log('length', length);
        for (let i = 0; i < length; i += 1) {
            const reportPage = document.getElementById(ids[i].id);
            console.log('reportpage, i', reportPage, i);
            // setPending(true);
            // setProgress((i + 1) * 100 / (length + 1));
            await html2canvas(reportPage).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                let imgWidth = 210;
                let pageHeight = 295;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                if (i > 3) {
                    imgWidth = 295;
                    pageHeight = 210;
                }
                let heightLeft = imgHeight;
                let position = 0;
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');

                if (i > 3) {
                    heightLeft -= pageHeight;
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight; // top padding for other pages
                        pageNumber += 1;
                        doc.addPage('a4', 'landscape');
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                        // doc.text(200, 285, `page ${pageNumber}`);
                        heightLeft -= pageHeight;
                    }
                }

                if (i <= 1) {
                    // doc.text(270, 10, `page ${pageNumber}`);
                    doc.addPage('a4', 'portrait');
                    pageNumber += 1;
                } else {
                    // doc.text(270, 10, `page ${pageNumber}`);
                    doc.addPage('a4', 'landscape');
                    pageNumber += 1;
                }
                // if (i < (length - 1) && i >= 3) {
                //     // doc.text(270, 10, `page ${pageNumber}`);
                //     doc.addPage('a4', 'landscape');
                //     pageNumber += 1;
                // }
            });
        }

        doc.save('Bulletin.pdf');
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
            <div className={styles.btnContainer}>
                <button
                    type="button"
                    onClick={handleDownload}
                >
                    Download Bulletin
                </button>
            </div>
        </div>
    );
};

export default PDFPreview;
