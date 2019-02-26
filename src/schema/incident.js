export default [
    {
        doc: {
            name: 'inducer',
            description: 'Inducer Enum',
        },
        extends: 'string',
        example: ['natural', 'artificial'],
    },
    {
        doc: {
            name: 'lnglat',
            description: 'lnglat',
        },
        extends: 'array',
        example: [[85.300140, 27.700769]],
    },
    {
        doc: {
            name: 'peoplestatus',
            description: 'People Status',
        },
        extends: 'string',
        example: ['missing', 'dead', 'injured', 'affected'],
    },
    {
        doc: {
            name: 'people',
            description: 'People',
        },
        fields: {
            status: { type: 'status', required: true },
            name: { type: 'string', required: true },
            age: { type: 'uint', required: true },
            gender: { type: 'gender', required: true },
            belowPoverty: { type: 'boolean', required: true },
            phoneNumber: { type: 'uint', required: true },
        },
    },
    {
        doc: {
            name: 'familystatus',
            description: 'Family Status',
        },
        extends: 'string',
        example: ['evacuated', 'relocated'],
    },
    {
        doc: {
            name: 'family',
            description: 'Family',
        },
        fields: {
            status: { type: 'familystatus', required: true },
            belowPoverty: { type: 'boolean', required: true },
            phoneNumber: { type: 'uint', required: true },
        },
    },
    {
        doc: {
            name: 'infrastructurestatus',
            description: 'Infrastructure Status',
        },
        extends: 'string',
        example: ['affected', 'destroyed'],
    },
    {
        doc: {
            name: 'infrastructure',
            description: 'Infrastructure',
        },
        fields: {
            title: { type: 'string', required: true },
            type: {
                required: true,
                type: {
                    doc: {
                        name: 'type',
                        description: 'Type of infrastructure',
                    },
                    fields: {
                        title: { type: 'string', required: true },
                        description: { type: 'string', required: true },
                    },
                },
            },
            status: { type: 'infrastructurestatus', required: true },
            equipment_value: { type: 'uint', required: true },
            infrastructure_value: { type: 'uint', required: true },
            beneficiaryOwner: { type: 'string', required: true },
            serviceDisrupted: { type: 'boolean', required: true },
        },
    },
    {
        doc: {
            name: 'livestockstatusschema',
            description: 'Livestock Status',
        },
        extends: 'string',
        example: ['affected', 'destroyed'],
    },
    {
        doc: {
            name: 'livestock',
            description: 'Livestock',
        },
        fields: {
            type: {
                type: {
                    doc: {
                        name: 'title',
                        description: 'Title',
                    },
                    fields: {
                        title: { type: 'string' },
                    },
                },
            },
            status: { type: 'livestockstatus', required: true },
            count: { type: 'uint', required: true },
        },
    },
    {
        doc: {
            name: 'incident',
            description: 'Incident Object',
        },
        fields: {
            pk: { type: 'uint', required: true },
            title: { type: 'string', required: true },
            description: { type: 'string', required: true },
            cause: { type: 'string', required: true },
            inducer: { type: 'inducer', required: true },
            severity: { type: 'string', required: true },
            source: {
                required: true,
                type: {
                    doc: {
                        name: 'source',
                        description: 'Source object',
                    },
                    fields: {
                        name: { type: 'string', required: true },
                        displayName: { type: 'string', required: true },
                    },
                },
            },
            incident_on: { type: 'uint', required: true },
            event: { type: 'uint', required: true },
            hazard: { type: 'uint', required: true },
            point: { type: 'lnglat', required: true },
            geoareaName: {
                required: true,
                type: {
                    doc: {
                        name: 'geoareaname',
                        description: 'Geo Area Name',
                    },
                    fields: {
                        palika: { type: 'string', required: true },
                        district: { type: 'string', required: true },
                        province: { type: 'string', required: true },
                    },
                },
            },
            loss: {
                type: {
                    doc: {
                        name: 'loss',
                        description: 'Loss',
                    },
                    fields: {
                        estimatedLoss: { type: 'uint' },
                        peoples: { type: 'array.people' },
                        families: { type: 'array.family' },
                        infrastructures: { type: 'array.infrastructure' },
                        livestocks: { type: 'array.livestock' },
                    },
                },
            },
        },
    },
];
