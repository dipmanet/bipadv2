import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import { mapStyleSelector } from '#selectors';
import { setMapStyleAction } from '#actionCreators';

import DangerButton from '#rsca/Button/DangerButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import Option from '#components/RadioInput/Option';
import ListView from '#rscv/List/ListView';
import osmStyle from '#mapStyles/rasterStyle';

import { AppState } from '#store/types';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface State {
    previousMapStyle: string;
    selectedId: number | string | undefined;
}

interface LayerOption {
    id: number;
    label: string;
    style: string | object;
}

interface PropsFromState {
    mapStyle: string;
}

interface PropsFromDispatch {
    setMapStyle: typeof setMapStyleAction;
}

const layerOptions: LayerOption[] = [
    {
        id: 1,
        label: 'OSM',
        style: osmStyle,
    },
];

const mapStateToProps = (state: AppState): PropsFromState => ({
    mapStyle: mapStyleSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setMapStyle: params => dispatch(setMapStyleAction(params)),
});

const keySelector = (d: LayerOption) => d.id;
const labelSelector = (d: LayerOption) => d.label;

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class Exposure extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const { mapStyle } = this.props;
        this.state = {
            selectedId: undefined,
            previousMapStyle: mapStyle,
        };
    }

    public componentWillUnmount() {
        const { setMapStyle } = this.props;
        const {
            previousMapStyle,
            selectedId,
        } = this.state;

        setMapStyle(previousMapStyle);
        if (selectedId) {
            this.context.removeLayer(`exposure-${selectedId}`);
        }
    }

    private handleClick = (key: number | string) => {
        const { setMapStyle } = this.props;

        this.setState({
            selectedId: key,
        });
        const layer = layerOptions.find(l => l.id === key);

        if (layer) {
            const { style } = layer;
            setMapStyle(style);
            this.context.addLayer({
                title: layer.label,
                id: `exposure-${layer.id}`,
            });
        }
    }

    private handleLayerUnselect = () => {
        const {
            selectedId,
            previousMapStyle,
        } = this.state;

        const { setMapStyle } = this.props;

        if (selectedId) {
            this.context.removeLayer(`exposure-${selectedId}`);
        }

        setMapStyle(previousMapStyle);

        this.setState({
            selectedId: undefined,
        });
    }

    private getRendererParams = (_: number, layer: LayerOption) => {
        const { selectedId } = this.state;

        return ({
            className: styles.option,
            label: labelSelector(layer),
            optionKey: keySelector(layer),
            onClick: this.handleClick,
            isActive: (selectedId === keySelector(layer)),
        });
    }

    public render() {
        const {
            className,
        } = this.props;

        const { selectedId } = this.state;

        return (
            <div className={_cs(styles.exposure, className)}>
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        Layers
                    </h2>
                    <DangerButton
                        disabled={!selectedId}
                        onClick={this.handleLayerUnselect}
                        className={styles.clearButton}
                        transparent
                    >
                        Clear
                    </DangerButton>
                </header>
                <ListView
                    className={styles.content}
                    data={layerOptions}
                    keySelector={keySelector}
                    renderer={Option}
                    rendererParams={this.getRendererParams}
                />
            </div>
        );
    }
}

Exposure.contextType = RiskInfoLayerContext;
export default connect(mapStateToProps, mapDispatchToProps)(Exposure);
