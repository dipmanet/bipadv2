/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable import/prefer-default-export */

const baseURL = process.env.REACT_APP_API_SERVER_URL;
export const getRequest = async (
    pathName: string,
    params: any,

) => {
    const JSONResponse = await fetch(`${baseURL}/${pathName}/?${new URLSearchParams(params)}`);
    const response = await JSONResponse.json();
    return response;
};

export const patchRequest = async (
    pathName: string,
    params: any,
) => {
    const JSONResponse = await fetch(`${baseURL}/${pathName}/${params.wtToPatch.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
            weight_in_percent: params.wtToPatch.weight,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    const response = await JSONResponse.json();
    return response;
};
