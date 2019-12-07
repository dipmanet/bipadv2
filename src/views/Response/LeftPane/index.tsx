import React from 'react';
import { _cs } from '@togglecorp/fujs';

import IncidentInfo from '#components/IncidentInfo';

import ResponseFilter from '../Filter';

import styles from './styles.scss';

interface Props {
}

class LeftPane extends React.PureComponent<Props> {
    public render() {
        const {
            className,

            incident,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,

            resourceList,
            filteredResourceList,
            setFilter,
            setStockPileFilter,
        } = this.props;

        return (
            <div className={_cs(className, styles.leftPane)}>
                <IncidentInfo
                    incident={incident}
                    wardsMap={wardsMap}
                    provincesMap={provincesMap}
                    districtsMap={districtsMap}
                    municipalitiesMap={municipalitiesMap}
                    hideLink
                />
                <ResponseFilter
                    resourceList={resourceList}
                    filteredList={filteredResourceList}
                    setFilter={setFilter}
                    setStockPileFilter={setStockPileFilter}
                />
            </div>
        );
    }
}

export default LeftPane;
