import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import { AppState } from '#store/types';
import ListSelection from '#rsci/ListSelection';

import { setRealTimeFiltersAction } from '#actionCreators';
import { realTimeFiltersSelector } from '#selectors';

import RegionSelectInput from '#components/RegionSelectInput';

import styles from './styles.scss';

const sourceKeySelector = (d: Source) => d.id;
const sourceLabelSelector = (d: Source) => d.title;

interface Source {
    id: number;
    title: string;
}

interface OwnProps {
    className?: string;
    realTimeSourceList: Source[];
    otherSourceList: Source[];
}

interface PropsFromAppState {
    filters: {
        faramValues: {};
        faramErrors: {};
    };
}

interface PropsFromDispatch {
    setFilters: ({
        faramValues,
        faramErrors,
        pristine,
    }: {
        faramValues: {};
        faramErrors: {};
        pristine: boolean;
    }) => void;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

interface State {
}

const mapStateToProps = (state: AppState) => ({
    filters: realTimeFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setRealTimeFiltersAction(params)),
});


class RealTimeMonitoringFilter extends React.PureComponent<Props, State> {
    private static schema = {
        fields: {
            region: [],
            realtimeSources: [],
            otherSources: [],
        },
    }

    private handleFaramChange = (faramValues, faramErrors) => {
        this.props.setFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramFailure = (faramErrors) => {
        this.props.setFilters({
            faramErrors,
            pristine: true,
        });
    }

    public render() {
        const {
            className,
            filters: {
                faramValues,
                faramErrors,
            },
            realTimeSourceList,
            otherSourceList,
        } = this.props;

        return (
            <Faram
                className={_cs(className, styles.filter)}
                onChange={this.handleFaramChange}
                schema={RealTimeMonitoringFilter.schema}
                value={faramValues}
                error={faramErrors}
                disabled={false}
            >
                <RegionSelectInput
                    className={styles.regionSelectInput}
                    faramElementName="region"
                />
                <ListSelection
                    label="Realtime layers"
                    className={styles.realTimeSourcesInput}
                    faramElementName="realtimeSources"
                    options={realTimeSourceList}
                    keySelector={sourceKeySelector}
                    labelSelector={sourceLabelSelector}
                    showHintAndError={false}
                />
                <ListSelection
                    label="Other layers"
                    className={styles.otherSourcesInput}
                    faramElementName="otherSources"
                    options={otherSourceList}
                    keySelector={sourceKeySelector}
                    labelSelector={sourceLabelSelector}
                    showHintAndError={false}
                />
            </Faram>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeMonitoringFilter);
