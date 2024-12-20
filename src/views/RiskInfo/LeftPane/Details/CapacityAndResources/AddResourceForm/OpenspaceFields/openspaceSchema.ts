import { requiredCondition } from '@togglecorp/faram';
import { OpenspaceTabs } from '#types';

type Schema = {
    [key in OpenspaceTabs]: object;
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
    basicInfo: {
        fields: {
            ...defaultFields,
            oid: [requiredCondition],
            name: [],
            description: [],
            coverImage: [requiredCondition],
        },
    },
    suggestedUses: {
        fields: {
            oid: [requiredCondition],
        },
    },
    onSiteAmenities: {
        fields: {
            oid: [requiredCondition],
        },
    },
    environmentChecklist: {
        fields: {
            oid: [requiredCondition],
        },
    },
    media: {
        fields: {
            oid: [requiredCondition],
        },
    },
};

export default schema;
