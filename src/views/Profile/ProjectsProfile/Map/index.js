import React from 'react';
import memoize from 'memoize-one';
import { _cs, mapToList, isNotDefined } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';

import ChoroplethMap from '#components/ChoroplethMap';
import { getMapPaddings } from '#constants';

import styles from './styles.scss';

const colorGrade = [
    '#f0f9e9',
    '#bae4bc',
    '#7bccc4',
    '#43a2ca',
    '#0868ac',
];

export default class ProjectsProfileMap extends React.PureComponent {
    generateColor = memoize((maxValue, minValue, colorMapping) => {
        const newColor = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;
        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    });

    generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'count'],
            ...color,
        ],
    }))

    generateMapState = memoize((projects, regionLevel, regions) => {
        const accessor = (
            (isNotDefined(regionLevel) && 'province')
            || (regionLevel === 1 && 'district')
            || (regionLevel === 2 && 'municipality')
            || (regionLevel === 3 && 'ward')
        );

        const mapping = {};
        projects.forEach((project) => {
            const values = project[accessor];
            Object.keys(values).forEach((id) => {
                mapping[id] = (mapping[id] || 0) + 1;
            });
        });

        const selectedRegion = (
            (isNotDefined(regionLevel) && regions.provinces)
            || (regionLevel === 1 && regions.districts)
            || (regionLevel === 2 && regions.municipalities)
            || (regionLevel === 3 && regions.wards)
        );

        return mapToList(
            selectedRegion,
            (_, key) => ({ id: key, value: { count: mapping[key] || 0 } }),
        );
    });

    render() {
        const {
            leftPaneExpanded,
            rightPaneExpanded,
            projects,
            regions,
            regionLevel,
        } = this.props;

        const mapState = this.generateMapState(projects, regionLevel, regions);
        const maxValue = Math.max(1, ...mapState.map(item => item.value.count));
        const color = this.generateColor(maxValue, 0, colorGrade);
        const colorUnitWidth = `${100 / colorGrade.length}%`;
        const colorPaint = this.generatePaint(color);

        return (
            <React.Fragment>
                <div
                    className={_cs(
                        styles.legend,
                        leftPaneExpanded && styles.leftPaneExpanded,
                    )}
                >
                    <h5 className={styles.heading}>
                        No. of projects
                    </h5>
                    <div className={styles.range}>
                        <Numeral
                            className={styles.min}
                            value={0}
                            precision={0}
                        />
                        <Numeral
                            className={styles.max}
                            value={maxValue}
                            precision={0}
                        />
                    </div>
                    <div className={styles.scale}>
                        { colorGrade.map(c => (
                            <div
                                key={c}
                                className={styles.colorUnit}
                                style={{
                                    width: colorUnitWidth,
                                    backgroundColor: c,
                                }}
                            />
                        ))}
                    </div>
                </div>
                <ChoroplethMap
                    paint={colorPaint}
                    mapState={mapState}
                />
            </React.Fragment>
        );
    }
}
