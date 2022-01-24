import CovidLogo from '../../resources/COVID-19.svg';
import LossesLogo from '../../resources/losses.svg';
import FeedbackLogo from '../../resources/feedback.svg';
import GroupLogo from '../../resources/Group.svg';
import PreviewLogo from '../../resources/preview.svg';

/* eslint-disable import/prefer-default-export */
export const Menu = {
    bulletinProgressMenu: [
        {
            name: 'Incidents Loss',
            icon: LossesLogo,
            position: 0,
        },
        {
            name: 'Covid-19 Bulletin',
            icon: CovidLogo,
            position: 1,

        },
        {
            name: 'Response',
            icon: FeedbackLogo,
            position: 2,

        },
        {
            name: 'Temperature Bulletin',
            icon: GroupLogo,
            position: 3,

        },
        {
            name: 'Bulletin Preview',
            icon: PreviewLogo,
            position: 4,

        },
    ],
};
