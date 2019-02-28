import { Schema } from '@togglecorp/ravl';

const schemaList: Schema[] = [
    {
        doc: {
            name: 'alert',
            description: 'Alert for crisis',
        },
        fields: {
            key: { type: 'uint', required: true },
            title: { type: 'string', required: true },
            source: { type: 'string', required: true },
            description: { type: 'string' },
            hazard: { type: 'uint' },
            event: { type: 'uint' },
        },
    },
];
export default schemaList;
