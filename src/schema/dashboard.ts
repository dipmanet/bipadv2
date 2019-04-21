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
            point: { type: 'unknown' }, // geometry object
            polygon: { type: 'unknown' }, // geometry object
            public: { type: 'boolean' },
            expireOn: { type: 'string' }, // date
            startedOn: { type: 'string', required: true }, // date
            wards: { type: 'array.uint' },
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
    {
        extends: 'dbentity',
        doc: {
            name: 'event',
            description: 'Event',
        },
        fields: {
            startedOn: { type: 'string' }, // date
            endedOn: { type: 'string' }, // date
            createdOn: { type: 'string' }, // date
            title: { type: 'string', required: true },
            description: { type: 'string' },
            point: { type: 'unknown' }, // geometry object
            polygon: { type: 'unknown' }, // geometry object
            severity: { type: 'string' },
            hazard: { type: 'uint' },
        },
    },
    {
        doc: {
            name: 'eventResponse',
            description: 'Response of event',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.event' },
        },
    },
];
export default schemaList;
