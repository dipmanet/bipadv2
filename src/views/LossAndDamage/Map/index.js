import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import ChoroplethMap from '#components/ChoroplethMap';
import { generatePaintByQuantile } from '#utils/domain';
import styles from './styles.scss';
import Legend, { legendItems } from '../Legend';
import { generateMapState, tooltipRenderer, generatePaintLegendByInterval } from '../utils/utils';


const propTypes = {
    geoareas: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
};

export default class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            geoareas,
            mapping,
            metric,
            isTimeline,
            sourceKey,
            maxValue,
            metricName,
            metricKey,
            onMetricChange,
            radioSelect,
            currentSelection,
            pending,
        } = this.props;


        const mapState = generateMapState(geoareas, mapping, metric);
        const colors = legendItems.map(item => item.color);

        // eslint-disable-next-line max-len
        const { colorLegend, paintColor } = generatePaintLegendByInterval(mapState, colors.length, colors);

        return (
            <React.Fragment>
                <div
                    className={_cs(
                        'map-legend-container',
                        styles.legend,
                        isTimeline && styles.timeline,
                    )}
                >
                    <Legend
                        currentSelection={currentSelection}
                        legend={colorLegend}
                        pending={pending}
                        mapState={mapState}
                    />
                </div>
                <ChoroplethMap
                    sourceKey={sourceKey}
                    paint={paintColor}
                    mapState={mapState}
                    regionLevel={radioSelect}
                    tooltipRenderer={prop => tooltipRenderer(prop, currentSelection, radioSelect)}
                    isDamageAndLoss
                />
            </React.Fragment>
        );
    }
}
