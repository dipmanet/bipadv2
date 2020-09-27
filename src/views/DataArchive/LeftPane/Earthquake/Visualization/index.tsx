import React from 'react';
import memoize from 'memoize-one';
import { groupList } from '#utils/common';
import * as PageType from '#store/atom/page/types';
import { FiltersElement } from '#types';
import RegionChart from './RegionChart';

import styles from './styles.scss';

interface EarthquakeWithFederals extends PageType.DataArchiveEarthquake {
    provinceTitle: string;
    districtTitle: string;
    municipalityTitle: string;
}

interface ChartData {
    label: string | number;
    value: number;
    mag4: number;
    mag5: number;
    mag6: number;
    mag7: number;
    mag8: number;
}


interface Props {
    earthquakeList: PageType.DataArchiveEarthquake[];
    globalFilters: FiltersElement;
}

type AdminLevel = 1 | 2 | 3 | undefined;
type FederalLevel = 'province' | 'district' | 'municipality';
type FederalField = 'provinceTitle' | 'districtTitle' | 'municipalityTitle';


const withFederalsList = (earthquakeList: PageType.DataArchiveEarthquake[]) => {
    const withFederals = earthquakeList.map((earthquakeItem) => {
        const provinceTitle = earthquakeItem && earthquakeItem.province ? earthquakeItem.province.title : '';
        const districtTitle = earthquakeItem && earthquakeItem.district ? earthquakeItem.district.title : '';
        const municipalityTitle = earthquakeItem && earthquakeItem.municipality ? earthquakeItem.municipality.title : '';

        return {
            ...earthquakeItem,
            provinceTitle,
            districtTitle,
            municipalityTitle,
        };
    });
    return withFederals;
};


const getMagCount = (selectedFederal: {
    key: string | number;
    value: EarthquakeWithFederals[];
}[]): ChartData[] => {
    const visualData = selectedFederal.map((s) => {
        const { key, value: regionwiseData } = s;
        let mag4 = 0;
        let mag5 = 0;
        let mag6 = 0;
        let mag7 = 0;
        let mag8 = 0;
        regionwiseData.forEach((data) => {
            const { magnitude } = data;
            if (magnitude < 5) {
                mag4 += 1;
                return;
            }
            if (magnitude < 6) {
                mag5 += 1;
                return;
            }
            if (magnitude < 7) {
                mag6 += 1;
                return;
            }
            if (magnitude < 8) {
                mag7 += 1;
                return;
            }
            if (magnitude >= 8) {
                mag8 += 1;
            }
        });

        return {
            ...s,
            label: key,
            value: regionwiseData.length,
            mag4,
            mag5,
            mag6,
            mag7,
            mag8,
        };
    });
    return visualData;
};

const getEarthquakeSummary = memoize(
    (earthquakeList: EarthquakeWithFederals[],
        federalLevel: FederalLevel): ChartData[] | undefined => {
        let selectedFederal;
        if (federalLevel === 'municipality') {
            const municipalityFreqCount = groupList(
                earthquakeList.filter(e => e.municipalityTitle),
                earthquake => earthquake.municipalityTitle,
            );
            selectedFederal = municipalityFreqCount;
        }
        if (federalLevel === 'district') {
            const districtFreqCount = groupList(
                earthquakeList.filter(e => e.districtTitle),
                earthquake => earthquake.districtTitle,
            );
            selectedFederal = districtFreqCount;
        }
        if (federalLevel === 'province') {
            const provinceFreqCount = groupList(
                earthquakeList.filter(e => e.provinceTitle),
                earthquake => earthquake.provinceTitle,
            );
            selectedFederal = provinceFreqCount;
        }
        if (selectedFederal) {
            return getMagCount(selectedFederal);
        }
        return undefined;
    },
);

const getChartTitle = (adminLevel: AdminLevel) => {
    const titles = [
        { level: 1, title: 'Province Wise Chart' },
        { level: 2, title: 'District Wise Chart' },
        { level: 3, title: 'Municipality Wise Chart' },
    ];
    let chartTitle = '';
    titles.forEach((t) => {
        const { level, title } = t;
        if (level === adminLevel) {
            chartTitle = title;
        }
    });
    return chartTitle;
};

const getFederalLevel = (adminLevel: AdminLevel): FederalLevel => {
    if (adminLevel === 1) {
        return 'district';
    }
    if (adminLevel === 2) {
        return 'municipality';
    }
    if (adminLevel === 3) {
        return 'municipality';
    }
    return 'province';
};

const EarthquakeViz = (props: Props) => {
    const { earthquakeList, globalFilters } = props;
    const { region: { adminLevel } } = globalFilters;

    const earthquakeWithFedetals = withFederalsList(earthquakeList);
    const earthquakeSummary = getEarthquakeSummary(
        earthquakeWithFedetals,
        getFederalLevel(adminLevel),
    );
    const chartTitle = getChartTitle(adminLevel);
    return (
        <div className={styles.earthquakeViz}>
            <RegionChart
                federalWiseData={earthquakeSummary}
                chartTitle={chartTitle}
            />
        </div>
    );
};

export default EarthquakeViz;
