import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import TabularView from './TabularView';
import {
    createRequestClient,
    ClientAttributes,
    methods,
    createConnectedRequestCoordinator,
} from '#request';
import { filtersSelector } from '#selectors';
import { FiltersElement } from '#types';
import { AppState } from '#store/types';

interface State {
    currentView: string;
    allOpenspaces: unknown;
    apiData: unknown;
    apiDataBackup: unknown;
}

interface PropsFromAppState {
    filters: FiltersElement;
}

interface ComponentProps {
    closeModal: () => void;
    requests: any;
}
type Props = ComponentProps & PropsFromAppState;

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: '/open-table/',
        method: methods.GET,
        onMount: false,
    },
};

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
});
class AllOpenspacesModal extends React.PureComponent<Props, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            currentView: 'OpenSpaces',
            apiData: [],
            apiDataBackup: [],
        };

        const {
            requests: { mediaGetRequest },
        } = this.props;

        mediaGetRequest.do({
            openspaceId: 1,
        });
    }

    public componentDidMount() {
        const { filters } = this.props;
        if (filters) {
            this.handleFilter();
        }
    }


    public componentDidUpdate(prevProps) {
        const {
            requests: {
                mediaGetRequest: { response },
            },
            filters,
        } = this.props;

        if (filters !== prevProps.filters) {
            if (filters !== prevProps.filters) {
                this.handleFilter();
            }
        }

        if (response !== prevProps.requests.mediaGetRequest.response) {
            const { results } = response;
            const tempArray = [];
            results.forEach((data: SetStateMethod) => {
                const capacity = parseInt((data.usableArea / 5).toFixed(0), 10);
                tempArray.push({ ...data, capacity });
            });
            this.setApiData(tempArray);
        }
    }

    public setApiData = (data: SetStateMethod) => {
        const { filters } = this.props;
        this.setState({ apiData: data, apiDataBackup: data },
            () => {
                if (filters) {
                    this.handleFilter();
                }
            });
    }

    private handleFilter = () => {
        const { apiData } = this.state;
        const { filters } = this.props;
        const { region } = filters;

        if (region.adminLevel) {
            const filteredData = apiData.filter(
                openspace => openspace.province === region.adminLevel,
            );
            this.setState({
                apiData: filteredData,
            });
        } else {
            const { apiDataBackup } = this.state;
            this.setState({
                apiData: apiDataBackup,
            });
        }
    }

    public render() {
        const { closeModal } = this.props;
        const { currentView, apiData } = this.state;

        return (
            <Modal className={styles.incidentTableModal} closeOnEscape>
                <ModalHeader
                    title={
                        currentView === 'OpenSpaces'
                            ? 'Humanitarian Open Spaces'
                            : 'Community Spaces'
                    }
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
                    <TabularView className={styles.table} incidentList={apiData} />
                </ModalBody>
            </Modal>
        );
    }
}

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(AllOpenspacesModal),
    ),
);
