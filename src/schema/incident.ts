import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        extends: 'dbentity',
        doc: {
            name: 'event',
            description: 'Event',
        },
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            severity: { type: 'string' },
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'loss',
            description: 'Loss',
        },
        fields: {
            description: { type: 'string' },
            estimatedLoss: { type: 'uint' },
            infrastructureDestroyedCount: { type: 'uint' },
            livestockDestroyedCount: { type: 'uint' },
            peopleDeathCount: { type: 'uint' },
            /*
            families: {
                arrayType: {
                    doc: {
                        name: 'family',
                        description: 'Family',
                    },
                    fields: {
                        status: { type: 'familyStatus', required: true },
                        belowPoverty: { type: 'boolean', required: true },
                        phoneNumber: { type: 'uint', required: true },
                    },
                },
            },
            infrastructures: {
                arrayType: {
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
                        status: { type: 'infrastructureStatus', required: true },
                        equipmentValue: { type: 'uint', required: true },
                        infrastructureValue: { type: 'uint', required: true },
                        beneficiaryOwner: { type: 'string', required: true },
                        serviceDisrupted: { type: 'boolean', required: true },
                    },
                },
            },
            livestocks: {
                arrayType: {
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
                        status: { type: 'livestockStatus', required: true },
                        count: { type: 'uint', required: true },
                    },
                },
            },
            */
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'gender',
            description: 'Gender Enum',
            example: ['male', 'female', 'other'],
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'inducer',
            description: 'Inducer Enum',
            example: ['natural', 'artificial'],
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'peopleStatus',
            description: 'People Status',
            example: ['missing', 'dead', 'injured', 'affected'],
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'familyStatus',
            description: 'Family Status',
            example: ['evacuated', 'relocated'],
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'infrastructureStatus',
            description: 'Infrastructure Status',
            example: ['affected', 'destroyed'],
        },
    },
    {
        extends: 'string',
        doc: {
            name: 'livestockStatus',
            description: 'Livestock Status',
            example: ['affected', 'destroyed'],
        },
    },
    {
        extends: 'dbentity',
        doc: {
            name: 'incident',
            description: 'Incident Object',
        },
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            detail: { type: 'object' }, // FIXME: what is this
            cause: { type: 'string' },
            inducer: { type: 'inducer' },
            severity: { type: 'string' },
            verified: { type: 'boolean' },
            wards: { type: 'array' }, // FIXME: why is this sent
            streetAddress: { type: 'string' },
            source: { type: 'string', required: true },
            incidentOn: { type: 'string', required: true }, // date
            reportedOn: { type: 'string' }, // date
            event: { type: 'event' },
            hazard: { type: 'uint', required: true },
            point: { type: 'unknown' }, // FIXME: geometry object
            polygon: { type: 'unknown' }, // FIXME: geometry object
            loss: { type: 'loss' },
        },
    },
    {
        extends: 'incident',
        doc: {
            name: 'singleIncidentResponse',
            description: 'Response of single incident',
        },
        fields: {
            event: { type: 'uint' },
        },
    },
    {
        doc: {
            name: 'incidentResponse',
            description: 'Response of incident',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: { type: 'array.incident' },
        },
    },
    {
        doc: {
            name: 'incidentWithPeopleResponse',
            description: 'Response of incident',
        },
        fields: {
            count: { type: 'number' },
            next: { type: 'string' },
            previous: { type: 'number' },
            results: {
                arrayType: {
                    extends: 'incident',
                    doc: {
                        name: 'incidentWithPeople',
                    },
                    fields: {
                        event: { type: 'uint' },
                        loss: {
                            type: {
                                extends: 'loss',
                                doc: {
                                    name: 'lossWithPeople',
                                },
                                fields: {
                                    peoples: {
                                        required: true,
                                        arrayType: {
                                            doc: {
                                                name: 'people',
                                                description: 'People',
                                            },
                                            fields: {
                                                id: { type: 'uint', required: true },
                                                // name: { type: 'string', required: true },
                                                loss: { type: 'uint' },
                                                age: { type: 'uint' },
                                                belowPoverty: { type: 'boolean' },
                                                count: { type: 'uint' },
                                                // disabled:
                                                status: { type: 'peopleStatus', required: true },
                                                gender: { type: 'gender' },
                                                // phoneNumber: { type: 'uint', required: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
];
export default schemaList;
