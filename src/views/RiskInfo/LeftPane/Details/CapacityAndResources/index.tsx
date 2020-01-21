import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
} from '@togglecorp/fujs';

import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import DangerButton from '#rsca/Button/DangerButton';
import ListView from '#rscv/List/ListView';

import MapSource from '#re-map/MapSource';
import MapIcon from '#re-map/MapIcon';
import MapLayer from '#re-map/MapSource/MapLayer';

import CommonMap from '#components/CommonMap';
import Option from '#components/RadioInput/Option';
import Loading from '#components/Loading';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';
import { mapStyles } from '#constants';

import HealthIcon from '#resources/icons/Health-facility.png';
import FinanceIcon from '#resources/icons/Financing.png';
// import EducationIcon from '#resources/icons/Education.png';

import {
    ResourceType,
} from '#types';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface State {
    activeLayerKey: ResourceType | undefined;
}

interface ResourceElement {
    key: ResourceType;
    title: string;
}

interface Params {
}

type Props = NewProps<ComponentProps, Params>

const resourceLayerList: ResourceElement[] = [
    // { key: 'education', title: 'Education' },
    { key: 'finance', title: 'Finance' },
    { key: 'health', title: 'Health' },
];

const requestOptions: { [key: string]: ClientAttributes<Props, Params>} = {
    resourceGetRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => {
            if (!params || !params.resourceType) {
                return undefined;
            }

            return {
                // eslint-disable-next-line @typescript-eslint/camelcase
                resource_type: params.resourceType,
                limit: 99999,
            };
        },
    },
};

interface ResourceResponseElement {
    id: number;
    resourceType: ResourceType;
    title: string;
    description?: string;
    point: {
        type: 'string';
        coordinates: [number, number];
        ward: number;
    };
}

const emptyResourceList: ResourceResponseElement[] = [];

class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeLayerKey: undefined,
        };
    }

    private getGeojson = memoize((resourceList: ResourceResponseElement[]) => {
        const geojson = {
            type: 'FeatureCollection',
            features: resourceList.map(r => ({
                type: 'Feature',
                geometry: r.point,
                properties: r,
            })),
        };

        return geojson;
    })

    private getLayerRendererParams = (key, layer) => ({
        optionKey: key,
        label: layer.title,
        onClick: this.handleLayerClick,
        isActive: this.state.activeLayerKey === key,
    })

    private handleLayerClick = (layerKey) => {
        this.setState({ activeLayerKey: layerKey });

        this.props.requests.resourceGetRequest.do({
            resourceType: layerKey,
        });
    }

    private handleLayerUnselect = () => {
        this.setState({ activeLayerKey: undefined });
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const { activeLayerKey } = this.state;
        const sourceList = getResults(requests, 'resourceGetRequest', emptyResourceList) as ResourceResponseElement[];
        const geojson = this.getGeojson(sourceList);

        const pending = isAnyRequestPending(requests);

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.capacityAndResources, className)}>
                    <CommonMap sourceKey="capacity-and-resources" />
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Layers
                        </h4>
                        <DangerButton
                            disabled={!activeLayerKey}
                            onClick={this.handleLayerUnselect}
                            className={styles.clearButton}
                            transparent
                        >
                            Clear
                        </DangerButton>
                    </header>
                    <div className={styles.content}>
                        <ListView
                            data={resourceLayerList}
                            keySelector={d => d.key}
                            renderer={Option}
                            rendererParams={this.getLayerRendererParams}
                        />
                    </div>
                    <MapIcon
                        src={HealthIcon}
                        iconKey="health"
                    />
                    <MapIcon
                        src={FinanceIcon}
                        iconKey="finance"
                    />
                    { activeLayerKey && (
                        <MapSource
                            sourceKey="resource-symbol"
                            sourceOptions={{ type: 'geojson' }}
                            geoJson={geojson}
                        >
                            <MapLayer
                                layerKey="resource-symbol-background"
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.resourcePoint.circle,
                                }}
                            />
                            <MapLayer
                                layerKey="resource-symbol-icon"
                                layerOptions={{
                                    type: 'symbol',
                                    layout: {
                                        'icon-image': activeLayerKey,
                                        'icon-size': 0.02,
                                    },
                                }}
                            />
                        </MapSource>
                    )}
                </div>
            </>
        );
    }
} export default createRequestClient(requestOptions)(CapacityAndResources);
