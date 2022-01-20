import React from 'react';
import { adToBs, bsToAd, calculateAge } from '@sbmdkl/nepali-date-converter';

const months = {
    1: 'बैशाख',
    2: 'जेठ',
    3: 'असार',
    4: 'श्रावण',
    5: 'भदौ',
    6: 'आश्विन',
    7: 'कार्तिक',
    8: 'मंसिर',
    9: 'पुष',
    10: 'माघ',
    11: 'फाल्गुन',
    12: 'चैत्,',
};


const NepaliDate = () => {
    const a = new Date();
    const b = a.toLocaleString();
    const ourDate = b.split(',')[0].split('/');
    const dateString = `${ourDate[2]}-${ourDate[0]}-${ourDate[1]}`;
    const bsDate = adToBs(dateString);
    const day = bsDate.split('-')[2];
    const year = bsDate.split('-')[0];
    const month = months[Number(bsDate.split('-')[1])];
    return (
        <span>
            {`${day} ${month} ${year}`}
        </span>
    );
};

export default NepaliDate;
