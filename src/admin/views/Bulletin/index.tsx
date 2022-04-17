/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import BulletinForm from 'src/admin/components/BulletinForm';
import MenuCommon from 'src/admin/components/MenuCommon';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { setBulletinEditDataAction } from '#actionCreators';

interface Props {
    uri: string;
    id: string | number;
    urlLanguage: string;
}

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    getEditByURl: {
        url: ({ params }) => `/bipad-bulletin/${params.id}`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            if (response && !response.detail) {
                props.setBulletinEditData({ ...response, language: params.language });
            }
        },
    },
};
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setBulletinEditData: params => dispatch(setBulletinEditDataAction(params)),
});
const Bulletin = (props: Props) => {
    const { uri, id, urlLanguage, requests: { getEditByURl } } = props;

    useEffect(() => {
        if (id && urlLanguage) {
            getEditByURl.do({
                id,
                language: urlLanguage,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <MenuCommon
                currentPage="Health Infrastructure"
                layout="common"
                subLevel={'bulletin'}
                uri={uri}
            />
            <BulletinForm
                uri={uri}
                urlLanguage={urlLanguage}
                id={id}
            />

            <Footer />
        </>
    );
};

export default connect(undefined, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Bulletin,
        ),
    ),
);
