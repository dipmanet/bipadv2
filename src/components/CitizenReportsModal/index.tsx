import React from 'react';
import { _cs, Obj } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import FormattedDate from '#rscv/FormattedDate';
import ListView from '#rscv/List/ListView';
import DangerButton from '#rsca/Button/DangerButton';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';

import * as PageType from '#store/atom/page/types';
import { AppState } from '#store/types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    hazardTypesSelector,
} from '#selectors';

import alertIcon from '#resources/icons/Alert.svg';

import { MultiResponse } from '#store/atom/response/types';

import styles from './styles.scss';

interface CitizenReport {
    id: number;
    description: string;
    comment: string;
    image?: string;
    point: {
        type: 'Point';
        coordinates: [number, number];
    };
    verified: boolean;
    incident?: number;
    hazard: number;
    ward: number;

    createdOn: string;
}

interface CitizenReportItemProps {
    className?: string;
    data: CitizenReport;
    hazardTypes: Obj<PageType.HazardType>;
}

const CitizenReportItem = (props: CitizenReportItemProps) => {
    const {
        className,
        hazardTypes,
        data: {
            description,
            verified,
            createdOn,
            hazard,
            // ward,
        },
    } = props;

    const hazardDetail = hazardTypes[hazard] || {};

    return (
        <div className={_cs(className, styles.citizenReport)}>
            <div className={styles.iconContainer}>
                <ScalableVectorGraphics
                    className={styles.hazardIcon}
                    src={hazardDetail.icon || alertIcon}
                    style={{ color: hazardDetail.color || '#4666b0' }}
                />
            </div>
            <div className={styles.details}>
                <div className={styles.description}>
                    {description || 'No description'}
                </div>
                <FormattedDate
                    className={styles.createdOn}
                    value={createdOn}
                    mode="yyyy-MM-dd"
                />
                {verified && (
                    <div className={styles.verified}>
                        Verified
                    </div>
                )}
            </div>
        </div>
    );
};

const keySelector = (c: CitizenReport) => c.id;

interface OwnProps {
    className?: string;
    closeModal?: () => void;
}

interface StateProps {
    hazardTypes: Obj<PageType.HazardType>;
}

type ReduxProps = OwnProps & StateProps;

interface State {
}

interface Params {
}

type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    citizenReportsGetRequest: {
        url: '/citizen-report/',
        method: methods.GET,
        onMount: true,
    },
};

class CitizenReportsModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private rendererParams = (key: number, data: CitizenReport) => ({
        data,
        hazardTypes: this.props.hazardTypes,
    })

    public render() {
        const {
            className,
            closeModal,
            requests: {
                citizenReportsGetRequest: {
                    pending,
                    response,
                },
            },
        } = this.props;

        let citizenReportList: CitizenReport[] = [];
        if (!pending && response) {
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;
        }

        return (
            <Modal className={_cs(styles.citizenReportsModal, className)}>
                <ModalHeader
                    title="Citizen Reports"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <ListView
                        className={styles.citizenReportList}
                        data={citizenReportList}
                        keySelector={keySelector}
                        renderer={CitizenReportItem}
                        rendererParams={this.rendererParams}
                        pending={pending}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps)(
    createRequestClient(requests)(
        CitizenReportsModal,
    ),
);
