import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import Table from './TabularView';
import {
    createRequestClient,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';

interface State {
    currentView: string;
    tableData: any;
    allOpenspaces: unknown;
    apiData: array;
}

interface Props {
    closeModal: any;
    handelListClick: any;
}

interface SetStateMethod {
    data: array;
    totalArea: any;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: '/community-table/',
        method: methods.GET,
        onMount: false,
    },
};


class AllOpenspacesModal extends React.PureComponent<Props, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            currentView: 'OpenSpaces',
            allOpenspaces: [],
            tableData: '',
            apiData: [],
        };

        const {
            requests: { mediaGetRequest },
        } = this.props;

        mediaGetRequest.do({
            openspaceId: 1,
        });
    }

    public componentDidUpdate(prevProps) {
        const {
            requests: {
                mediaGetRequest: { response },
            },
        } = this.props;

        if (response !== prevProps.requests.mediaGetRequest.response) {
            const { results } = response;

            const tempArray = [];
            results.forEach((data: SetStateMethod) => {
                const capacity = parseInt((data.totalArea / 5).toFixed(0), 10);
                tempArray.push({ ...data, capacity });
            });
            this.setApiData(tempArray);
        }
    }


    public setApiData = (data: SetStateMethod) => {
        this.setState({ apiData: data });
    }


    public render() {
        const { closeModal } = this.props;
        const { apiData } = this.state;

        return (
            <Modal
                className={styles.incidentTableModal}
                closeOnEscape
            >
                <ModalHeader
                    title="Community Spaces"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    <Table className={styles.table} incidentList={apiData} />
                </ModalBody>
            </Modal>
        );
    }
}

export default connect()(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(AllOpenspacesModal),
    ),
);
