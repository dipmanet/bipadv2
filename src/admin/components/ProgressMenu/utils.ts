/* eslint-disable @typescript-eslint/camelcase */
import CovidLogo from '../../resources/COVID-19.svg';
import LossesLogo from '../../resources/losses.svg';
import FeedbackLogo from '../../resources/feedback.svg';
import GroupLogo from '../../resources/Group.svg';
import PreviewLogo from '../../resources/preview.svg';

/* eslint-disable import/prefer-default-export */
export const Menu = {
    bulletinProgressMenu: [
        {
            name: 'दैनिक विपद् बुलेटिन',
            name_en: 'Daily BIPAD Bulletin',
            icon: LossesLogo,
            position: 0,
        },
        {
            name: 'COVID-19 बुलेटिन',
            name_en: 'COVID-19 Bulletin',
            icon: CovidLogo,
            position: 1,

        },
        {
            name: 'प्रतिकार्य',
            name_en: 'Response',
            icon: FeedbackLogo,
            position: 2,

        },
        {
            name: 'बर्षा र तापक्रम',
            name_en: 'Rain and Temperature',
            icon: GroupLogo,
            position: 3,

        },
        {
            name: 'बुलेटिन पूर्वावलोकन',
            name_en: 'Bulletin Preview',
            icon: PreviewLogo,
            position: 4,

        },
    ],
};
