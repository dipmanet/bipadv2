import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import memoize from 'memoize-one';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import MiniMap from './MiniMap';

import { Geometry } from '#views/DataArchive/types';
import { ArchiveRiver } from './types';
import { riverToGeojson } from './utils';

import styles from './styles.scss';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { AppState } from '#store/types';
import { mapStyleSelector } from '#selectors';

interface Params {}

interface OwnProps {
    handleModalClose: () => void;
    stationName: string;
    stationId: number;
    geometry: Geometry;
    mapStyle: string;
}

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: ({ props: { stationId } }) => (`/river-stations/${stationId}`),
        method: methods.GET,
        query: ({ props: { stationId } }) => ({
            id: stationId,
            expand: ['province', 'district', 'municipality', 'ward'],
        }),
        onMount: true,
        onPropsChanged: ['stationId'],
    },
};

type Props = NewProps<OwnProps, Params>;

const emptyObject: any = {};

const mapStateToProps = (state: AppState) => ({
    mapStyle: mapStyleSelector(state),
});

const getRiverFeatureCollection = memoize(riverToGeojson);

const RiverModal = (props: Props) => {
    const { stationName = 'River Modal',
        requests: {
            detailRequest: {
                response,
                pending,
            },
        },
        mapStyle,
        geometry,
        handleModalClose } = props;
    console.log('🚀 ~ file: index.tsx ~ line 73 ~ RiverModal ~ props', props);
    let riverDetails: ArchiveRiver = emptyObject;
    if (!pending && response) {
        const results = response as ArchiveRiver;
        riverDetails = results;
    }
    const { municipality } = riverDetails || emptyObject;
    const { id: geoarea } = municipality || emptyObject;

    // get map center
    const { coordinates } = geometry;

    const riverFeatureCollection = getRiverFeatureCollection(
        [riverDetails || {}],
    );

    return (
        <Modal className={styles.riverModal}>
            <ModalHeader
                title={stationName}
                rightComponent={(
                    <DangerButton
                        transparent
                        iconName="close"
                        onClick={handleModalClose}
                    />
                )}
            />
            <ModalBody className={styles.body}>
                <div className={styles.modalRow}>
                    <div className={styles.modalMap}>
                        <MiniMap
                            mapStyle={mapStyle}
                            coordinates={coordinates}
                            geoarea={geoarea}
                            riverFeatureCollection={riverFeatureCollection}
                        />
                    </div>
                    <div className={styles.modalDetails}>
                        Details and Filters
                    </div>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalOneMonth}>
                        Graph
                    </div>
                    <div className={styles.modalTwelveMonth}>
                        TableView
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default compose(
    connect(mapStateToProps, {}),
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requests),
)(RiverModal);
