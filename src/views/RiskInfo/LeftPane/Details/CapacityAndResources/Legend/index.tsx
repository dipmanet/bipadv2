import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import Legend from '#rscz/Legend';
import { TitleContext, Profile } from '#components/TitleContext';
import legendItems from './legendItems';

import OpenspaceLegends from '../OpenspaceModals/OpenspaceLegends/main';
import styles from './styles.scss';
import OpenspaceSummary from '../OpenspaceModals/OpenspaceLegends/OpenspaceSummary';

interface Props {
    handleDroneImage: (loading: boolean) => void;
    activeLayersIndication: {
        education: boolean;
        health: boolean;
        finance: boolean;
        governance: boolean;
        hotelandrestaurant: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
        openspace: boolean;
        communityspace: boolean;
        bridge: boolean;
        evacuationcentre: boolean;
        warehouse: boolean;
    };
    resourceIdForLegend: number | null;
}

const itemSelector = (d: { label: string }) => d.label;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;
const legendColorSelector = (d: { color: string }) => d.color;

const CapacityAndResourcesLegend = (props: Props) => {
    const titleContext = useContext(TitleContext);
    // for dynamic legend render

    const getActiveLegends = () => {
        const { activeLayersIndication } = props;

        const activeLegends = legendItems.filter((item) => {
            if (activeLayersIndication[item.key]) {
                return item;
            }
            return null;
        });
        return activeLegends;
    };
    const activeLegends = getActiveLegends();

    const { setCapacityAndResources } = titleContext;

    if (activeLegends.length === 0) {
        if (setCapacityAndResources) {
            setCapacityAndResources('');
        }
        return null;
    }


    if (activeLegends.length === 1) {
        const { label } = activeLegends[0];
        if (setCapacityAndResources) {
            setCapacityAndResources((prevState: string) => {
                if (prevState !== label) {
                    return label;
                }
                return prevState;
            });
        }
    }

    if (activeLegends.length > 1) {
        if (setCapacityAndResources) {
            setCapacityAndResources('');
        }
    }

    const showLayerControls = activeLegends.some(legend => legend.key === 'openspace' || legend.key === 'communityspace');
    const openspaceOn = activeLegends.some(legend => legend.key === 'openspace');
    const communityspaceOn = activeLegends.some(legend => legend.key === 'communityspace');
    let legendTitle;

    if (openspaceOn && communityspaceOn) {
        legendTitle = 'Layer Boundary';
    } else if (activeLegends.filter(e => String(e.key) !== 'openspace' && String(e.key) === 'communityspace').length > 0) {
        legendTitle = 'Communityspace Boundary';
    } else legendTitle = 'Openspace Boundary';

    const { resourceIdForLegend, handleDroneImage, activeLayersIndication } = props;

    return (
        <React.Fragment>
            {!resourceIdForLegend && openspaceOn && (
                <div className={_cs(styles.summary)}>
                    <OpenspaceSummary />
                </div>
            )}
            {showLayerControls && resourceIdForLegend && (
                <OpenspaceLegends
                    handleDroneImage={handleDroneImage}
                    resourceIdForLegend={resourceIdForLegend}
                    openspaceOn={openspaceOn}
                    communityspaceOn={communityspaceOn}
                    legendTitle={legendTitle}
                />
            )}
            <div className={_cs(styles.wrapper, 'map-legend-container')}>
                <Translation>
                    {
                        t => (
                            <div className={styles.title}>{t('Capacity and Resources')}</div>
                        )
                    }
                </Translation>
                <Legend
                    className={styles.legend}
                    // data={capacityAndResourcesLegendItems}
                    data={activeLegends}
                    itemClassName={styles.legendItem}
                    keySelector={itemSelector}
                    // iconSelector={iconSelector}
                    labelSelector={legendLabelSelector}
                    symbolClassNameSelector={classNameSelector}
                    colorSelector={legendColorSelector}
                    emptyComponent={null}
                />
            </div>
        </React.Fragment>
    );
};

export default CapacityAndResourcesLegend;
