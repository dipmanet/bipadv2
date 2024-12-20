import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import adToBs from '#utils/AdBSConverter/AdToBs';
import bsToAd from '#utils/AdBSConverter/BsToAd';
// import { adToBs, bsToAd, calculateAge } from '@sbmdkl/nepali-date-converter';
import {
    languageSelector,
} from '#selectors';

const monthsInitial = {
    1: 'बैशाख',
    2: 'जेठ',
    3: 'असार',
    4: 'साउन',
    5: 'भदौ',
    6: 'असोज',
    7: 'कार्तिक',
    8: 'मंसिर',
    9: 'पुष',
    10: 'माघ',
    11: 'फागुन',
    12: 'चैत',
};
const monthsEnInitial = {
    1: 'Baisakh',
    2: 'Jestha',
    3: 'Ashad',
    4: 'Shrawan',
    5: 'Bhadau',
    6: 'Ashwin',
    7: 'Kartik',
    8: 'Mangshir',
    9: 'Poush',
    10: 'Magh',
    11: 'Falgun',
    12: 'Chaitra,',
};

const mapStateToProps = state => ({
    language: languageSelector(state),
});


const NepaliDate = (props) => {
    const { language: { language } } = props;
    const [months, setMonth] = useState(monthsEnInitial);
    useEffect(() => {
        if (language === 'en') {
            setMonth(monthsEnInitial);
        } else {
            setMonth(monthsInitial);
        }
    }, [language]);
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

export default connect(mapStateToProps)(NepaliDate);
