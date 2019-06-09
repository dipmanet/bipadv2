import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        extends: 'dbentity',
        doc: {
            name: 'response',
            description: 'Response Object',
        },
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            point: { type: 'unknown' }, // FIXME: geometry object
            bedCount: { type: 'uint' },
            type: { type: 'string' },
            cbsCode: { type: 'uint' },
            ward: { type: 'uint' },
            resourceType: { type: 'string' },
            distance: { type: 'uint' },
            channel: { type: 'string' },
            population: { type: 'uint' },
            accessPointCount: { type: 'uint' },
            inventories: { type: 'array.unknown' },
            noOfStaffs: { type: 'uint' },
            religion: { type: 'string' },
            atmAvailable: { type: 'unknown' },
            noOfEmployee: { type: 'uint' },
            noOfStudent: { type: 'uint' },

            createdOn: { type: 'string' }, // NOTE: overriding dbentity
        },
    },
    {
        doc: {
            name: 'responseResponse',
            description: 'Respose of response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.response' },
        },
    },
];

export default schemaList;
