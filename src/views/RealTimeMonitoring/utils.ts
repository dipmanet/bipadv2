import * as PageType from '#store/atom/page/types';

interface LegendItem {
    key?: string;
    color: string;
    label: string;
    style: string;
    radius?: number;
    order: number;
}

// river
export const getAutoRealTimeRiverLegends = (
    dataList: PageType.RealTimeRiver[],
    legendItems: LegendItem[],
) => {
    const uniqueLegendItems = [...new Set(dataList.map(
        item => `${item.status} and ${item.steady || 'steady'}`.toUpperCase(),
    ))];
    const autoLegends: LegendItem[] = [];
    uniqueLegendItems.forEach((item) => {
        legendItems.forEach((legendItem) => {
            if (item === legendItem.label.toUpperCase()) {
                autoLegends.push(legendItem);
            }
        });
    });

    return autoLegends;
};

// pollution
const getPollutionRanges = (pollutionItems: PageType.RealTimePollution[]) => {
    const allLegendKeys: string[] = [];
    pollutionItems.forEach((item) => {
        const { aqi } = item;
        if (aqi <= 50) {
            allLegendKeys.push('good');
            return;
        }
        if (aqi <= 100) {
            allLegendKeys.push('moderate');
            return;
        }
        if (aqi <= 150) {
            allLegendKeys.push('unhealthyForSensitive');
            return;
        }
        if (aqi <= 200) {
            allLegendKeys.push('unhealthy');
            return;
        }
        if (aqi <= 300) {
            allLegendKeys.push('veryUnhealthy');
            return;
        }
        if (aqi <= 400) {
            allLegendKeys.push('hazardous');
            return;
        }
        if (aqi < 400) {
            allLegendKeys.push('veryHazardous');
        }
    });
    const uniqueLegends = [...new Set(allLegendKeys)];
    return uniqueLegends;
};

export const getPollutionLegends = (
    pollutionItems: PageType.RealTimePollution[],
    pollutionLegendItems: LegendItem[],
) => {
    const pollutionRanges = getPollutionRanges(pollutionItems);
    const pollutionLegends: LegendItem[] = [];
    // eslint-disable-next-line array-callback-return
    pollutionRanges.map((ranges) => {
        // eslint-disable-next-line array-callback-return
        pollutionLegendItems.map((legendItem) => {
            const { key } = legendItem;
            if (key === ranges) {
                pollutionLegends.push(legendItem);
            }
        });
    });
    const sortedPollutionLegends = pollutionLegends.sort((a, b) => (a.order > b.order ? 1 : -1));
    return sortedPollutionLegends;
};
