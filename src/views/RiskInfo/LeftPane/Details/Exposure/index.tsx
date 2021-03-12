import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';
import LayerSelection from '#components/LayerSelection';
import { mapStyleSelector } from '#selectors';
import { setMapStyleAction } from '#actionCreators';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import DangerButton from '#rsca/Button/DangerButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import Option from '#components/RadioInput/Option';
import ListView from '#rscv/List/ListView';
import osmStyle from '#mapStyles/rasterStyle';
import LayerItem from '#components/LayerItem';
import { getLayerHierarchy } from '#utils/domain';

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
// const requests: { [key: string]: ClientAttributes<OwnProps, Params>} = {
//     layerGetRequest: {
//         url: '/layer/',
//         method: methods.GET,
//         onMount: true,
//         onSuccess: ({ response, params }) => {
//             interface Response { results: PageTypes.HazardType[] }
//             const { results } = response as Response;
//             params.data(results);
//             console.log('This is hazard>>>', results);
//         },
//         extras: {
//             schemaName: 'hazardResponse',
//         },
//     },

//     layerGroupGetRequest: {
//         url: '/layer-group/',
//         method: methods.GET,
//         onMount: true,

//         extras: {
//             schemaName: 'hazardResponse',
//         },

//     },
// };
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

    private getLayerRendererParams = (layerId: LayerHierarchy['id'], layer: LayerHierarchy) => ({
        data: layer,
        layerSelectionItem: this.props.layerSelectionItem,
    })

    private getHierarchy = memoize(getLayerHierarchy);

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
        } = this.props;
        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );


        // layerGetRequest.setDefaultParams({
        //     data: this.test,
        // });
        const exposureLayer = layers.filter(item => item.category === 'exposure');
        const { selectedId } = this.state;

        // const layers = [{ id: 22,
        //     title: 'Building Footprints',
        //     category: 'exposure',
        //     level: 0,
        //     longDescription: 'This is bulding resource',
        //     order: 2,
        //     shortDescription: 'This is sdahskdhkas dkaskd kas kh askd akshd
        // kashd ka skdh kas dka sdaksd kahsd aksh dkhas kdkas kdkas kdh askd kas
        // kda ks dkas dkas kdkasdk ask dkashd kas kd a',
        //     treeId: 22,
        //     children: [{
        //         category: 'exposure', id: 1, level: 1, title: 'Next',
        //     }, {
        //         category: 'exposure', id: 2, level: 1, title: 'preview',
        //     }] }];
        // const test=()=>{
        //      data: {
        //         category: 'hazard',
        //         children: null,
        //         id: 1,
        //         level: 0,
        //         longDescription: 'Hello',
        //         order: 2,
        //         shortDescription: 'This',
        //         title: 'landslide',
        //         treeId: 22,
        //     },
        //     layerSelectionItem: undefined
        // }

        return (
            <div className={_cs(styles.exposure, className)}>
                {/* <header className={styles.header}>
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
                /> */}
                <LayerSelection
                    className={_cs(styles.hazard, className)}
                    layerList={exposureLayer}
                />
            </div>
        );
    }
}

Exposure.contextType = RiskInfoLayerContext;
export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient()(
            Exposure,
        ),
    ),
);
