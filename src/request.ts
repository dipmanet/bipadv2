import {
	createRequestCoordinator,
	methods,
	CoordinatorAttributes,
} from "@togglecorp/react-rest-request";
import { isList } from "@togglecorp/fujs";

import { AppState } from "#store/types";

import store from "#store";
import { mapStyleSelector } from "#selectors";

import schema from "#schema";
import { sanitizeResponse } from "#utils/common";
import { getAuthState } from "#utils/session";

const wsEndpoint = import.meta.env.REACT_APP_API_SERVER_URL;
const domain = import.meta.env.REACT_APP_DOMAIN;

const isFile = (input: any): input is File => "File" in window && input instanceof File;
const isBlob = (input: any): input is Blob => "Blob" in window && input instanceof Blob;

const sanitizeFormData = (value: any) => {
	if (value === null) {
		return "";
	}
	if (isFile(value) || isBlob(value) || typeof value === "string") {
		return value;
	}
	return JSON.stringify(value);
};

const getFormData = (jsonData: object | undefined) => {
	const formData = new FormData();
	if (!jsonData) {
		return formData;
	}

	Object.entries(jsonData).forEach(([key, value]) => {
		if (isList(value)) {
			value.forEach((val: unknown) => {
				if (val !== undefined) {
					const sanitizedVal = sanitizeFormData(val);
					formData.append(key, sanitizedVal);
				}
			});
		} else if (value !== undefined) {
			const sanitizedValue = sanitizeFormData(value);
			formData.append(key, sanitizedValue);
		}
	});

	return formData;
};

// FIXME: don't know why eslint disable is required right now

export function createConnectedRequestCoordinator<OwnProps>() {
	type Props = OwnProps;

	const requestor = createRequestCoordinator({
		transformParams: (data: CoordinatorAttributes) => {
			const { body, method, extras } = data;

			const cookies = getAuthState();

			const myExtras = (extras || {}) as { hasFile?: boolean };
			const newBody = myExtras.hasFile ? getFormData(body) : JSON.stringify(body);

			const newHeaders = myExtras.hasFile
				? {
						Accept: "application/json",
						"X-CSRFToken": cookies.csrftoken,
				  }
				: {
						Accept: "application/json",
						"Content-Type": "application/json; charset=utf-8",
						"X-CSRFToken": cookies.csrftoken,
				  };
			return {
				method: method || methods.GET,
				body: newBody,
				headers: newHeaders,
			};
		},
		transformProps: (props: Props) => {
			const mapStyle = mapStyleSelector(store.getState() as AppState);
			// console.warn('Map style is', mapStyle);
			return props;
		},

		transformUrl: (url: string) => {
			if (/^https?:\/\//i.test(url)) {
				return url;
			}

			if (!wsEndpoint || !domain) {
				return "";
			}

			// Get current client sub-domain and prefix api endpoint with
			// that sub-domain

			const { hostname } = window.location;
			const index = hostname.search(`.${domain}`);
			const subDomain = index !== -1 ? hostname.substring(0, index) : undefined;

			if (!subDomain) {
				return `${wsEndpoint}${url}`;
			}

			const escapedDomain = domain.replace(/\./g, "\\.");
			const newWsEndpoint = wsEndpoint.replace(new RegExp(escapedDomain), `${subDomain}.${domain}`);
			return `${newWsEndpoint}${url}`;
		},

		transformResponse: (body: object, request: CoordinatorAttributes) => {
			const { url, method, extras: requestOptions } = request;
			const sanitizedResponse = sanitizeResponse(body);

			/*
            if (methods.POST || methods.PUT || methods.PATCH || methods.DELETE) {
                // eslint-disable-next-line
                alert('Success');
            }
            */

			const extras = requestOptions as { schemaName?: string };
			if (!extras || extras.schemaName === undefined) {
				// NOTE: usually there is no response body for DELETE
				if (method !== methods.DELETE) {
					console.error(`Schema is not defined for ${url} ${method}`);
				}
			} else {
				try {
					schema.validate(sanitizedResponse, extras.schemaName);
				} catch (e) {
					console.error(url, method, sanitizedResponse, e.message);
					throw e;
				}
			}

			return sanitizedResponse;
		},

		transformErrors: (response: { errors: string[] }) => {
			const faramErrors = response.errors;
			return {
				response,
				faramErrors,
			};
		},
	});

	return requestor;
}

export * from "@togglecorp/react-rest-request";
