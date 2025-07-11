import Dict, { basicTypes, Schema } from "@togglecorp/ravl";

import dashboardSchemas from "./dashboard";
import commonSchemas from "./common";
import incidentSchemas from "./incident";
import realtimeSchemas from "./realtime";
import responseSchemas from "./response";

const userDefinedSchemas: Schema[] = [
	{
		doc: {
			name: "dbentity",
			description: "Defines all the attributes common to db entities",
		},
		fields: {
			id: { type: "uint", required: true },
			createdOn: { type: "string", required: true }, // date
			modifiedOn: { type: "string" }, // date
		},
	},
];

// const warning = !isProduction;
const warning = false;

const dict = new Dict({ warning });

[
	...basicTypes,
	...userDefinedSchemas,
	...dashboardSchemas,
	...commonSchemas,
	...incidentSchemas,
	...realtimeSchemas,
	...responseSchemas,
].forEach((schema) => dict.put(schema.doc.name, schema));

export default dict;
