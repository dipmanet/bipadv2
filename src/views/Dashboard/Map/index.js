import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import CommonMap from '#components/CommonMap';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { alertToGeojson } from '#utils/domain';
import { hazardTypesSelector } from '#selectors';

import styles from './styles.scss';

const Tooltip = ({ title, description }) => (
    <div className={styles.tooltip}>
        <h3 className={styles.heading}>
            {title}
        </h3>
        <p>
            {description}
        </p>
    </div>
);

Tooltip.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};


const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    alertList: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    hazards: PropTypes.object,
};

const defaultProps = {
    alertList: [],
    hazards: {},
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
});


class AlertMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

    getFeatureCollection = memoize(alertToGeojson);

    tooltipRendererParams = (id, { title, description }) => ({
        title,
        description,
    })

    render() {
        const {
            alertList,
            hazards,
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.props;

        const featureCollection = this.getFeatureCollection(alertList, hazards);
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        return (
            <React.Fragment>
                <CommonMap
                    boundsPadding={boundsPadding}
                />
                <MapSource
                    sourceKey="alerts"
                    geoJson={featureCollection}
                >
                    <MapLayer
                        layerKey="alerts-fill"
                        type="fill"
                        enableHover
                        paint={mapStyles.alertPolygon.fill}
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(AlertMap);
