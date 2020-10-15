import {
    requiredCondition,
} from '@togglecorp/faram';
import { ResourceTypeKeys } from '#types';

type Schema = {
    [key in ResourceTypeKeys]: object;
};

const defaultFields = {
    resourceType: [requiredCondition],
    title: [requiredCondition],
    point: [],
    description: [],
    ward: [],
    location: [],
};

const schema: Schema = {
    education: {
        fields: {
            ...defaultFields,
            classroomCount: [],
            operatoryType: [],
            openingHours: [],
            phoneNumber: [],
            emailAddress: [],
            noOfEmployee: [],
            noOfStudent: [],
            type: [requiredCondition],
        },
    },
    health: {
        fields: {
            ...defaultFields,
            bedCount: [],
            cbsCode: [],
            phoneNumber: [],
            emailAddress: [],
            emergencyService: [],
            icu: [],
            nicu: [],
            operationTheater: [],
            xRay: [],
            ambulanceService: [],
            openingHours: [],
            operatorType: [],
            noOfStaffs: [],
            noOfBeds: [],
            specialization: [],
            type: [requiredCondition],
        },
    },
    finance: {
        fields: {
            ...defaultFields,
            cbsCode: [],
            population: [],
            channel: [],
            accessPointCount: [requiredCondition],
            type: [requiredCondition],
            phoneNumber: [],
            emailAddress: [],
            website: [],
            openingHours: [],
            operatorType: [],
            bankType: [],
            atmAvailable: [],
            placeAddress: [],
            network: [],
        },
    },
    tourism: {
        fields: {
            ...defaultFields,
            type: [requiredCondition],
        },
    },
    communication: {
        fields: {
            ...defaultFields,
            type: [requiredCondition],
            towersName: [],
            isp: [],
            operatorType: [],
            coverageRadius: [],
            offGridCellSites: [],
            phoneNumber: [],
            emailAddress: [],
            website: [],
            openingHours: [],
            frequency: [],
            internetType: [],
        },
    },
    governance: {
        fields: {
            ...defaultFields,
            type: [requiredCondition],
            phoneNumber: [],
            emailAddress: [],
            website: [],
            openingHours: [],
            noOfEmployee: [],
        },
    },
    industry: {
        fields: {
            ...defaultFields,
            type: [requiredCondition],
        },
    },
    cultural: {
        fields: {
            ...defaultFields,
            type: [requiredCondition],
            religion: [],
            phoneNumber: [],
            emailAddress: [],
            openingHours: [],
            drinkingWater: [],
            toilet: [],
        },
    },
    energy: {
        fields: {
            ...defaultFields,
        },
    },
    openspace: {
        fields: {
            ...defaultFields,
            issue: [],
            currentLandse: [],
            catchmentArea: [],
            ownership: [],
            elevation: [],
            acessToSite: [],
            specialFeature: [],
            image: [],
            shapeFile: [],

        },
    },
    communityspace: {
        fields: {
            ...defaultFields,
            currentLandUse: [],
            elevation: [],
            address: [],
            ward: [],
            capacity: [],
            totalArea: [],
            usableArea: [],
            coverImage: [],
            shapeFile: [],
        },
    },
};

export const defaultSchema = {
    fields: defaultFields,
};

export default schema;
