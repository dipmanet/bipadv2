/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect, useCallback } from 'react';

const optionArray = [
    'hasAgricultureLivestock',
    'isLabour',
    'isBusiness',
    'isFemaleHeadedHousehold',
    'isForeignEmployment',
    'isOtherJob',
    'hasLivelihoodAffect',
    'hasHouseDamage',
    'hasLossOfFamilyMembers',
    'hasAccessToDrinkingWater',
    'hasAccessToDrinkingWaterDuringFlood',
    'hasAccessToEarlyWarningInformation',
    'hasInvolvmentToCommunityGroup',
    'hasAccessToFinancialServices',
    'hasAvailabilityOfSocialSecurity',
];

export const useFormValidation = (
    editedState,
    initialState,
    validationSchemaObject,
    handleSend,
) => {
    const [state, setState] = useState(initialState);
    const [disable, setDisable] = useState(true);

    const validateState = useCallback(() => {
        const hasError = Object.keys(validationSchemaObject).some((key) => {
            const isInputRequired = validationSchemaObject[key].required;
            const stateValue = state[key] && state[key].value;
            const stateError = state[key] && state[key].error;
            return isInputRequired && (!stateValue || stateError);
        });
        return hasError;
    }, [state, validationSchemaObject]);

    useEffect(() => {
        setDisable(validateState());
    }, [validateState]);

    useEffect(() => {
        if (editedState.data && Object.keys(editedState.data).length > 0) {
            setState(editedState.data);
        }
    }, [editedState]);

    const handleChange = ({ target }) => {
        const { name, value } = target;

        const field = validationSchemaObject[name];
        let error = '';

        if (field.required) {
            if (!value) {
                error = 'This field is required.';
            } else if (field.doValidation) {
                if (!field.validator.regEx.test(value)) {
                    error = field.validator.error;
                }
            }
        }

        if (!field.required) {
            if (field.doValidation) {
                if (!field.validator.regEx.test(value)) {
                    error = field.validator.error;
                }
            }
        }

        const nameKeyStaticData = Object.keys(initialState).filter(init => init === name);
        setState(prevState => ({
            ...prevState,
            [name]: { ...prevState[nameKeyStaticData[0]], value, error, name: [name] },
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();


        if (!validateState()) {
            handleSend();
        }
    };

    const handleReset = () => {
        setState(initialState);
    };

    return { state, disable, handleChange, handleSubmit, handleReset };
};

const getOption = (opt) => {
    const filteredOpt = optionArray.filter(optItem => optItem === opt);
    return filteredOpt[0];
};
export const getOptions = (paramForOption) => {
    switch (paramForOption) {
        case getOption(paramForOption):
            return ['Yes', 'No'];

        case 'distanceOfSafeShelter':
            return [
                '<10 mins',
                '(10-30) mins',
                '(30-60) mins',
                '> 1 hr',
            ];

        case 'vicinityToRivers':
            return [
                '100m',
                '100-500 meters',
                '500 meters-1 km',
                'more than 1km',
            ];
        case 'floodImpactInThirtyYears':
            return [
                '1-2 times',
                '3-4 times',
                '5-6 times',
                '7-8 times',
                'more than 9 times',
            ];
        case 'houseTypeRoof':
            return [
                'Lightweight roof made up of grass/hay, mud, wood, plastic, etc.',
                'roof made up of heavy materials like tiles, slate, tin, etc.',
                'roofs made up of bricks, stones, and concrete.',
            ];
        case 'houseTypeWall':
            return [
                'Wall made up of local stones and rural structure (mud, bamboo, brick, etc.)',
                'Wall made up of bricks, block, prefab, metal, tin, etc.',
                'Retrofitted, well-constructed walls',
            ];
        case 'annualIncome':
            return [
                'less than 40 thousand',
                '40 - 60 thousand',
                '60 thousand - 1 lakh',
                'more than 1 lakh',
            ];
        case 'incomeSource':
            return [
                'Agriculture/ livestock',
                'Daily labor',
                'Business',
                'Foreign Employment',
                'others',
            ];
        case 'educationLevel':
            return [
                'Uneducated',
                'Literate',
                'Grade 5',
                'Higher Secondary',
                'Bachelors',
            ];
        default:
            return [];
    }
};

const isLatitude = RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}/g);
const isLongitude = RegExp(/^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g);
const isText = RegExp(/^[A-Z ]{3,}$/i);
const isPhone = RegExp(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/);

export const validationShcema = {
    latitude: {
        required: true,
        doValidation: false,
        validator: {
            regEx: isLatitude,
            error: 'Please provide a valid latitude',
        },
    },
    longitude: {
        required: true,
        doValidation: false,
        validator: {
            regEx: isLongitude,
            error: 'Please provide a valid longitude',
        },
    },
    houseId: {
        required: false,
        doValidation: false,
    },
    householdName: {
        required: false,
        doValidation: true,
        validator: {
            regEx: isText,
            error: 'Please provide a valid name',
        },
    },
    householdContactNumber: {
        required: false,
        doValidation: true,
        validator: {
            regEx: isPhone,
            error: 'Please provide a valid phone number',
        },
    },
    altitude: {
        required: false,
        doValidation: false,
    },
    precision: {
        required: false,
        doValidation: false,
    },
    localUnit: {
        required: false,
        doValidation: false,
    },
    male: {
        required: false,
        doValidation: false,
    },
    female: {
        required: false,
        doValidation: false,
    },
    lessThanFive: {
        required: false,
        doValidation: false,
    },
    fiveToTwelve: {
        required: false,
        doValidation: false,
    },
    thirteenToEighteen: {
        required: false,
        doValidation: false,
    },
    nineteenToThirty: {
        required: false,
        doValidation: false,
    },
    thirtyToFifty: {
        required: false,
        doValidation: false,
    },
    fiftyoneToSeventy: {
        required: false,
        doValidation: false,
    },
    greaterThanSeventy: {
        required: false,
        doValidation: false,
    },
    numberOfChildren: {
        required: false,
        doValidation: false,
    },
    numberOfElderly: {
        required: false,
        doValidation: false,
    },
    numberOfPregnantLactating: {
        required: false,
        doValidation: false,
    },
    numberOfDisabled: {
        required: false,
        doValidation: false,
    },
    isFemaleHeadedHousehold: {
        required: false,
        doValidation: false,
    },
    incomeSource: {
        required: false,
        doValidation: false,
    },
    hasAgricultureLivestock: {
        required: false,
        doValidation: false,
    },
    isLabour: {
        required: false,
        doValidation: false,
    },
    isBusiness: {
        required: false,
        doValidation: false,
    },
    isForeignEmployment: {
        required: false,
        doValidation: false,
    },
    isOtherJob: {
        required: false,
        doValidation: false,
    },
    otherJob: {
        required: false,
        doValidation: false,
    },
    annualIncome: {
        required: false,
        doValidation: false,
    },
    houseTypeWall: {
        required: false,
        doValidation: false,
    },
    houseTypeRoof: {
        required: false,
        doValidation: false,
    },
    floodImpactInThirtyYears: {
        required: false,
        doValidation: false,
    },
    hasLivelihoodAffect: {
        required: false,
        doValidation: false,
    },
    hasHouseDamage: {
        required: false,
        doValidation: false,
    },
    hasLossOfFamilyMembers: {
        required: false,
        doValidation: false,
    },
    vicinityToRivers: {
        required: false,
        doValidation: false,
    },
    hasAccessToDrinkingWater: {
        required: false,
        doValidation: false,
    },
    hasAccessToDrinkingWaterDuringFlood: {
        required: false,
        doValidation: false,
    },
    hasAccessToEarlyWarningInformation: {
        required: false,
        doValidation: false,
    },
    hasInvolvmentToCommunityGroup: {
        required: false,
        doValidation: false,
    },
    hasAccessToFinancialServices: {
        required: false,
        doValidation: false,
    },
    educationLevel: {
        required: false,
        doValidation: false,
    },
    hasAvailabilityOfSocialSecurity: {
        required: false,
        doValidation: false,
    },
    distanceOfSafeShelter: {
        required: false,
        doValidation: false,
    },
    // family_size: {
    //     required: false,
    //     doValidation: false,
    // },
    // dependent_population: {
    //     required: false,
    //     doValidation: false,
    // },
    // house_type: {
    //     required: false,
    //     doValidation: false,
    // },
    // social_assistance: {
    //     required: false,
    //     doValidation: false,
    // },
    // owner_name: {
    //     required: false,
    //     doValidation: true,
    //     validator: {
    //         regEx: isText,
    //         error: 'Please provide a valid name',
    //     },
    // },
    // phone_number: {
    //     required: false,
    //     doValidation: true,
    //     validator: {
    //         regEx: isPhone,
    //         error: 'Please provide a valid phone number',
    //     },
    // },
    // citizenship_number: {
    //     required: false,
    //     doValidation: false,
    // },
};

export const stateShcema = {
    latitude: {
        value: '',
        error: '',
        label: 'Latitude',
        type: 'number',
    },
    longitude: {
        value: '',
        error: '',
        label: 'Longitude',
        type: 'number',
    },
    houseId: {
        value: null,
        error: '',
        label: 'House Id',
        placeholder: 'Enter your house id',
        inputType: 'input',
        view: 'private',
    },
    householdName: {
        value: null,
        error: '',
        label: 'Household Name',
        type: 'text',
        placeholder: 'Enter your name',
        inputType: 'input',
        view: 'private',
    },
    householdContactNumber: {
        value: null,
        error: '',
        label: 'Household Contact Number',
        type: 'number',
        placeholder: 'Enter your contact number',
        inputType: 'input',
        view: 'private',
    },
    altitude: {
        value: null,
        error: '',
        label: 'Altitude',
        type: 'number',
        placeholder: 'Enter altitude',
        inputType: 'input',
    },
    localUnit: {
        value: null,
        error: '',
        label: 'Municipality',
        type: 'text',
        placeholder: 'Enter your municipality',
        inputType: 'input',
    },
    male: {
        value: null,
        error: '',
        label: 'No of Male',
        type: 'number',
        placeholder: 'Enter no of male in house',
        inputType: 'input',
    },
    female: {
        value: null,
        error: '',
        label: 'No of Female',
        type: 'number',
        placeholder: 'Enter no of female in house',
        inputType: 'input',
    },
    lessThanFive: {
        value: null,
        error: '',
        label: 'Family members of age less than 5',
        type: 'number',
        placeholder: 'Enter family members of age less than 5',
        inputType: 'input',
    },
    fiveToTwelve: {
        value: null,
        error: '',
        label: 'Family members of age between 5 to 12',
        type: 'number',
        placeholder: 'Enter family members of age 5 to 12',
        inputType: 'input',
    },
    thirteenToEighteen: {
        value: null,
        error: '',
        label: 'Family members of age between 13 to 18',
        type: 'number',
        placeholder: 'Enter family members of age 13 to 18',
        inputType: 'input',
    },
    nineteenToThirty: {
        value: null,
        error: '',
        label: 'Family members of age between 19 to 30',
        type: 'number',
        placeholder: 'Enter family members of age 19 to 30',
        inputType: 'input',
    },
    thirtyToFifty: {
        value: null,
        error: '',
        label: 'Family members of age between 30 to 50',
        type: 'number',
        placeholder: 'Enter family members of age between 30 to 50',
        inputType: 'input',
    },
    fiftyoneToSeventy: {
        value: null,
        error: '',
        label: 'Family members of age between 50 to 70',
        type: 'number',
        placeholder: 'Enter family members of age between 50 to 70',
        inputType: 'input',
    },
    greaterThanSeventy: {
        value: null,
        error: '',
        label: 'Family members of age greater than 70',
        type: 'number',
        placeholder: 'Enter family members of age greater than 70',
        inputType: 'input',
    },
    numberOfChildren: {
        value: null,
        error: '',
        label: 'Number of Children',
        type: 'number',
        placeholder: 'Enter your number of childrens',
        inputType: 'input',
    },
    numberOfElderly: {
        value: null,
        error: '',
        label: 'Number of Elderly',
        type: 'number',
        placeholder: 'Enter your number of elderly',
        inputType: 'input',
    },
    numberOfPregnantLactating: {
        value: null,
        error: '',
        label: 'Number of Pregnant Lactating',
        placeholder: 'Enter number of pregnant women',
        type: 'number',
        inputType: 'input',
    },
    numberOfDisabled: {
        value: null,
        error: '',
        label: 'Number of Disabled',
        placeholder: 'Enter number of specially abled people in your house',
        type: 'number',
        inputType: 'input',
    },
    isFemaleHeadedHousehold: {
        value: null,
        error: '',
        label: 'Female Headed Household',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    incomeSource: {
        value: null,
        error: '',
        label: 'Income Source',
        type: 'text',
        placeholder: 'Enter your source of income',
        inputType: 'input',
        // view: 'private',
    },
    hasAgricultureLivestock: {
        value: null,
        error: '',
        label: 'Agriculture Livestock',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    isLabour: {
        value: null,
        error: '',
        label: 'Labour',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    isBusiness: {
        value: null,
        error: '',
        label: 'Business',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    isForeignEmployment: {
        value: null,
        error: '',
        label: 'Foreign Employment',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    isOtherJob: {
        value: null,
        error: '',
        label: 'Other Job',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    otherJob: {
        value: null,
        error: '',
        label: 'Your Other Job',
        type: 'text',
        placeholder: 'Enter your job type',
        inputType: 'input',
        parent: 'isOtherJob',
    },
    annualIncome: {
        value: null,
        error: '',
        label: 'Annual Income',
        type: 'number',
        placeholder: 'Select range of annual income',
        inputType: 'select',
    },
    houseTypeWall: {
        value: null,
        error: '',
        label: 'House Type Wall',
        placeholder: 'Select type of wall of your house',
        inputType: 'select',
    },
    houseTypeRoof: {
        value: null,
        error: '',
        label: 'House Type Roof',
        placeholder: 'Select type of roof of your house',
        inputType: 'select',
    },
    floodImpactInThirtyYears: {
        value: null,
        error: '',
        label: 'Flood Impact In Thirty Years',
        placeholder: 'Select range for flood impacts',
        inputType: 'select',
    },
    hasLivelihoodAffect: {
        value: null,
        error: '',
        label: 'Livelihood Affect',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasHouseDamage: {
        value: null,
        error: '',
        label: 'House Damage',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasLossOfFamilyMembers: {
        value: null,
        error: '',
        label: 'Loss of Family Members',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    vicinityToRivers: {
        value: null,
        error: '',
        label: 'Vicinity To Rivers',
        placeholder: 'Select your vicinity from river',
        inputType: 'select',
    },
    hasAccessToDrinkingWater: {
        value: null,
        error: '',
        label: 'Access to Drinking Water',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasAccessToDrinkingWaterDuringFlood: {
        value: null,
        error: '',
        label: 'Access to Drinking Water During Flood',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasAccessToEarlyWarningInformation: {
        value: null,
        error: '',
        label: 'Access to Early Warning Information',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasInvolvmentToCommunityGroup: {
        value: null,
        error: '',
        label: 'Involvment to Community Group',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    hasAccessToFinancialServices: {
        value: null,
        error: '',
        label: 'Access to Financial Services',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    educationLevel: {
        value: null,
        error: '',
        label: 'Education Level',
        placeholder: 'Select your education level',
        inputType: 'select',
    },
    hasAvailabilityOfSocialSecurity: {
        value: null,
        error: '',
        label: 'Availability of Social Security',
        placeholder: 'Select yes or no',
        inputType: 'select',
    },
    distanceOfSafeShelter: {
        value: null,
        error: '',
        label: 'Distance to Safe Shelter',
        placeholder: 'Select distance to safe shelter',
        inputType: 'select',
    },
    //   family_size: {
    //     value: '',
    //     error: '',
    // },
    // dependent_population: {
    //     value: '',
    //     error: '',
    // },
    // house_type: {
    //     value: '',
    //     error: '',
    // },
    // social_assistance: {
    //     value: '',
    //     error: '',
    // },
    // tole_name: {
    //     value: '',
    //     error: '',
    // },
    // owner_name: {
    //     value: '',
    //     error: '',
    // },
    // phone_number: {
    //     value: '',
    //     error: '',
    // },
    // citizenship_number: {
    //     value: '',
    //     error: '',
    // },
};
