import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        doc: {
            name: 'province',
            description: 'Province',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
            bbox: { type: 'array.number', required: true },
            type: { type: 'string' },
        },
    },
    {
        doc: {
            name: 'provinceResponse',
            description: 'Response of province',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.province' },
        },
    },
    {
        doc: {
            name: 'district',
            description: 'District',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
            province: { type: 'number', required: true },
            bbox: { type: 'array.number', required: true },
            type: { type: 'string' },
        },
    },
    {
        doc: {
            name: 'districtResponse',
            description: 'Response of district',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.district' },
        },
    },
    {
        doc: {
            name: 'municipality',
            description: 'Municipality',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
            district: { type: 'number', required: true },
            bbox: { type: 'array.number', required: true },
            type: { type: 'string' },
        },
    },
    {
        doc: {
            name: 'municipalityResponse',
            description: 'Response of municipality',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.municipality' },
        },
    },
    {
        doc: {
            name: 'ward',
            description: 'Ward',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
            municipality: { type: 'number', required: true },
            bbox: { type: 'array.number', required: true },
            type: { type: 'string' },
        },
    },
    {
        doc: {
            name: 'wardResponse',
            description: 'Response of ward',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.ward' },
        },
    },
    {
        doc: {
            name: 'hazard',
            description: 'Hazard',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
            icon: { type: 'string' }, // FIXME: should be required
            color: { type: 'string' }, // FIXME: should be required
        },
    },
    {
        doc: {
            name: 'hazardResponse',
            description: 'Response of hazard',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.hazard' },
        },
    },
];
export default schemaList;
