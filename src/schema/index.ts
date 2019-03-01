import Dict, { basicTypes, Schema } from '@togglecorp/ravl';
import { isProduction } from '#config/env';

import alertSchemas from './alert';
import commonSchemas from './common';
import incidentSchemas from './incident';

const userDefinedSchemas: Schema[] = [
    {
        doc: {
            name: 'dbentity',
            description: 'Defines all the attributes common to db entities',
        },
        fields: {
            createdAt: { type: 'string', required: true }, // date
            createdBy: { type: 'uint' },
            createdByName: { type: 'string' },
            id: { type: 'uint', required: true },
            modifiedAt: { type: 'string', required: true }, // date
            modifiedBy: { type: 'uint' },
            modifiedByName: { type: 'string' },
            versionId: { type: 'uint', required: true },
        },
    },
];

const warning = !isProduction;
const dict = new Dict({ warning });

[
    ...basicTypes,
    ...userDefinedSchemas,
    ...alertSchemas,
    ...commonSchemas,
    ...incidentSchemas,
].forEach(schema => dict.put(schema.doc.name, schema));

export default dict;
