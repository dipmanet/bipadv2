export default [
    {
        doc: {
            name: 'province',
            description: 'Province',
        },
        fields: {
            id: { type: 'number', required: true },
            title: { type: 'string', required: true },
        },
    },
    {
        doc: {
            name: 'provinceResponse',
            description: 'Response of province',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'number' },
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
        },
    },
    {
        doc: {
            name: 'districtResponse',
            description: 'Response of district',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'number' },
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
        },
    },
    {
        doc: {
            name: 'municipalityResponse',
            description: 'Response of municipality',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'number' },
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
        },
    },
    {
        doc: {
            name: 'wardResponse',
            description: 'Response of ward',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'number' },
            previous: { type: 'number' },
            results: { type: 'array.ward' },
        },
    },
];
