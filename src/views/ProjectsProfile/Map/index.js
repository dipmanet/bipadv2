import React from 'react';
import memoize from 'memoize-one';

import ChoroplethMap from '#components/ChoroplethMap';
import { getMapPaddings } from '#constants';

import styles from './styles.scss';

export default class ProjectsProfileMap extends React.PureComponent {
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


    render() {
        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.props;

        const paint = {
            'fill-color': '#deebf7',
        };
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);

        return (
            <ChoroplethMap
                boundsPadding={boundsPadding}
                paint={paint}
            />
        );
    }
}
