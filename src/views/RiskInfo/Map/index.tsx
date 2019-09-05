import React from 'react';
import memoize from 'memoize-one';

import CommonMap from '#components/CommonMap';

import {
    getMapPaddings,
} from '#constants';

interface Props {
}

interface State {
}

class RiskInfoMap extends React.PureComponent<Props, State> {
    private getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        }

        if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        }

        if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }

        return mapPaddings.noPaneExpanded;
    });

    public render() {
        const boundsPadding = this.getBoundsPadding(true, false);

        return (
            <CommonMap
                boundsPadding={boundsPadding}
            />
        );
    }
}

export default RiskInfoMap;
