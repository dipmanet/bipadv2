import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        extends: 'dbentity',
        doc: {
            name: 'alert',
            description: 'Alert for crisis',
        },
        fields: {
            title: { type: 'string', required: true },
            source: { type: 'string', required: true },
            description: { type: 'string' },
            hazard: { type: 'uint' },
            event: { type: 'object' },
            verified: { type: 'boolean' },
            polygon: { type: 'object' }, // geometry object
            public: { type: 'boolean' },
            expireOn: { type: 'string' }, // date
            startedOn: { type: 'string', required: true }, // date
        },
    },
    {
        doc: {
            name: 'alertResponse',
            description: 'Response of alert',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.alert' },
        },
    },
];
export default schemaList;
