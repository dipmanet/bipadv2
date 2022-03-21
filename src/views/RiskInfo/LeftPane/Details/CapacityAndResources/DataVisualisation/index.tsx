/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-concat */
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
import Modal from '#rscv/Modal';

import ModalHeader from '#rscv/Modal/Header';

import ModalBody from '#rscv/Modal/Body';


import FullStepwiseRegionSelectInput, {
    RegionValuesAlt,
} from '#components/FullStepwiseRegionSelectInput';
import { districtsSelector, municipalitiesSelector, provincesSelector, wardsSelector } from '#selectors';

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
        chartDataType: [
            {
                label: 'Education Institutions',
                key: 'type',
                values: ['Preprimary', 'Basic Education', 'High School', 'College', 'University', 'Traditional Education', 'Library', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of education institutions',
                visualizationWordEnd: '',


            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Education institutions are ',
                visualizationWordEnd: ' run',
            },
            {
                label: 'Open Space ',
                key: 'hasOpenSpace',
                values: ['Open Space '],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Educational institutions with ',
                visualizationWordEnd: 'available',


            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Number of Students',
                key: ['noOfMaleStudent', 'noOfFemaleStudent', 'noOfOtherStudent'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of students ',
                visualizationWordEnd: '',
            },
            {
                label: 'Students with Disability',
                key: ['noOfDifferentlyAbledMaleStudents', 'noOfDifferentlyAbledFemaleStudents', 'noOfDifferentlyAbledOtherStudents'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled students ',
                visualizationWordEnd: '',

            },
        ],
    },

    {
        resourceType: 'finance',
        visualizationHeading: 'Banking and Finance Institution',
        chartDataType: [
            {
                label: 'Banking & Financial Institutions',
                key: 'type',
                values: ['Commercial', 'Micro Credit Development', 'Finance', 'Development Bank', 'Cooperative', 'Money Exchange', 'ATM'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of banking and financial institutions ',
                visualizationWordEnd: '',


            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Banking and Financial institutions are ',
                visualizationWordEnd: ' run',


            },
            // {
            //     label: 'Services Available',
            //     key: ['bank', 'moneyExchange', 'atm', 'hasOtherServices'],
            //     values: ['Bank', 'Money Exchange', 'ATM', 'Other Services'],
            //     isBoolean: true,
            //     visualizationKey: 'highestValue',
            //     visualizationWordStart: 'Banking and Financial institutions are ',
            //     visualizationWordEnd: 'run',

            // },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'communication',
        visualizationHeading: 'Communication Institution',
        chartDataType: [
            {
                label: 'communication Institutions Types',
                key: 'type',
                values: ['FM Radio', 'TV Station', 'Newspapers', 'Phone Service', 'Cable', 'Online Media', 'Internet Service Provider'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of communication facilities ',
                visualizationWordEnd: '',


            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Communication facilities are ',
                visualizationWordEnd: ' run',


            },

            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Disaster Management',
                key: 'hasEvacuationRoute',
                values: ['Evacuation route available '],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Institution have evacuation route ',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'governance',
        visualizationHeading: 'Government Institution',
        chartDataType: [
            {
                label: 'Government Institution Types',
                key: 'type',
                values: ['Government', 'INGO', 'NGO', 'CSO', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of governance institutions ',
                visualizationWordEnd: '',


            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Institutions are ',
                visualizationWordEnd: ' run',
            },
            // {
            //     label: 'Helipad ',
            //     key: 'hasHelipad',
            //     values: ['Helipad '],
            //     isBoolean: true,
            //     visualizationKey: 'total',
            //     visualizationWordStart: 'Number of governance institutions ',
            //     visualizationWordEnd: '',

            // },
            // {
            //     label: 'Open Space ',
            //     key: 'hasOpenSpace',
            //     values: ['Open Space '],
            //     isBoolean: true,

            // },

            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Governance institutions with ',
                key: ['hasHelipad', 'hasOpenSpace', 'hasEvacuationRoute', 'hasDisasterMgmtUnit'],
                values: ['Helipad Available', 'Open Space Available', 'Evacuation Route Available', 'Disaster Management Unit Available'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Governance institutions with ',
                visualizationWordEnd: ' available',

            },


        ],
    },
    {
        resourceType: 'hotelandrestaurant',
        visualizationHeading: 'Hotel & Restaurant',
        chartDataType: [
            {
                label: 'Hotel & Restaurant Types',
                key: 'type',
                values: ['Hotel', 'Restaurant', 'Lodge', 'Resort', 'Homestay'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of hotel and restaurants ',
                visualizationWordEnd: '',
            },

            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Hotel and Restaurants with',
                key: ['noOfRoom', 'noOfBed'],
                values: ['Rooms Available', 'Beds Available'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: '',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'cultural',
        visualizationHeading: 'Cultural Sites',
        chartDataType: [
            {
                label: 'Religions',
                key: 'religion',
                values: ['Hindu', 'Islam', 'Christian', 'Buddhist', 'Kirat', 'Sikhism', 'Judaism', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of cultural sites ',
                visualizationWordEnd: '',
            },
            {
                label: 'Cultural site with ',
                key: ['hasOpenSpace', 'drinkingWater', 'toilet', 'hasWashFacility', 'hasSleepingFacility', 'hasElectricity'],
                values: ['Open Space', 'Drinking Water Available', 'Toilet Available', 'Wash Facility Available', 'Sleeping Facility Available', 'Electricity Facility Available'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Cultural sites with ',
                visualizationWordEnd: ' available',

            },


            // {
            //     label: 'Open Space ',
            //     key: 'hasOpenSpace',
            //     values: ['Open Space '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Drinking Water Available ',
            //     key: 'drinkingWater',
            //     values: ['Drinking Water '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Toilet Available ',
            //     key: 'toilet',
            //     values: ['Toilet '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Wash Facility Available ',
            //     key: 'hasWashFacility',
            //     values: ['Wash Facility '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Sleeping Facility Available ',
            //     key: 'hasSleepingFacility',
            //     values: ['Sleeping Facility '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Electricity Facility Available ',
            //     key: 'hasElectricity',
            //     values: ['Electricity Facility '],
            //     isBoolean: true,

            // },


        ],
    },
    {
        resourceType: 'industry',
        visualizationHeading: 'Industries',
        chartDataType: [
            {
                label: 'Industry Types',
                key: 'subtype',
                values: ['Cottage Industry', 'Micro Industry', 'Small Industry', 'Medium Industry', 'Large Industry', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of industries ',
                visualizationWordEnd: '',
            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Industries are ',
                visualizationWordEnd: ' run',
            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Industries with  ',
                key: 'hasEvacuationRoute',
                values: ['Evacuation route available '],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Industries have evacuation route ',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'bridge',
        visualizationHeading: 'Bridges',
        chartDataType: [
            {
                label: 'Bridge Types',
                key: 'type',
                values: ['Arch', 'Beam', 'Cantilever', 'Wooden', 'Suspension', 'Cable-stayed', 'Culvert', 'Bailey', 'Truss', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of bridges ',
                visualizationWordEnd: '',
            },

            // {
            //     label: 'Operator Type',
            //     key: 'operatorType',
            //     values: ['Government', 'Private', 'Community', 'Other'],
            //     isBoolean: false,
            //     showFalseValue: false,
            // },
            {
                label: 'Motorable Bridge ',
                key: ['isMotorable'],
                values: ['Motorable Bridge '],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of Motorable bridges ',
                visualizationWordEnd: '',

            },
            {
                label: 'Condition ',
                key: 'condition',
                values: ['Good ', 'Bad'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Bridges in ',
                visualizationWordEnd: ' condition',

            },


        ],
    },
    {
        resourceType: 'electricity',
        visualizationHeading: 'Electricity',
        chartDataType: [
            {
                label: 'Electricity Components',
                key: 'components',
                values: ['Hydropower', 'Substation', 'Dam', 'Transmission Pole', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: '',
                visualizationWordEnd: '',
            },
        ],
    },
    {
        resourceType: 'sanitation',
        visualizationHeading: 'Sanitation Service',
        chartDataType: [
            {
                label: 'Type of Sanitation Infrastructures',
                key: 'type',
                values: ['Landfill', 'Dumping Site', 'Public Toilet'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of sanitation infrastructures',
                visualizationWordEnd: '',
            },
            {
                label: 'Permanent Infrastructures',
                key: 'type',
                values: ['Landfill', 'Dumping Site'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: '',
                visualizationWordEnd: ' are permanent',
            },
            {
                label: 'Public Toilets',
                key: ['noOfMaleToilets', 'noOfFemaleToilets', 'noOfCommonToilets'],
                values: ['Male Toilet', 'Female Toilet', 'Common Toilet'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Public toilets available',
                visualizationWordEnd: '',

            },
            // {
            //     label: 'Permanent Landfill',
            //     key: ['isPermanent'],
            //     values: ['Permanent Landfill '],
            //     isBoolean: true,

            // },

        ],
    },
    {
        resourceType: 'openspace',
        visualizationHeading: 'Open Space',
        chartDataType: [

            {
                label: 'Open Space Area Details(Sq Km)',
                key: ['totalArea', 'usableArea', 'usableAreaSecond'],
                values: ['Total Area', 'Usable Area', 'Alternate Usable Area'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of sanitation infrastructures',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'communityspace',
        visualizationHeading: 'Community Space',
        chartDataType: [

            // {
            //     label: 'Community Space Area Details(Sq Km)',
            //     key: ['capacity'],
            //     values: ['Capacity of Community Space'],
            //     isBoolean: false,
            //     visualizationKey: 'total',
            //     visualizationWordStart: 'Number of sanitation infrastructures',
            //     visualizationWordEnd: '',

            // },
            {
                label: 'Number of community spaces',
                key: 'resourceType',
                values: ['communityspace'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of community spaces',
                visualizationWordEnd: '',
            },
            {
                label: 'Community Space with ',
                key: ['usedAsHelipad', 'isDrinkingWaterAvailable', 'isToiletAvailable'],
                values: ['Emergency Landing', 'Drinking water facility available', 'Toilet available'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Community space with ',
                visualizationWordEnd: '',
            },


        ],
    },

    {
        resourceType: 'watersupply',
        visualizationHeading: 'Water Supply Infrastructure',
        chartDataType: [
            {
                label: 'Water Supply Infrastructure Scales',
                key: 'scale',
                values: ['Small', 'Medium', 'Large'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of water supply infrastructures',
                visualizationWordEnd: '',
            },
            {
                label: 'Operator Type',
                key: 'operatorType',
                values: ['Government', 'Private', 'Community', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Water supply infrastructures are ',
                visualizationWordEnd: ' run',
            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees',
                visualizationWordEnd: '',

            },
            {
                label: 'Water Supply Infrastructure',
                key: 'isWaterSupplyOperational',
                values: ['Operational', 'Not operational'],
                isBoolean: true,
                showFalseValue: true,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Water supply infrastructures are ',
                visualizationWordEnd: '',
            },
            // {
            //     label: 'Technical Staff',
            //     key: ['hasTechnicalStaff'],
            //     values: ['Technical Staff '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Operational Water Supply Infrastructure',
            //     key: ['isWaterSupplyOperational'],
            //     values: ['Operational Water Supply Infrastructure '],
            //     isBoolean: true,

            // },


        ],
    },
    {
        resourceType: 'roadway',
        visualizationHeading: 'Roadways',
        chartDataType: [
            {
                label: 'Types of Vehicles',
                key: 'kindOfVehicle',
                values: ['Bus', 'Micro', 'Van', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of vehicles',
                visualizationWordEnd: '',
            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees',
                visualizationWordEnd: '',

            },
            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees',
                visualizationWordEnd: '',
            },
        ],
    },
    {
        resourceType: 'helipad',
        visualizationHeading: 'Helipad',
        chartDataType: [
            {
                label: 'Helipad Ownership',
                key: 'ownership',
                values: ['Civil Aviation Authority of Nepal', 'Nepal Army', 'Nepal Police', 'Armed Police Force', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of Helipad',
                visualizationWordEnd: '',
            },
            {
                label: 'Surface Type of Helipad',
                key: 'surfaceType',
                values: ['Concrete', 'Grass land', 'Dirt surface', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Helipads have ',
                visualizationWordEnd: ' surface',
            },

            {
                label: 'Helipad with ',
                key: ['hasRoadAccess', 'storageFacilityAvailable', 'internetFacilityAvailable', 'windDirectionIndicatorAvailable', 'heliMarkerAvailable', 'nightLightingAvailable'],
                values: ['Road Access', 'Storage facility available', 'Internet service is available', 'Wind Direction Indicator Available', 'Heli Marker Available', 'Night Lighting Available'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Helipads have ',
                visualizationWordEnd: '',
            },


            {
                label: 'Condition of Helipad',
                key: 'helipadCondition',
                values: ['Operational', 'Need Repair', 'Not in working condition'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Helipads are ',
                visualizationWordEnd: '',
            },

            // {
            //     label: 'Wind Direction Indicator Available',
            //     key: 'windDirectionIndicatorAvailable',
            //     values: ['Wind Direction Indicator Available'],
            //     isBoolean: true,
            // },
            // {
            //     label: 'Heli Marker Available ',
            //     key: 'heliMarkerAvailable',
            //     values: ['Heli Marker Available '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Night Lighting Available',
            //     key: 'nightLightingAvailable',
            //     values: ['Night Lighting Available'],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Number of Employees',
            //     key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
            //     values: ['Male', 'Female', 'Other'],
            //     isBoolean: false,

            // },

            // {
            //     label: 'Employees with Disability',
            //     key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
            //     values: ['Male', 'Female', 'Other'],
            //     isBoolean: false,

            // },

        ],
    },
    {
        resourceType: 'waterway',
        visualizationHeading: 'Waterway',
        chartDataType: [
            {
                label: 'Types of waterways',
                key: 'type',
                values: ['General Boat', 'Electrical Boat', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of waterways ',
                visualizationWordEnd: '',
            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Condition of Boat',
                key: 'condition',
                values: ['Good', 'Bad'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Waterways in ',
                visualizationWordEnd: ' condition ',
            },

        ],
    },
    {
        resourceType: 'airway',
        visualizationHeading: 'Airway',
        chartDataType: [
            {
                label: 'Types of airways',
                key: 'type',
                values: ['National', 'International'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of airways ',
                visualizationWordEnd: '',
            },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Airways with  ',
                key: ['hasEvacuationRoute', 'hasHumanitarianStagingArea'],
                values: ['Evacuation route available ', 'Humanitarian staging area'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Airways with ',
                visualizationWordEnd: '',

            },


        ],
    },
    {
        resourceType: 'fireengine',
        visualizationHeading: 'Fire Engine',
        chartDataType: [
            {
                label: 'Condition of fire engine',
                key: 'condition',
                values: ['Operational', 'Need Repair', 'Not in working condition'],
                isBoolean: false,
            },


        ],
    },
    {
        resourceType: 'firefightingapparatus',
        visualizationHeading: 'Fire Fighting Apparatus',
        chartDataType: [
            {
                label: 'Type of Fire Fighting Apparatus',
                key: 'type',
                values: ['Fire Engine', 'Fire Bike', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of fire fighting apparatus ',
                visualizationWordEnd: '',
            },
            {
                label: 'Condition of fire fighting apparatus',
                key: 'condition',
                values: ['Operational', 'Need Repair', 'Not in working condition'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Fire fighting apparatus are ',
                visualizationWordEnd: '',
            },
            {
                label: 'Operator Type of fire fighting apparatus',
                key: 'operatorType',
                values: ['Private', 'Government', 'Community'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Fire fighting apparatus are ',
                visualizationWordEnd: ' run',
            },


        ],
    },
    {
        resourceType: 'evacuationcentre',
        visualizationHeading: 'Evacuation Center',
        chartDataType: [
            {
                label: 'Government Institution Types',
                key: 'operatedBy',
                values: ['Government', 'INGO', 'NGO', 'CSO'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of evacuation centers ',
                visualizationWordEnd: '',


            },
            {
                label: 'Structure',
                key: 'structure',
                values: ['Single story', 'Multiple story'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Evacuation centers are ',
                visualizationWordEnd: '',


            },
            {
                label: 'Capacity of evacuation center',
                key: ['capacity'],
                values: ['Capacity'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Maximum capacity  ',
                visualizationWordEnd: '',

            },
            {
                label: 'Evacuation center with  ',
                key: ['hasEvacuationRoute', 'hasDrinkingWater', 'hasToilet', 'hasHandWashingFacility', 'hasFoodPreparationFacility', 'hasSleepingFacility'],
                values: ['Evacuation Route', 'Drinking Water Facility', 'Toilet Facility', 'Wash Facility', 'Food Preparation Facility', 'Sleeping Facility'],
                isBoolean: true,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: '',
                visualizationWordEnd: ' are available ',

            },


            // {
            //     label: 'Drinking Water Available ',
            //     key: 'hasDrinkingWater',
            //     values: ['Drinking Water '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Toilet Available ',
            //     key: 'hasToilet',
            //     values: ['Toilet '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Wash Facility Available ',
            //     key: 'hasHandWashingFacility',
            //     values: ['Wash Facility '],
            //     isBoolean: true,

            // },
            // {
            //     label: 'Sleeping Facility Available ',
            //     key: 'hasSleepingFacility',
            //     values: ['Sleeping Facility '],
            //     isBoolean: true,

            // },


        ],
    },
    {
        resourceType: 'health',
        visualizationHeading: 'Health Institution Category',
        chartDataType: [

            {
                label: 'Health Institutions Types',
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
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of health infrastructures ',
                visualizationWordEnd: '',
            },

            {
                label: 'Services Available',
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
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: '',
                visualizationWordEnd: ' available',

            },
            // {
            //     label: 'Surgical Service',
            //     key: ['hasCaesarianSection', 'hasGastrointestinal', 'hasTraumaSurgery', 'hasCardiacSurgery',
            //         'hasNeuroSurgery', 'hasPlasticSurgery'],
            //     values: ['Caesarian Section', 'Gastro Intestinal', 'Trauma Surgery', 'Cardiac Surgery', 'Neuro Surgery', 'Plastic Surgery'],
            //     isBoolean: false,

            // },
            // {
            //     label: 'Specialized Service',
            //     key: ['hasIcu', 'hasCcu', 'hasNicu', 'hasMicu', 'hasSncu', 'hasPicu'],
            //     values: ['ICU', 'CCU', 'NICU', 'MICU', 'SNCU', 'PICU'],
            //     isBoolean: false,

            // },
            {
                label: 'Bed Capacity',
                key: ['hospitalBedCount', 'icuBedCount', 'ventilatorBedCount'],
                values: ['Hospital Bed', 'ICU Bed', 'Ventilator Bed'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of beds ',
                visualizationWordEnd: '',

            },
            // {
            //     label: 'Helipad Available',
            //     key: ['hasHelipad'],
            //     values: ['Helipad Available'],
            //     isBoolean: false,

            // },
            // {
            //     label: 'Open Space Available',
            //     key: ['hasOpenSpace'],
            //     values: ['Open Space Available'],
            //     isBoolean: false,

            // },
            {
                label: 'Number of Employees',
                key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Number of employees ',
                visualizationWordEnd: '',

            },

            {
                label: 'Employees with Disability',
                key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
                values: ['Male', 'Female', 'Other'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'total',
                visualizationWordStart: 'Differently abled employees ',
                visualizationWordEnd: '',

            },
            {
                label: 'Health infrastructures with ',
                key: ['hasHelipad', 'hasOpenSpace', 'hasEvacuationRoute'],
                values: ['Helipad Available', 'Open Space Available', 'Evacuation Route Available'],
                isBoolean: false,
                showFalseValue: false,
                visualizationKey: 'highestValue',
                visualizationWordStart: 'Health infrastructures with ',
                visualizationWordEnd: ' available',

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
        if (!pendingAPICall) {
            const resourceDataList = resourceCollection[resourceType];

            this.setState({
                selectedResourceData: resourceDataList,
            });
            const GraphVisualizationData = await visualizationKeyValues
                .filter(item => item.resourceType === resourceType)[0].chartDataType
                .map((datakey) => {
                    const datam = this.getResourceDataForVisualization(resourceType, datakey.key,
                        datakey.isBoolean, datakey.values, datakey.showFalseValue);
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
    }

    public async componentDidUpdate(prevProps, prevState) {
        const { resourceCollection, resourceType, pendingAPICall } = this.props;
        const { isValueCalculated } = this.state;
        if (!pendingAPICall) {
            const resourceDataList = resourceCollection[resourceType];

            this.setState({
                selectedResourceData: resourceDataList,
            });

            const GraphVisualizationData = await visualizationKeyValues
                .filter(item => item.resourceType === resourceType)[0].chartDataType
                .map((datakey) => {
                    const datam = this.getResourceDataForVisualization(resourceType, datakey.key,
                        datakey.isBoolean, datakey.values, datakey.showFalseValue);
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
    }

    private getResourceDataForVisualization = (resourceType, key, isBoolean, label, showFalseValue) => {
        const { selectedResourceData } = this.state;
        let filteredResourceChartDataType;
        let calculatedValueData;
        let filterDataForCalculation;
        let filterDataForFalseValue;
        if (typeof key === 'string') {
            filteredResourceChartDataType = visualizationKeyValues
                .filter(item => item.resourceType === resourceType)[0].chartDataType
                .filter(dat => dat.key === key)[0].values;
            calculatedValueData = filteredResourceChartDataType.map((item, i) => {
                filterDataForCalculation = selectedResourceData.filter(d => d[key] === item);

                if (isBoolean) {
                    filterDataForCalculation = selectedResourceData.filter(d => d[key] === true);
                }
                if (isBoolean && showFalseValue) {
                    filterDataForFalseValue = selectedResourceData.filter(d => d[key] === false);
                }
                const obj = {};
                obj.label = item;
                obj.value = item === 'Not operational' ? filterDataForFalseValue.length : filterDataForCalculation.length;
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
                obj.label = label[i];
                obj.value = filterDataForCalculation;
                obj.color = '#1A70AC';
                // obj[`${label[i]}`] = filterDataForCalculation;
                return obj;
            });
        }
        const dataDisplayFromHighestValue = calculatedValueData.sort((a, b) => b.value - a.value);


        return dataDisplayFromHighestValue;
    }

    private HighValuePercentageCalculation = (value) => {
        const { resourceType } = this.props;
        const labelName = visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType;
        const HighestValue = value.map((item, i) => {
            const highValueObject = item.reduce((a, b) => (a.value > b.value ? a : b));

            const totalSum = item.reduce((a, b) => a + b.value || 0, 0);


            const highValuePercentage = totalSum === 0 ? 0 : ((highValueObject.value / totalSum) * 100).toFixed(2);

            const subCategoryName = labelName[i].label;
            const { visualizationKey, visualizationWordStart, visualizationWordEnd } = labelName[i];
            const displayingValueinVisualization = visualizationKey === 'total' ? totalSum : highValueObject.value;
            const displayVisualizationWord = visualizationKey === 'total'
                ? `${visualizationWordStart}${visualizationWordEnd ? `${visualizationWordEnd}` : ''}`
                : `${visualizationWordStart}` + `${highValueObject.label}` + `${visualizationWordEnd}`;
            return ({
                category: subCategoryName,
                subCategoryName: highValueObject.label,
                highValuePercentage,
                totalSum,
                highestValue: highValueObject.value,
                visualizationKey,
                displayingValueinVisualization,
                displayVisualizationWord,
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
            resourceType, level, lvl2catName, typeName,
            resourceCollection, selectedCategoryName,
            wards, provinces, districts, municipalities, pendingAPICall, ErrorData } = this.props;
        const { GraphVisualizationData, isValueCalculated, isDataSetClicked, selectedResourceData, allDataNullConditionCheck } = this.state;


        const labelName = visualizationKeyValues
            .filter(item => item.resourceType === resourceType)[0].chartDataType;

        const HighValuePercentageCalculation = this.HighValuePercentageCalculation(GraphVisualizationData);

        const { visualizationHeading } = visualizationKeyValues
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
        console.log('What resource collection', resourceCollection);
        console.log('Graph visualization data', GraphVisualizationData);
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
                <ModalBody className={styles.modalBody}>

                    {!pendingAPICall && isValueCalculated
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
                                            <h2>VISUALIZATION</h2>
                                        </div>
                                        <div
                                            style={{ marginLeft: '30px' }}
                                            role="button"
                                            tabIndex={0}
                                            className={isDataSetClicked ? styles.visualization : ''}
                                            onKeyDown={undefined}
                                            onClick={() => this.setState({ isDataSetClicked: true })}
                                        >
                                            <h2>DATASET</h2>
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
                                        <h3>{visualizationHeading}</h3>
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
                                {ErrorData ? <h2 style={{ textAlign: 'center' }}>{ErrorData}</h2> : isDataSetClicked
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
                                                                        {HighValuePercentageCalculation[i].displayingValueinVisualization}

                                                                    </h1>

                                                                    <span>

                                                                        {HighValuePercentageCalculation[i].displayVisualizationWord}
                                                                    </span>

                                                                </div>


                                                                <div style={{ flex: '4' }} key={item.label}>

                                                                    <div className={styles.graphicalVisualization}>

                                                                        {/* <div style={{ display: 'flex',
                                                                            justifyContent: 'flex-end',
                                                                    fontSize: '25px' }}
                                                                /> */}
                                                                        <div id={labelName[i].label}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <h3>{labelName[i].label}</h3>
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
                                                ? <h2 style={{ textAlign: 'center' }}>No Data Available for Visualization</h2>
                                                : ''}
                                            {allDataNullConditionCheck
                                                ? <h2 style={{ textAlign: 'center' }}>No Data Available for Visualization</h2>
                                                : ''}
                                        </div>
                                    )}
                            </div>
                        ) : <LoadingAnimation className={styles.loader} />

                    }

                </ModalBody>
            </Modal>
        );
    }
}

// export default createRequestClient(requests)(DataVisualisation);
export default connect(mapStateToProps)(DataVisualisation);
