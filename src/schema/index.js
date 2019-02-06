import Dict, { basicTypes } from '@togglecorp/ravl';

const basicTypeSchemas = basicTypes.map(
    entry => ({ name: entry.doc.name, schema: entry }),
);
// TODO: better way to add schema
const userDefinedSchemas = [];

{
    const name = 'dbentity';
    const schema = {
        doc: {
            name: 'Database Entity',
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
    };
    userDefinedSchemas.push({ name, schema });
}

// TODO: set this value in production only
const isProd = false;
const dict = new Dict(
    isProd ? { warning: false } : { warning: true },
);

[
    ...basicTypeSchemas,
    ...userDefinedSchemas,
].forEach(({ name, schema }) => dict.put(name, schema));

export default dict;
