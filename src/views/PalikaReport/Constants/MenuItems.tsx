import React from 'react';
import Gt from '#views/PalikaReport/utils';
import Translations from '#views/PalikaReport/Constants/Translations';

export default {
    menuItems: [
        {
            key: 0,
            content: 'General',
            contentNp: 'सामान्य',
        },
        {
            key: 1,
            content: 'Budget',
            contentNp: 'बजेट',
        },
        {
            key: 2,
            content: 'Budget Activity',
            contentNp: 'बजेट गतिविधि',
        },
        {
            key: 3,
            content: 'Programme and Policies',
            contentNp: 'नीति तथा कार्यक्रमहरू',
        },
        {
            key: 4,
            content: 'Organisation',
            contentNp: 'संस्था',
        },
        {
            key: 5,
            content: 'Inventories',
            contentNp: 'सूची',
        },
        {
            key: 6,
            content: 'Resources',
            contentNp: 'स्रोतहरू',
        },
        {
            key: 7,
            content: 'Contacts',
            contentNp: 'सम्पर्क',
        },
        {
            key: 8,
            content: 'Incident and Relief',
            contentNp: 'घटना तथा राहत',
        },
        {
            key: 9,
            content: 'Simulation',
            contentNp: 'अनुकरण',
        },
        {
            key: 10,
            content: 'Create Report',
            contentNp: 'प्रतिवेदन बनाउनुहोस्',
        },
    ],
    Data1: [{
        id: 1,
        title: 'Palika Reports',
        slug: 'palika-reports',
        components: [
            { id: 1,
                title: <Gt section={Translations.dashboardSidebarAllTitle} />,
                url: '/disaster-profile/',
                slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
            { id: 2,
                // eslint-disable-next-line @typescript-eslint/camelcase
                title: <Gt section={Translations.dashboardSidebarMunTitle} />,
                url: '/disaster-profile/',
                slug: 'my-reports' },
        ],
    },
    ],

    Data2: [{
        id: 1,
        title: <Gt section={Translations.dashboardSidebarMunTitle} />,
        slug: 'palika-reports',
        components: [{ id: 1,
            title: <Gt section={Translations.dashboardSidebarAllTitle} />,
            url: '/disaster-profile/',
            slug: 'all-reports' },
        // eslint-disable-next-line @typescript-eslint/camelcase
        ],
    },
    ],
};
