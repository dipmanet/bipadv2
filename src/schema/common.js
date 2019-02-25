const provinceSchema = {
    doc: {
        name: 'province',
        description: 'Province',
    },
    fields: {
        id: { type: 'number', required: true },
        title: { type: 'string', required: true },
    },
};

const provinceResponse = {
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
};

const districtSchema = {
    doc: {
        name: 'district',
        description: 'District',
    },
    fields: {
        id: { type: 'number', required: true },
        title: { type: 'string', required: true },
        province: { type: 'number', required: true },
    },
};

const districtResponse = {
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
};

const municipalitySchema = {
    doc: {
        name: 'municipality',
        description: 'Municipality',
    },
    fields: {
        id: { type: 'number', required: true },
        title: { type: 'string', required: true },
        district: { type: 'number', required: true },
    },
};

const municipalityResponse = {
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
};

const wardSchema = {
    doc: {
        name: 'ward',
        description: 'Ward',
    },
    fields: {
        id: { type: 'number', required: true },
        title: { type: 'string', required: true },
        municipality: { type: 'number', required: true },
    },
};

const wardResponse = {
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
};
