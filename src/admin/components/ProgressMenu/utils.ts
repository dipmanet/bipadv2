/* eslint-disable @typescript-eslint/camelcase */
import CovidLogo from '../../resources/COVID-19.svg';
import LossesLogo from '../../resources/losses.svg';
import FeedbackLogo from '../../resources/feedback.svg';
import GroupLogo from '../../resources/Group.svg';
import PreviewLogo from '../../resources/preview.svg';
import InstituteLogo from '../../resources/institute.svg';
import DisasterManLogo from '../../resources/disaster-management.svg';
import ContactLogo from '../../resources/contact.svg';
import InventoryLogo from '../../resources/inventory.svg';
import LocationLogo from '../../resources/location.svg';
import PictureLogo from '../../resources/picture.svg';
import VerificationLogo from '../../resources/verification.svg';

/* eslint-disable import/prefer-default-export */
export const Menu = {
    bulletinProgressMenu: [
        {
            name: 'दैनिक बिपद् बुलेटिन',
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

    healthProgressMenu: [
        {
            name: 'Institution Details',
            name_en: 'Institution Details',
            icon: InstituteLogo,
            position: 1,
        },
        {
            name: 'Disaster Management',
            name_en: 'Disaster Management',
            icon: DisasterManLogo,
            position: 2,

        },
        {
            name: 'Contact',
            name_en: 'Contact',
            icon: ContactLogo,
            position: 3,

        },
        {
            name: 'Location',
            name_en: 'Location',
            icon: LocationLogo,
            position: 4,

        },
        {
            name: 'Picture',
            name_en: 'Picture',
            icon: PictureLogo,
            position: 5,

        },
        {
            name: 'Inventories',
            name_en: 'Inventories',
            icon: InventoryLogo,
            position: 6,

        },
        {
            name: 'Verification',
            name_en: 'Verification',
            icon: VerificationLogo,
        },
    ],
};
