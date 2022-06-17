/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-spread */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prefer-const */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';


import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import Modal from '#rscv/Modal';

import ModalHeader from '#rscv/Modal/Header';

import ModalBody from '#rscv/Modal/Body';


import FullStepwiseRegionSelectInput, {
    RegionValuesAlt,
} from '#components/FullStepwiseRegionSelectInput';
import { districtsSelector, languageSelector, municipalitiesSelector, provincesSelector, wardsSelector } from '#selectors';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { MultiResponse } from '#store/atom/response/types';
import {
    Contact,
    Organization,
    Training as ContactTraining,
} from '#store/atom/page/types';
import DangerButton from '#rsca/Button/DangerButton';


import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import LoadingAnimation from '#rscv/LoadingAnimation';
import Button from '#rsca/Button';
import { saveChart } from '#utils/common';
import finance from '#resources/icons/newCapResBanking.svg';
import cultural from '#resources/icons/newCapResCulture.svg';
import education from '#resources/icons/newCapResEducation.svg';
import governance from '#resources/icons/newCapResGovernment.svg';
import health from '#resources/icons/newCapResHealth.svg';
import industry from '#resources/icons/newCapResIndustry.svg';
import hotelandrestaurant from '#resources/icons/newCapResHotel&Restaurant.svg';
import transportation from '#resources/icons/newCapResTransportation.svg';
import communication from '#resources/icons/newCapResCommunication.svg';
import bridge from '#resources/icons/newCapResBridge.svg';
import electricity from '#resources/icons/newCapResElectricity.svg';
import firefightingApp from '#resources/icons/newCapResFireFightingApparatus.svg';
import sanitationService from '#resources/icons/newCapResSanitationService.svg';
import watersupply from '#resources/icons/newCapResWaterSupplyInfrastructure.svg';
import openspace from '#resources/icons/newCapResOpenSpace.svg';
import evacuationCentre from '#resources/icons/newCapResEvacuationcenter.svg';
import airway from '#resources/icons/airway.svg';
import roadway from '#resources/icons/roadway.svg';
import waterway from '#resources/icons/waterway.svg';
import helipad from '#resources/icons/heli.svg';
import TableData from './DataSet';
import styles from './styles.scss';
import BarChartVisualization from './BarChart';


const getLocationDetails = (point: unknown) => {
    const geoJson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: point,
            },
        ],
    };

    return ({
        geoJson,
    });
};

interface OwnProps {
    contactId?: Contact['id'];
    details?: Contact;
    onEditSuccess?: (contactId: Contact['id'], contact: Contact) => void;
    onAddSuccess?: (contact: Contact) => void;
    closeModal?: () => void;
}

// TODO: Write appropriate types
interface FaramValues {
    name?: string | null;
    position?: string | null;
    email?: string | null;
    image?: File | null;
    workNumber?: string | null;
    mobileNumber?: string | null;
    isDrrFocalPerson?: boolean | null;
    organization?: number | null;
    committee?: Contact['committee'] | null;
    stepwiseRegion?: RegionValuesAlt | null;
    communityAddress?: string | null;
    location?: ReturnType<typeof getLocationDetails> | null;
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    organizationList?: Organization[];
}

interface Params {
    body?: FaramValues;
    setPristine?: (pristine: boolean) => void;
    setOrganizationList?: (organizationList: Organization[]) => void;
    setFaramErrors?: (error: object) => void;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    municipalityContactEditRequest: {
        url: ({ props }) => `/municipality-contact/${props.contactId}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ response, props, params }) => {
            const editedContact = response as Contact;
            const {
                contactId,
                onEditSuccess,
            } = props;
            if (onEditSuccess && contactId) {
                onEditSuccess(contactId, editedContact);
            }
            if (params && params.setPristine) {
                params.setPristine(true);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
    municipalityContactAddRequest: {
        url: '/municipality-contact/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ response, props }) => {
            const editedContact = response as Contact;
            const { onAddSuccess, closeModal } = props;
            if (onAddSuccess) {
                onAddSuccess(editedContact);
            }
            if (closeModal) {
                closeModal();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const organizationList = response as MultiResponse<Organization>;

            if (params && params.setOrganizationList) {
                params.setOrganizationList(organizationList.results);
            }
        },
    },
};
const sidepanelLogo = [
    {
        name: 'Education',
        image: education,
    },
    {
        name: 'Banking & Finance',
        image: finance,
    },
    {
        name: 'Culture',
        image: cultural,
    },
    {
        name: 'Hotel & Restaurant',
        image: hotelandrestaurant,
    },
    {
        name: 'Governance',
        image: governance,
    },
    {
        name: 'Health',
        image: health,
    },
    {
        name: 'Transportation',
        image: transportation,
    },
    {
        name: 'Airway',
        image: airway,
    },
    {
        name: 'Waterway',
        image: waterway,
    },
    {
        name: 'Roadway',
        image: roadway,
    },
    {
        name: 'Industry',
        image: industry,
    },
    {
        name: 'Communication',
        image: communication,
    },
    {
        name: 'Bridge',
        image: bridge,
    },
    {
        name: 'Roadway',
        image: bridge,
    },
    {
        name: 'Waterway',
        image: bridge,
    },
    {
        name: 'Airway',
        image: bridge,
    },
    {
        name: 'Helipad',
        image: helipad,
    },
    {
        name: 'Electricity',
        image: electricity,
    },
    {
        name: 'Fire Fighting Apparatus',
        image: firefightingApp,
    },
    {
        name: 'Fire Engine',
        image: firefightingApp,
    },
    {
        name: 'Sanitation Service',
        image: sanitationService,
    },
    {
        name: 'Water Supply Infrastructure',
        image: watersupply,
    },
    {
        name: 'Humanitarian Open Space',
        image: openspace,
    },
    {
        name: 'Community Space',
        image: openspace,
    },
    {
        name: 'Evacuation Centre',
        image: evacuationCentre,
    },
];
// const data = [
//     {
//         label: 'Pri Primary',
//         value: 4000,
//         color: '#216CD7',

//     },
//     {
//         label: 'Basic Education',
//         value: 3000,
//         color: '#216CD7',

//     },
//     {
//         label: 'High School',
//         value: 2000,
//         color: '#216CD7',

//     },
//     {
//         label: 'College',
//         value: 2780,
//         color: '#216CD7',

//     },
//     {
//         label: 'University',
//         value: 1890,
//         color: '#216CD7',

//     },
//     {
//         label: 'Traditional Education',
//         value: 2390,
//         color: '#216CD7',

//     },

// ];
const visualizationKeyValues = [
    {
        resourceType: 'education',
        visualizationHeading: 'Education Institution',
        visualizationHeadingNe: 'शिक्षा संस्था',
        chartDataType: [
            {
                label: 'Education Institutions',
                labelNe: 'शिक्षा संस्था',
                key: 'type',
                values: ['Pre Primary', 'Basic Education', 'High School', 'College', 'University', 'Traditional Education', 'Library', 'Other'],
                valuesNe: ['पूर्वप्राथमिक', 'आधारभूत शिक्षा', 'उच्च विद्यालय', 'कलेज', 'विश्वविद्यालय', 'परम्परागत शिक्षा', 'पुस्तकालय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Open Space',
                labelNe: 'खुल्‍ला ठाउँ',
                key: 'hasOpenSpace',
                values: ['Open Space'],
                valuesNe: ['खुल्‍ला ठाउँ'],
                isBoolean: true,

            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },
            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },
            {
                label: 'Number of Students',
                labelNe: 'विद्यार्थी संख्या',
                key: ['noOfMaleStudent', 'noOfFemaleStudent', 'noOfOtherStudent'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },
            {
                label: 'Students with Disability',
                labelNe: 'अपाङ्गता भएका विद्यार्थीहरू',
                key: ['noOfDifferentlyAbledMaleStudents', 'noOfDifferentlyAbledFemaleStudents', 'noOfDifferentlyAbledOtherStudents'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },
        ],
    },

    {
        resourceType: 'finance',
        visualizationHeading: 'Banking and Finance Institution',
        visualizationHeadingNe: 'बैंकिङ र वित्त संस्था',
        chartDataType: [
            {
                label: 'Banking & Financial Institutions',
                labelNe: 'बैंकिङ र वित्तीय संस्थाहरू',
                key: 'type',
                values: ['Commercial', 'Micro Credit Development', 'Finance', 'Development Bank', 'Cooperative', 'Money Exchange', 'ATM'],
                valuesNe: [],
                isBoolean: false,


            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,


            },
            {
                label: 'Services Available',
                labelNe: 'उपलब्ध सेवाहरू',
                key: ['bank', 'moneyExchange', 'atm', 'hasOtherServices'],
                values: ['Bank', 'Money Exchange', 'ATM', 'Other Services'],
                valuesNe: ['बैंक', 'मनी एक्सचेन्ज', 'एटीएम', 'अन्य सेवाहरू'],
                isBoolean: true,

            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'communication',
        visualizationHeading: 'Communication Institution',
        visualizationHeadingNe: 'सञ्चार संस्था',
        chartDataType: [
            {
                label: 'communication Institutions Types',
                labelNe: 'सञ्चार संस्थाका प्रकारहरू',
                key: 'type',
                values: ['FM Radio', 'TV Station', 'Newspapers', 'Phone Service', 'Cable', 'Online Media', 'Internet Service Provider'],
                valuesNe: ['एफएम रेडियो', 'टिभी स्टेशन', 'न्युजपेपर', 'फोन सेवा', 'केबल', 'अनलाइन मिडिया', 'इन्टरनेट सेवा प्रदायक'],
                isBoolean: false,


            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,


            },

            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'governance',
        visualizationHeading: 'Government Institution',
        visualizationHeadingNe: 'सरकारी संस्था',
        chartDataType: [
            {
                label: 'Government Institution Types',
                labelNe: 'सरकारी संस्थाका प्रकारहरू',
                key: 'type',
                values: ['Government', 'INGO', 'NGO', 'CSO', 'Other'],
                valuesNe: ['सरकार', 'अन्तर्राष्ट्रिय गैर सरकारी संस्था', 'गैर सरकारी संस्था', 'सिएसवो', 'अन्य'],
                isBoolean: false,


            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Helipad ',
                labelNe: 'हेलिप्याड',
                key: 'hasHelipad',
                values: ['Helipad'],
                valuesNe: ['हेलिप्याड'],
                isBoolean: true,

            },
            {
                label: 'Open Space',
                labelNe: 'खुल्‍ला ठाउँ',
                key: 'hasOpenSpace',
                values: ['Open Space'],
                valuesNe: ['खुल्‍ला ठाउँ'],
                isBoolean: true,

            },

            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'hotelandrestaurant',
        visualizationHeading: 'Hotel & Restaurant',
        visualizationHeadingNe: 'होटल र रेस्टुरेन्ट',
        chartDataType: [
            {
                label: 'Hotel & Restaurant Types',
                labelNe: 'होटल र रेस्टुरेन्ट प्रकार',
                key: 'type',
                values: ['Hotel', 'Restaurant', 'Lodge', 'Resort', 'Homestay'],
                valuesNe: ['होटेल', 'रेष्टुरेन्ट', 'लज', 'रिसोर्ट', 'होमस्टे'],
                isBoolean: false,
            },
            {
                label: 'Bed Capacity',
                labelNe: 'बेड क्षमता',
                key: ['bedCount'],
                values: ['Bed Capacity'],
                valuesNe: ['बेड क्षमता'],
                isBoolean: false,

            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारीहरूको संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'cultural',
        visualizationHeading: 'Cultural Sites',
        visualizationHeadingNe: 'सांस्कृतिक साइटहरू',
        chartDataType: [
            {
                label: 'Religions',
                labelNe: 'धर्महरू',
                key: 'religion',
                values: ['Hindu', 'Islam', 'Christian', 'Buddhist', 'Kirat', 'Sikhism', 'Judaism', 'Other'],
                valuesNe: ['हिन्दू', 'इस्लाम', 'क्रिस्चियन', 'बौद्ध', 'किरात', 'सिख', 'यहूदी', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Open Space ',
                labelNe: 'खुल्‍ला ठाउँ',
                key: 'hasOpenSpace',
                values: ['Open Space '],
                valuesNe: ['खुल्‍ला ठाउँ'],
                isBoolean: true,

            },
            {
                label: 'Drinking Water Available ',
                labelNe: 'उपलब्ध पिउने पानी',
                key: 'drinkingWater',
                values: ['Drinking Water'],
                valuesNe: ['पिउने पानी'],
                isBoolean: true,

            },
            {
                label: 'Toilet Available',
                labelNe: 'उपलब्ध शौचालय',
                key: 'toilet',
                values: ['Toilet '],
                valuesNe: ['शौचालय'],
                isBoolean: true,

            },
            {
                label: 'Wash Facility Available ',
                labelNe: 'उपलब्ध धुने सुविधा ',
                key: 'hasWashFacility',
                values: ['Wash Facility '],
                valuesNe: ['धुने सुविधा'],
                isBoolean: true,

            },
            {
                label: 'Sleeping Facility Available ',
                labelNe: 'उपलब्ध सुत्ने सुविधा',
                key: 'hasSleepingFacility',
                values: ['Sleeping Facility '],
                valuesNe: ['सुत्ने सुविधा'],
                isBoolean: true,

            },
            {
                label: 'Electricity Facility Available ',
                labelNe: 'उपलब्ध बिजुली सुविधा',
                key: 'hasElectricity',
                values: ['Electricity Facility '],
                valuesNe: ['बिजुली सुविधा'],
                isBoolean: true,

            },


        ],
    },
    {
        resourceType: 'industry',
        visualizationHeading: 'Industries',
        visualizationHeadingNe: 'उद्योगहरू',
        chartDataType: [
            {
                label: 'Industry Types',
                labelNe: 'उद्योगका प्रकारहरू',
                key: 'subtype',
                values: ['Cottage Industry', 'Micro Industry', 'Small Industry', 'Medium Industry', 'Large Industry', 'Other'],
                valuesNe: ['घरेलु उद्योग', 'सूक्ष्म उद्योग', 'साना उद्योग', 'मध्यम उद्योग', 'ठूला उद्योग', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'bridge',
        visualizationHeading: 'Bridges',
        visualizationHeadingNe: 'पुलहरू',
        chartDataType: [
            {
                label: 'Bridge Types',
                labelNe: 'पुलका प्रकार',
                key: 'type',
                values: ['Arch', 'Beam', 'Cantilever', 'Wooden', 'Suspension', 'Cable-stayed', 'Culvert', 'Bailey', 'Truss', 'Other'],
                valuesNe: ['आर्क', 'बीम', 'केन्टिलिभर', 'काठ', 'सस्पेन्सन', 'केबल-स्टेड', 'कलभर्ट', 'बेली', 'ट्रस', 'अन्य'],
                isBoolean: false,
            },

            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Motorable Bridge',
                labelNe: ['मोटरेबल ब्रिज'],
                key: ['isMotorable'],
                values: ['Motorable Bridge'],
                valuesNe: ['मोटरेबल ब्रिज'],
                isBoolean: true,

            },
            {
                label: 'Condition',
                labelNe: 'अवस्था',
                key: 'condition',
                values: ['Good ', 'Bad'],
                valuesNe: ['राम्रो', 'नराम्रो'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'electricity',
        visualizationHeading: 'Electricity',
        visualizationHeadingNe: 'बिजुली',
        chartDataType: [
            {
                label: 'Electricity Components',
                labelNe: 'बिजुली घटक',
                key: 'components',
                values: ['Hydropower', 'Substation', 'Dam', 'Transmission Pole', 'Other'],
                valuesNe: ['जलविद्युत', 'सबस्टेशन', 'बाँध', 'ट्रान्समिशन पोल', 'अन्य'],
                isBoolean: false,
            },
        ],
    },
    {
        resourceType: 'sanitation',
        visualizationHeading: 'Sanitation Service',
        visualizationHeadingNe: 'सरसफाई सेवा',
        chartDataType: [
            {
                label: 'Sanitation Service Types',
                labelNe: 'सरसफाई सेवा प्रकार',
                key: 'type',
                values: ['Landfill', 'Dumping Site', 'Public Toilet'],
                valuesNe: ['ल्याण्डफिल', 'डम्पिङ साइट', 'सार्वजनिक शौचालय'],
                isBoolean: false,
            },
            {
                label: 'Permanent Landfill',
                labelNe: ['स्थायी ल्यान्डफिल'],
                key: ['isPermanent'],
                values: ['Permanent Landfill '],
                valuesNe: ['स्थायी ल्यान्डफिल'],
                isBoolean: true,

            },

        ],
    },
    {
        resourceType: 'openspace',
        visualizationHeading: 'Open Space',
        visualizationHeadingNe: 'खुल्‍ला ठाउँ',
        chartDataType: [

            {
                label: 'Open Space Area Details(Sq Km)',
                labelNe: 'खुला क्षेत्र विवरण (वर्ग किलोमिटर)',
                key: ['totalArea', 'usableArea', 'usableAreaSecond'],
                values: ['Total Area', 'Usable Area', 'Alternate Usable Area'],
                valuesNe: ['कुल क्षेत्र', 'प्रयोगयोग्य क्षेत्र', 'वैकल्पिक प्रयोगयोग्य क्षेत्र'],
                isBoolean: false,

            },


        ],
    },
    {
        resourceType: 'communityspace',
        visualizationHeading: 'Community Space',
        visualizationHeadingNe: 'सामुदायिक ठाउँ',
        chartDataType: [

            {
                label: 'Community Space Area Details(Sq Km)',
                labelNe: 'सामुदायिक क्षेत्र विवरण (वर्ग किलोमिटर)',
                key: ['capacity'],
                values: ['Capacity of Community Space'],
                valuesNe: ['सामुदायिक ठाउँको क्षमता'],
                isBoolean: false,

            },


        ],
    },

    {
        resourceType: 'watersupply',
        visualizationHeading: 'Water Supply Infrastructure',
        visualizationHeadingNe: 'पानी आपूर्ति पूर्वाधार',
        chartDataType: [
            {
                label: 'Water Supply Infrastructure Scales',
                labelNe: 'पानी आपूर्ति पूर्वाधार स्केल',
                key: 'scale',
                values: ['Small', 'Medium', 'Large'],
                valuesNe: ['सानो', 'मध्यम', 'ठूलो'],
                isBoolean: false,
            },
            {
                label: 'Operator Type',
                labelNe: 'अपरेटर प्रकार',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                valuesNe: ['सरकारी', 'निजी', 'समुदाय', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },
            {
                label: 'Technical Staff',
                labelNe: 'प्राविधिक कर्मचारी',
                key: ['hasTechnicalStaff'],
                values: ['Technical Staff '],
                valuesNe: ['प्राविधिक कर्मचारी'],
                isBoolean: true,

            },
            {
                label: 'Operational Water Supply Infrastructure',
                labelNe: 'परिचालित पानी आपूर्ति पूर्वाधार',
                key: ['isWaterSupplyOperational'],
                values: ['Operational Water Supply Infrastructure '],
                valuesNe: ['कार्यात्मक पानी आपूर्ति पूर्वाधार'],
                isBoolean: true,

            },


        ],
    },
    {
        resourceType: 'roadway',
        visualizationHeading: 'Roadways',
        visualizationHeadingNe: 'सडक मार्गहरू',
        chartDataType: [
            {
                label: 'Types of Vehicles',
                labelNe: 'गाडीका प्रकार',
                key: 'kindOfVehicle',
                values: ['Bus', 'Micro', 'Van', 'Other'],
                valuesNe: ['बस', 'माइक्रो', 'भ्यान', 'अन्य'],
                isBoolean: false,
            },
        ],
    },
    {
        resourceType: 'helipad',
        visualizationHeading: 'Helipad',
        visualizationHeadingNe: 'हेलिप्याड',
        chartDataType: [
            {
                label: 'Surface Type of Helipad',
                labelNe: 'हेलिप्याडको सतह प्रकार',
                key: 'surfaceType',
                values: ['Concrete', 'Grass land', 'Dirt surface', 'Other'],
                valuesNe: ['कंक्रिट', 'घाँस जग्गा', 'माटो सतह', 'अन्य'],
                isBoolean: false,
            },
            {
                label: 'Condition of Helipad',
                labelNe: 'हेलिप्याडको अवस्था',
                key: 'helipadCondition',
                values: ['Operational', 'Need Repair', 'Not in working condition'],
                valuesNe: ['अपरेशनल', 'रिपेयर आवश्यक छ', 'काम गर्ने अवस्थामा छैन'],
                isBoolean: false,
            },
            {
                label: 'Wind Direction Indicator Available',
                labelNe: 'उपलब्ध पवन दिशा सूचक',
                key: 'windDirectionIndicatorAvailable',
                values: ['Wind Direction Indicator Available'],
                valuesNe: ['उपलब्ध पवन दिशा सूचक'],
                isBoolean: true,
            },
            {
                label: 'Heli Marker Available',
                labelNe: 'उपलब्ध हेली मार्कर',
                key: 'heliMarkerAvailable',
                values: ['Heli Marker Available'],
                valuesNe: ['उपलब्ध हेली मार्कर'],
                isBoolean: true,

            },
            {
                label: 'Night Lighting Available',
                labelNe: 'उपलब्ध रात प्रकाश',
                key: 'nightLightingAvailable',
                values: ['Night Lighting Available'],
                valuesNe: ['उपलब्ध रात प्रकाश'],
                isBoolean: true,

            },
            {
                label: 'Number of Employees',
                labelNe: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

        ],
    },
    {
        resourceType: 'waterway',
        visualizationHeading: 'Waterway',
        visualizationHeadingNe: 'जलमार्ग',
        chartDataType: [
            {
                label: 'Types of waterways',
                labelNe: 'जलमार्गका प्रकार',
                key: 'type',
                values: ['General Boat', 'Electrical Boat', 'Other'],
                valuesNe: ['सामान्य डुङ्गा', 'विद्युतीय डुङ्गा', 'अन्य'],
                isBoolean: false,
            },


        ],
    },
    {
        resourceType: 'airway',
        visualizationHeading: 'Airway',
        visualizationHeadingNe: 'वायुमार्ग',
        chartDataType: [
            {
                label: 'Types of airways',
                labelNe: 'वायुमार्गका प्रकारहरू',
                key: 'type',
                values: ['National', 'International'],
                valuesNe: ['राष्ट्रिय', 'अन्तर्राष्ट्रिय'],
                isBoolean: false,
            },


        ],
    },
    {
        resourceType: 'fireengine',
        visualizationHeading: 'Fire Engine',
        visualizationHeadingNe: 'दमकल',
        chartDataType: [
            {
                label: 'Condition of fire engine',
                labelNe: 'दमकलको अवस्था',
                key: 'condition',
                values: ['Operational', 'Need Repair', 'Not in working condition'],
                valuesNe: ['सञ्चालन', 'मरम्मत आवश्यक', 'काम गर्ने अवस्थामा छैन'],
                isBoolean: false,
            },


        ],
    },
    {
        resourceType: 'firefightingapparatus',
        visualizationHeading: 'Fire Fighting Apparatus',
        visualizationHeadingNe: 'आगो नियनत्रण उपकरण',
        chartDataType: [
            {
                label: 'Operator Type of fire fighting apparatus',
                labelNe: 'आगो नियनत्रण उपकरणको अपरेटर को प्रकार',
                key: 'operatorType',
                values: ['Private', 'Government', 'Community'],
                valuesNe: ['निजी', 'सरकारी', 'समुदाय'],
                isBoolean: false,
            },
            // {
            //     label: 'Condition of fire engine',
            //     key: 'condition',
            //     values: ['Operational', 'Need Repair', 'Not in working condition'],
            //     isBoolean: false,
            // },


        ],
    },
    {
        resourceType: 'evacuationcentre',
        visualizationHeading: 'Evacuation Center',
        visualizationHeadingNe: 'निकासी केन्द्र',
        chartDataType: [
            {
                label: 'Government Institution Types',
                labelNe: 'सरकारी संस्थाका प्रकारहरू',
                key: 'operatedBy',
                values: ['Government', 'INGO', 'NGO', 'CSO'],
                valuesNe: ['सरकार', 'अन्तर्राष्ट्रिय गैर सरकारी संस्था', 'गैर सरकारी संस्था', 'सिएसवो'],
                isBoolean: false,


            },
            {
                label: 'Drinking Water Available',
                labelNe: 'उपलब्ध पिउने पानी',
                key: 'hasDrinkingWater',
                values: ['Drinking Water'],
                valuesNe: ['पिउने पानी'],
                isBoolean: true,

            },
            {
                label: 'Toilet Available',
                labelNe: 'उपलब्ध शौचालय',
                key: 'hasToilet',
                values: ['Toilet'],
                valuesNe: ['शौचालय'],
                isBoolean: true,

            },
            {
                label: 'Wash Facility Available',
                labelNe: 'उपलब्ध धुने सुविधा',
                key: 'hasHandWashingFacility',
                values: ['Wash Facility'],
                valuesNe: ['धुने सुविधा'],
                isBoolean: true,

            },
            {
                label: 'Sleeping Facility Available',
                labelNe: 'उपलब्ध सुत्ने सुविधा',
                key: 'hasSleepingFacility',
                values: ['Sleeping Facility'],
                valuesNe: ['सुत्ने सुविधा'],
                isBoolean: true,

            },


        ],
    },
    {
        resourceType: 'health',
        visualizationHeading: 'Health Institution Category',
        visualizationHeadingNe: 'स्वास्थ्य संस्था कोटि',
        chartDataType: [

            {
                label: 'Health Institutions Types',
                labelNe: 'स्वास्थ्य संस्थाका प्रकारहरू',
                key: 'type',
                values: ['Specialized Hospital', 'Center Hospital', 'Teaching Hospital',
                    'Regional Hospital', 'Sub Regional Hospital', 'Zonal Hospital',
                    'District Hospital', 'Basic Hospital', 'General Hospital', 'Primary Health Care Center',
                    'Health Post', 'District Clinic (Including Institutional)', 'Urban Health Center', 'Community Health Unit',
                    'Poly Clinic', 'Clinic', 'Dental Clinic', 'Diagnostic Center', 'Nursing Home', 'Rehabilitation', 'Ayurveda Hospital',
                    'Zonal Ayurveda Aushadhalaya', 'District Ayurveda Health Center',
                    'Ayurveda Aushadhalaya', 'Homeopathy Hospital', 'Unani Hospital', 'Primary Hospital',
                    'Secondary A Hospital', 'Secondary B Hospital', 'Tertiary Hospital', 'Super Specialized Hospital',
                    'Basic Health Care Center', 'Veterinary', 'Pathology', 'Pharmacy', 'Other'],
                valuesNe: ['विशेष अस्पताल', 'केन्द्र अस्पताल', 'शिक्षण अस्पताल',
                    'क्षेत्रीय अस्पताल', 'उपक्षेत्रीय अस्पताल', 'अञ्चल अस्पताल',
                    'जिल्ला अस्पताल', 'आधारभूत अस्पताल', 'सामान्य अस्पताल', 'प्राथमिक स्वास्थ्य सेवा केन्द्र',
                    'स्वास्थ्य पोस्ट', 'जिल्ला क्लिनिक (संस्थागत सहित)', 'शहरी स्वास्थ्य केन्द्र', 'सामुदायिक स्वास्थ्य इकाई',
                    'पोली क्लिनिक', 'क्लिनिक', 'डेन्टल क्लिनिक', 'डायग्नोस्टिक सेन्टर', 'नर्सिङ होम', 'पुनर्वास', 'आयुर्वेद अस्पताल',
                    'क्षेत्रीय आयुर्वेद औषधालय', 'जिला आयुर्वेद स्वास्थ्य केन्द्र',
                    'आयुर्वेद औषधालय', 'होमियोप्याथी अस्पताल', 'युनानी अस्पताल', 'प्राथमिक अस्पताल',
                    'सेकेन्डरी ए अस्पताल', 'सेकेन्डरी बी अस्पताल', 'टर्टियरी अस्पताल', 'सुपर स्पेशलाइज्ड अस्पताल',
                    'आधारभूत स्वास्थ्य सेवा केन्द्र', 'भेटेनरी', 'प्याथोलोजी', 'फार्मेसी', 'अन्य'],
                isBoolean: false,
            },

            {
                label: 'Services Available',
                labelNe: 'उपलब्ध सेवाहरू',
                key: ['hasChildImmunization', 'hasTdVaccination', 'hasImnci', 'hasGrowthMonitoring', 'hasSafeMotherhood',
                    'familyPlanning', 'hasOpd', 'hasTreatementOfTb', 'hasTreatementOfMdrTb', 'hasTreatementOfLeprosy',
                    'hasTreatementOfMalaria', 'hasTreatementOfKalaazar', 'hasTreatementOfJapaneseEncephalitis',
                    'hasLaboratoryService', 'hasVolunteerCounselingTest', 'hasPmtct', 'hasAntiRetroViralTreatment', 'hasDental',
                    'hasInPatient', 'hasRadiology'],
                values: ['Child Immunization', 'TD Vaccination', 'IMNCI',
                    'Growth Monitoring', 'Safe Motherhood', 'Family Planning', 'OPD', 'Treatment of Tuberculosis',
                    'Treatment of MDR tuberculosis', 'Treatment of Leprosy',
                    'Treatment of Malaria', 'Treatment of Kala-azar', 'Treatment of Japanese Encephalitis', 'Laboratory Service',
                    'VCT for HIV/AIDS', 'PMTCT', 'Anti-retro Viral Treatment',
                    'Dental', 'Inpatient', 'Radiology'],
                valuesNe: ['बाल खोप', 'TD खोप', 'IMNCI',
                    'वृद्धि अनुगमन', 'सुरक्षित मातृत्व', 'परिवार योजना', 'ओपीडी', 'क्षयरोगको उपचार',
                    'एमडीआर क्षयरोगको उपचार', 'कुष्ठरोगको उपचार',
                    'औलोको उपचार', 'कालाजारको उपचार', 'जापानीज इन्सेफलाइटिसको उपचार', 'प्रयोगशाला सेवा',
                    'एचआईभी/एड्सका लागि VCT', 'PMTCT', 'एन्टि-रेट्रो भाइरल उपचार',
                    'दन्त', 'इनपेन्टल', 'रेडियोलोजी'],
                isBoolean: false,

            },
            {
                label: 'Surgical Service',
                labelNe: 'सर्जिकल सेवा',
                key: ['hasCaesarianSection', 'hasGastrointestinal', 'hasTraumaSurgery', 'hasCardiacSurgery',
                    'hasNeuroSurgery', 'hasPlasticSurgery'],
                values: ['Caesarian Section', 'Gastro Intestinal', 'Trauma Surgery', 'Cardiac Surgery', 'Neuro Surgery', 'Plastic Surgery'],
                valuesNe: ['सिजेरियन सेक्शन', 'ग्यास्ट्रो इन्टेस्टाइनल', 'ट्रमा सर्जरी', 'कार्डियाक सर्जरी', 'न्यूरो सर्जरी', 'प्लास्टिक सर्जरी'],
                isBoolean: false,

            },
            {
                label: 'Specialized Service',
                labelNe: 'विशेष सेवा',
                key: ['hasIcu', 'hasCcu', 'hasNicu', 'hasMicu', 'hasSncu', 'hasPicu'],
                values: ['ICU', 'CCU', 'NICU', 'MICU', 'SNCU', 'PICU'],
                valuesNe: ['ICU', 'CCU', 'NICU', 'MICU', 'SNCU', 'PICU'],
                isBoolean: false,

            },
            {
                label: 'Bed Capacity',
                labelNe: 'बेड क्षमता',
                key: ['hospitalBedCount', 'icuBedCount', 'ventilatorBedCount'],
                values: ['Hospital Bed', 'ICU Bed', 'Ventilator Bed'],
                valuesNe: ['हस्पिटल बेड', 'आईसीयू बेड', 'भेन्टिलेटर बेड'],
                isBoolean: false,

            },
            {
                label: 'Helipad Available',
                labelNe: 'उपलब्ध हेलिप्याड',
                key: ['hasHelipad'],
                values: ['Helipad Available'],
                valuesNe: ['उपलब्ध हेलिप्याड'],
                isBoolean: false,

            },
            {
                label: 'Open Space Available',
                labelNe: 'उपलब्ध खुला ठाउँ',
                key: ['hasOpenSpace'],
                values: ['Open Space Available'],
                valuesNe: ['उपलब्ध खुला ठाउँ'],
                isBoolean: false,

            },
            {
                label: 'Number of Employees',
                labelNe: 'कर्मचारी संख्या',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },

            {
                label: 'Employees with Disability',
                labelNe: 'अपाङ्गता भएका कर्मचारीहरू',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                valuesNe: ['पुरुष', 'महिला', 'अन्य'],
                isBoolean: false,

            },


        ],
    },

];


const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;

    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value}</text>
    );
};
const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    language: languageSelector(state),


});
class DataVisualisation extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);


        this.state = {

            selectedResourceData: [],
            GraphVisualizationData: [],
            isValueCalculated: false,
            isDataSetClicked: false,
            allDataNullConditionCheck: false,

        };
    }

    public async componentDidMount(prevProps, prevState) {
        const { resourceCollection, resourceType, pendingAPICall } = this.props;
        const { isValueCalculated } = this.state;

        const resourceDataList = resourceCollection[resourceType];

        this.setState({
            selectedResourceData: resourceDataList,
        });
        const GraphVisualizationData = await visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType
            .map((datakey) => {
                const datam = this.getResourceDataForVisualization(resourceType, datakey.key,
                    datakey.isBoolean, datakey.values, datakey.valuesNe);
                return datam;
            });
        const calculatedSum = await GraphVisualizationData[0].reduce((acc, curValue) => acc + curValue.value || 0, 0);

        if (!pendingAPICall && (resourceCollection[resourceType]).length === 0) {
            this.setState({ isValueCalculated: true });
        }
        if (calculatedSum > 0) {
            this.setState({ isValueCalculated: true });
        }
        if (prevState) {
            if (prevState.isValueCalculated !== isValueCalculated) {
                this.setState({ GraphVisualizationData });
            }
        }
    }

    public async componentDidUpdate(prevProps, prevState) {
        const { resourceCollection, resourceType, pendingAPICall } = this.props;
        const { isValueCalculated } = this.state;

        const resourceDataList = resourceCollection[resourceType];

        this.setState({
            selectedResourceData: resourceDataList,
        });

        const GraphVisualizationData = await visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType
            .map((datakey) => {
                const datam = this.getResourceDataForVisualization(resourceType, datakey.key,
                    datakey.isBoolean, datakey.values, datakey.valuesNe);
                return datam;
            });
        let nullDataCheck = null;
        const calculatedSum = GraphVisualizationData[0].reduce((acc, curValue) => acc + curValue.value || 0, 0);
        nullDataCheck = calculatedSum || null;

        if (!pendingAPICall && (resourceCollection[resourceType]).length !== 0 && nullDataCheck === null) {
            this.setState({
                isValueCalculated: true,
                allDataNullConditionCheck: true,
            });
        }
        if (!pendingAPICall && (resourceCollection[resourceType]).length === 0) {
            this.setState({ isValueCalculated: true });
        }
        if ((calculatedSum > 0)) {
            this.setState({ isValueCalculated: true });
        }
        if (prevState.isValueCalculated !== isValueCalculated) {
            this.setState({ GraphVisualizationData });
        }
    }

    private getResourceDataForVisualization = (resourceType, key, isBoolean, label, labelNe) => {
        const { selectedResourceData } = this.state;


        const { language: { language } } = this.props;
        let filteredResourceChartDataType;
        let calculatedValueData;
        let filterDataForCalculation;

        const filterLabelAccToLang = (data, keyMain) => {
            if (data.length > 0) {
                const actData = data.filter(item => item.resourceType === resourceType)[0].chartDataType;
                const chartData = actData.filter(dat => dat.key === key)[0];
                return chartData[keyMain];
            }
            return [];
        };

        let nepaliKeyVal = {};
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < visualizationKeyValues.length; index++) {
            const chartData = visualizationKeyValues[index].chartDataType;
            // eslint-disable-next-line no-plusplus
            for (let jindex = 0; jindex < chartData.length; jindex++) {
                const engVal = chartData[jindex].values;
                const nepaliVal = chartData[jindex].valuesNe;
                // eslint-disable-next-line no-plusplus
                for (let k = 0; k < engVal.length; k++) {
                    const indiVidualData = engVal[k];
                    const indiVidualDataNep = nepaliVal[k];
                    nepaliKeyVal[indiVidualDataNep] = indiVidualData;
                }
            }
        }

        if (typeof key === 'string') {
            const keyMain = language === 'en' ? 'values' : 'valuesNe';
            filteredResourceChartDataType = filterLabelAccToLang(visualizationKeyValues, keyMain);

            calculatedValueData = filteredResourceChartDataType.map((item, i) => {
                filterDataForCalculation = selectedResourceData.filter(d => d[key] === (language === 'en' ? item : nepaliKeyVal[item]));

                if (isBoolean) {
                    filterDataForCalculation = selectedResourceData.filter(d => d[key] === true);
                }

                const obj = {};
                obj.label = item;
                obj.value = filterDataForCalculation.length;
                obj.color = '#1A70AC';

                // obj[`${item}`] = filterDataForCalculation.length;
                return obj;
            });
        }
        if (typeof key === 'object') {
            filteredResourceChartDataType = key;
            calculatedValueData = filteredResourceChartDataType.map((item, i) => {
                // const isOtherItemDefined = filteredResourceChartDataType[filteredResourceChartDataType.length - 1];

                // const filterDataForStringValue = selectedResourceData.filter(itm => itm[isOtherItemDefined] !== null);
                // if(filterDataForStringValue){
                //     filterDataForCalculation=filterDataForStringValue.length
                // }else{

                // }

                // console.log('filterDataForStringValue', filterDataForStringValue);
                filterDataForCalculation = selectedResourceData
                    .reduce((acc, curValue) => acc + curValue[item] || 0, 0);
                const obj = {};
                obj.label = language === 'en' ? label[i] : labelNe[i];
                obj.value = filterDataForCalculation;
                obj.color = '#1A70AC';
                // obj[`${label[i]}`] = filterDataForCalculation;
                return obj;
            });
        }


        return calculatedValueData;
    }

    private HighValuePercentageCalculation = (value) => {
        const { resourceType, language: { language } } = this.props;
        const labelName = visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType;
        const HighestValue = value.map((item, i) => {
            const highValueObject = item.reduce((a, b) => (a.value > b.value ? a : b));

            // console.log(value, 'obj');

            const totalSum = item.reduce((a, b) => a + b.value || 0, 0);


            const highValuePercentage = totalSum === 0 ? 0 : ((highValueObject.value / totalSum) * 100).toFixed(2);
            const subCategoryName = language === 'en' ? labelName[i].label : labelName[i].labelNe;

            // console.log(highValueObject, 'sub cat');

            return ({
                category: subCategoryName,
                subCategoryName: highValueObject.label,
                highValuePercentage,
            });
        });
        return HighestValue;
    }

    private handleSaveClick = (id) => {
        if (id === 'overallDownload') {
            const divToDisplay = document.getElementById('overallDownload');
            const pdf = new JsPDF('p', 'mm', 'a4');
            html2canvas(divToDisplay).then((canvas) => {
                const divImage = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                pdf.addImage(divImage, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(divImage, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save('Report.pdf');
            });
        } else {
            saveChart(id, id);
        }

        // saveChart("hazardSeverity", "hazardSeverity");
    };

    public render() {
        const { closeVisualization, checkedCategory,
            resourceType, level, lvl2catName, typeName, resourceCollection, selectedCategoryName, wards, provinces, districts, municipalities, pendingAPICall,
            language: { language } } = this.props;
        const { GraphVisualizationData, isValueCalculated, isDataSetClicked, selectedResourceData, allDataNullConditionCheck } = this.state;

        const labelName = visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType;

        const HighValuePercentageCalculation = this.HighValuePercentageCalculation(GraphVisualizationData);
        const { visualizationHeading, visualizationHeadingNe } = visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0];

        const selectedImage = sidepanelLogo.filter(data => data.name === selectedCategoryName)[0].image;


        const updatedSelectedResource = selectedResourceData.map((item) => {
            const wardExist = wards.find(w => w.id === item.ward);

            const provinceId = (wardExist) ? wardExist.province : '';
            const provinceName = provinceId ? (provinces.find(p => p.id === provinceId).title_en) : '';
            const districtId = wardExist ? wardExist.district : '';
            const districtName = districtId ? districts.find(d => d.id === districtId).title_en : '';
            const municipalityId = wardExist ? wardExist.municipality : '';
            const municipalityName = municipalityId ? municipalities.find(m => m.id === municipalityId).title_en : '';
            const wardNumber = wardExist ? wardExist.title : '';

            return (
                {
                    ...item,
                    province: provinceName,
                    district: districtName,
                    municipality: municipalityName,
                    wardNumber,
                }
            );
        });

        return (
            <Modal className={
                styles.contactFormModal

            }
            >

                {/* <ModalHeader
                    // title={'Add Contact'}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            // onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                /> */}
                <Translation>
                    {
                        t => (
                            <ModalBody className={_cs(styles.modalBody, language === 'np' && styles.languageFont)}>
                                {
                                    isValueCalculated
                                        ? (
                                            <div>
                                                <div className={styles.header}>
                                                    <div className={styles.headingCategories}>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={undefined}
                                                            className={!isDataSetClicked ? styles.visualization : ''}
                                                            onClick={() => this.setState({ isDataSetClicked: false })}
                                                        >
                                                            <h2>{t('VISUALIZATION')}</h2>
                                                        </div>
                                                        <div
                                                            style={{ marginLeft: '30px' }}
                                                            role="button"
                                                            tabIndex={0}
                                                            className={isDataSetClicked ? styles.visualization : ''}
                                                            onKeyDown={undefined}
                                                            onClick={() => this.setState({ isDataSetClicked: true })}
                                                        >
                                                            <h2>{t('DATASET')}</h2>
                                                        </div>

                                                    </div>

                                                    <DangerButton
                                                        transparent
                                                        iconName="close"
                                                        onClick={() => {
                                                            this.setState({ allDataNullConditionCheck: false });
                                                            closeVisualization(false,
                                                                checkedCategory, resourceType, level, lvl2catName, typeName);
                                                        }
                                                        }
                                                        title="Close Modal"
                                                        className={styles.closeButton}
                                                    />
                                                    {' '}

                                                </div>
                                                <div className={styles.categoryName}>
                                                    <div className={styles.categoryLogo}>
                                                        <ScalableVectorGraphics
                                                            className={styles.categoryLogoIcon}

                                                            src={selectedImage}
                                                        />
                                                        <h3>
                                                            {language === 'en'
                                                                ? visualizationHeading
                                                                : visualizationHeadingNe
                                                            }

                                                        </h3>
                                                    </div>
                                                    {/* <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                role="button"
                tabIndex={0}
            // eslint-disable-next-line max-len
                onClick={() => this.handleSaveClick('overallDownload')}
                onKeyDown={undefined}


            >
                <h4>DOWNLOAD</h4>
                {' '}
                <Button
                    title="Download Chart"
                    className={styles.chartDownload}
                    transparent
                    // onClick={() => this.handleSaveClick('overallDownload')}
                    iconName="download"
                />

            </div> */}
                                                </div>
                                                {isDataSetClicked
                                                    ? <TableData selectedResourceData={updatedSelectedResource} resourceType={resourceType} />
                                                    : (
                                                        <div id="overallDownload">
                                                            {GraphVisualizationData && GraphVisualizationData.map((item, i) => (
                                                                HighValuePercentageCalculation[i].highValuePercentage === 0 ? ''
                                                                    : (
                                                                        <div key={item.label}>
                                                                            <div className={styles.barChartSection}>

                                                                                <div className={styles.percentageValue}>
                                                                                    {/* <h1>Education Institution</h1> */}
                                                                                    <h1>
                                                                                        {HighValuePercentageCalculation[i].highValuePercentage}
                                                                                        %
                                                                                    </h1>

                                                                                    {HighValuePercentageCalculation[i].category !== HighValuePercentageCalculation[i].subCategoryName ? (
                                                                                        <>

                                                                                            {
                                                                                                language === 'en'
                                                                                                    ? (
                                                                                                        <span>
                                                                                                            {HighValuePercentageCalculation[i].category}
                                                                                                            {' '}
                                                                                                            are
                                                                                                            {' '}
                                                                                                            {HighValuePercentageCalculation[i].subCategoryName}
                                                                                                            {' '}
                                                                                                        </span>
                                                                                                    )
                                                                                                    : (
                                                                                                        <span>
                                                                                                            {HighValuePercentageCalculation[i].category}
                                                                                                            {' '}
                                                                                                            {HighValuePercentageCalculation[i].subCategoryName}
                                                                                                            {' '}
                                                                                                            छन
                                                                                                        </span>
                                                                                                    )

                                                                                            }


                                                                                        </>
                                                                                    ) : (

                                                                                        language === 'en'
                                                                                            ? (
                                                                                                <span>
                                                                                                    {' '}
                                                                                                    {HighValuePercentageCalculation[i].category}
                                                                                                    {''}
                                                                                                    are available

                                                                                                </span>
                                                                                            )
                                                                                            : (
                                                                                                <span>
                                                                                                    {' '}
                                                                                                    {HighValuePercentageCalculation[i].category}
                                                                                                    {''}
                                                                                                    उपलब्ध छन
                                                                                                </span>
                                                                                            )

                                                                                    )}

                                                                                </div>


                                                                                <div style={{ flex: '4' }} key={item.label}>

                                                                                    <div className={styles.graphicalVisualization}>

                                                                                        {/* <div style={{ display: 'flex',
                                                                        justifyContent: 'flex-end',
                                                                fontSize: '25px' }}
                                                            /> */}
                                                                                        <div id={labelName[i].label}>
                                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                                <h3>
                                                                                                    {
                                                                                                        language === 'en'
                                                                                                            ? labelName[i].label
                                                                                                            : labelName[i].labelNe}

                                                                                                </h3>
                                                                                                <Button
                                                                                                    title="Download Chart"
                                                                                                    className={styles.chartDownload}
                                                                                                    transparent
                                                                                                    onClick={() => this.handleSaveClick(labelName[i].label)}
                                                                                                    iconName="download"
                                                                                                />
                                                                                            </div>
                                                                                            <BarChartVisualization item={item} />
                                                                                        </div>

                                                                                    </div>

                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    )

                                                            ))}
                                                            {!pendingAPICall && (resourceCollection[resourceType]).length === 0
                                                                ? (
                                                                    <h2 style={{ textAlign: 'center' }}>
                                                                        {
                                                                            language === 'en'
                                                                                ? 'No Data Available for Visualization'
                                                                                : 'भिजुअलाइजेसनको लागि कुनै डाटा उपलब्ध छैन'

                                                                        }
                                                                    </h2>
                                                                )
                                                                : ''}
                                                            {allDataNullConditionCheck
                                                                ? (
                                                                    <h2 style={{ textAlign: 'center' }}>
                                                                        {
                                                                            language === 'en'
                                                                                ? 'No Data Available for Visualization'
                                                                                : 'भिजुअलाइजेसनको लागि कुनै डाटा उपलब्ध छैन'

                                                                        }
                                                                    </h2>
                                                                )
                                                                : ''}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : <LoadingAnimation className={styles.loader} />

                                }

                            </ModalBody>
                        )
                    }
                </Translation>


            </Modal>
        );
    }
}

// export default createRequestClient(requests)(DataVisualisation);
export default connect(mapStateToProps)(DataVisualisation);
