/* eslint-disable max-len */
/* eslint-disable arrow-parens */
import React from 'react';
import { Translation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import PropTypes from 'prop-types';


import ChoroplethMap from '#components/ChoroplethMap';
import SegmentInput from '#rsci/SegmentInput';
import Numeral from '#rscv/Numeral';
import { generatePaintByQuantile } from '#utils/domain';
import styles from './styles.scss';
import { generateMapState, generatePaintLegendByInterval, tooltipRenderer } from '../utils/utils';
import Legend, { legendItems } from '../Legend';

const propTypes = {
    geoareas: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

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
            language,
        } = this.props;
        console.log('This is mapping final', mapping);
        const mapState = generateMapState(geoareas, mapping, metric);
        console.log('This is map state', mapState);
        const colors = legendItems.map((item) => item.color);
        // eslint-disable-next-line max-len
        const { colorLegend, paintColor } = generatePaintLegendByInterval(mapState, colors.length, colors, language);

        return (
            <React.Fragment>
                <div className={_cs('map-legend-container', styles.legend, isTimeline && styles.timeline)}>
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
                    tooltipRenderer={(prop) => tooltipRenderer(prop, currentSelection, radioSelect, language)}
                    isDamageAndLoss
                />
            </React.Fragment>
        );
    }
}
