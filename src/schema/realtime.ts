import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        extends: 'dbentity',
        doc: {
            name: 'earthquake',
            description: 'earthquake',
        },
        fields: {
            createdOn: { type: 'string', required: true }, // date
            modifiedOn: { type: 'string' }, // date
            description: { type: 'string' },
            point: { type: 'object' }, // FIXME: geometry object
            magnitude: { type: 'number' },
            address: { type: 'string' },
            eventOn: { type: 'string' }, // date
        },
    },
    {
        doc: {
            name: 'earthquakeResponse',
            description: 'Earthquake Response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.earthquake' },
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'river',
            description: 'river',
        },
        fields: {
            createdOn: { type: 'string', required: true }, // date
            modifiedOn: { type: 'string' }, // date
            title: { type: 'string' },
            basin: { type: 'string' },
            description: { type: 'string' },
            point: { type: 'object' }, // FIXME: geometry object
            waterLevel: { type: 'number' },
            waterLevelOn: { type: 'string' },
            dangerLevel: { type: 'number' },
            warningLevel: { type: 'number' },
            status: { type: 'string' },
            elevation: { type: 'number' },
            steady: { type: 'string' },
        },
    },
    {
        doc: {
            name: 'riverResponse',
            description: 'River Response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.river' },
        },
    },
    {
        doc: {
            name: 'rainfall',
        },
        fields: {
            value: { type: 'number' },
            status: { type: 'object' },
            interval: { type: 'number' },
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'rain',
            description: 'rain',
        },
        fields: {
            createdOn: { type: 'string', required: true }, // date
            modifiedOn: { type: 'string' }, // date
            title: { type: 'string' },
            basin: { type: 'string' },
            status: { type: 'string' },
            description: { type: 'string' },
            point: { type: 'object' }, // FIXME: geometry object
            elevation: { type: 'number' },
            averages: { type: 'array.rainfall' },
        },
    },
    {
        doc: {
            name: 'rainResponse',
            description: 'Rain Response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.rain' },
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'fire',
            description: 'fire',
        },
        fields: {
            createdOn: { type: 'string', required: true }, // date
            modifiedOn: { type: 'string' }, // date
            scan: { type: 'object' },
            eventOn: { type: 'string' }, // date
            basin: { type: 'string' },
            landCover: { type: 'string' },
            point: { type: 'object' }, // FIXME: geometry object
            brightness: { type: 'number' },
            confidence: { type: 'number' },
        },
    },
    {
        doc: {
            name: 'fireResponse',
            description: 'Fire Response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.fire' },
        },
    },
    {
        doc: {
            name: 'measures',
        },
        fields: {
            unit: { type: 'string' },
            value: { type: 'number' },
            source: { type: 'string' },
            parameter: { type: 'string' },
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'pollution',
            description: 'pollution',
        },
        fields: {
            createdOn: { type: 'string', required: true }, // date
            modifiedOn: { type: 'string' }, // date
            location: { type: 'string' },
            point: { type: 'object' }, // FIXME: geometry object
            city: { type: 'string' },
            measuredOn: { type: 'string' }, // date
            measurements: { type: 'array.array.measures' },
        },
    },
    {
        doc: {
            name: 'pollutionResponse',
            description: 'Pollution Response',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.pollution' },
        },
    },
];
export default schemaList;
