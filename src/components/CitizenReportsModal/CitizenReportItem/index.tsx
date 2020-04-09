import React from 'react';
import Faram from '@togglecorp/faram';
import { _cs, Obj } from '@togglecorp/fujs';

import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import alertIcon from '#resources/icons/Alert.svg';
import SelectInput from '#rsci/SelectInput';
import Badge from '#components/Badge';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { HazardType, Incident, Field } from '#store/atom/page/types';
import { CitizenReport } from '#types';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    data: CitizenReport;
    hazardTypes: Obj<HazardType>;
    incidents: Incident[];
    incidentsGetPending: boolean;
    isExpandedReport: boolean;
    setExpandedReport: (id?: CitizenReport['id']) => void;
}
interface FaramValues {
    incident?: number;
}
interface State {
    faramValues: FaramValues;
    faramErrors: object;
    disabled: boolean;
}
interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
    onSuccess?: () => void;
}

type Props = NewProps<OwnProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    citizenReportPatchRequest: {
        url: ({ props: { data: { id } } }) => `/citizen-report/${id}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        onSuccess: ({ params }) => {
            if (params && params.onSuccess) {
                params.onSuccess();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
    },
};

const keySelector = (d: Field) => d.id;
const labelSelector = (d: Field) => d.title;

class CitizenReportItem extends React.PureComponent<Props, State> {
    public state = {
        faramValues: {
            incident: this.props.data.incident,
        },
        disabled: true,
        faramErrors: {},
    };

    private static schema = {
        fields: {
            incident: [],
        },
    }

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: object) => {
        this.setState({ faramValues, faramErrors, disabled: false });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            data: { id },
            requests: { citizenReportPatchRequest },
        } = this.props;

        const { incident } = faramValues;

        const body = {
            id,
            incident,
        };

        citizenReportPatchRequest.do({
            body,
            setFaramErrors: this.handleFaramValidationFailure,
            onSuccess: () => {
                this.setState({
                    disabled: true,
                });
            },
        });
    }

    private handleReportExpansion = () => {
        const {
            setExpandedReport,
            data,
            isExpandedReport,
        } = this.props;

        if (setExpandedReport) {
            setExpandedReport(isExpandedReport ? undefined : data.id);
        }
    }

    public render() {
        const {
            className,
            hazardTypes,
            data,
            incidentsGetPending,
            incidents,
            isExpandedReport,
            requests: {
                citizenReportPatchRequest: {
                    pending: patchPending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            disabled,
        } = this.state;

        const pending = incidentsGetPending || patchPending;
        const hazardDetail = hazardTypes[data.hazard] || {};

        return (
            <div className={_cs(className, styles.citizenReport)}>
                <div className={styles.rowContainer}>
                    <div className={styles.iconContainer}>
                        <ScalableVectorGraphics
                            className={styles.hazardIcon}
                            src={hazardDetail.icon || alertIcon}
                            style={{ color: hazardDetail.color || '#4666b0' }}
                        />
                    </div>
                    <div className={styles.details}>
                        <div className={styles.detailsTopContainer}>
                            <TextOutput
                                label="Created On"
                                value={(
                                    <FormattedDate
                                        className={styles.createdOn}
                                        value={data.createdOn}
                                        mode="yyyy-MM-dd"
                                    />
                                )}
                            />
                            {data.verified && (
                                <Badge
                                    title="Verified"
                                    icon="check"
                                />
                            )}
                        </div>
                        <div className={styles.description}>
                            {data.description || 'No description'}
                        </div>
                    </div>
                    <div className={styles.addIncident}>
                        <Faram
                            className={styles.addIncidentForm}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={CitizenReportItem.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={pending}
                        >
                            <SelectInput
                                className={styles.incidents}
                                faramElementName="incident"
                                label="Incident"
                                options={incidents}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                            />
                            <PrimaryButton
                                className={styles.button}
                                transparent
                                type="submit"
                                disabled={disabled}
                                pending={patchPending}
                            >
                                Save
                            </PrimaryButton>
                        </Faram>
                    </div>
                    <Button
                        className={_cs(styles.expandButton, !data.image && styles.hide)}
                        iconName={isExpandedReport ? 'chevronUp' : 'chevronDown'}
                        onClick={this.handleReportExpansion}
                    />
                </div>
                {isExpandedReport && data.image && (
                    <div className={styles.expandedContent}>
                        <img
                            className={styles.image}
                            src={data.image}
                            alt="report"
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default createRequestClient(requestOptions)(
    CitizenReportItem,
);
