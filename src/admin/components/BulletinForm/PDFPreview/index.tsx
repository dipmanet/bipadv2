import React from 'react';
import BulletinPDFCovid from 'src/admin/components/BulletinPDFCovid';
import BulletinPDFLoss from 'src/admin/components/BulletinPDFLoss';
import BulletinPDFFooter from 'src/admin/components/BulletinPDFFooter';

const PDFPreview = () => (
    <>
        <BulletinPDFCovid />
        <BulletinPDFLoss />
        <BulletinPDFFooter />
    </>

);

export default PDFPreview;
