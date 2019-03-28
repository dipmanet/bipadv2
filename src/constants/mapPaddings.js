import { currentStyle } from '#rsu/styles';
import styleProperties from './styleProperties';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

const getMapPaddings = () => {
    const spacingMedium = convertValueToNumber(currentStyle.dimens.spacingMedium);

    const widthLeftPanel = convertValueToNumber(styleProperties.widthLeftPanel);
    const widthRightPanel = convertValueToNumber(styleProperties.widthRightPanel);
    const widthNavbarRight = convertValueToNumber(styleProperties.widthNavbarRight);

    const bottomPadding = 64;
    const topPadding = 64;

    const mapPaddings = {
        leftPaneExpanded: {
            top: spacingMedium + topPadding,
            right: spacingMedium + widthNavbarRight,
            bottom: spacingMedium + bottomPadding,
            left: (2 * spacingMedium) + widthLeftPanel,
        },

        rightPaneExpanded: {
            top: spacingMedium + topPadding,
            right: (2 * spacingMedium) + widthNavbarRight + widthRightPanel,
            bottom: spacingMedium + bottomPadding,
            left: spacingMedium,
        },

        bothPaneExpanded: {
            top: spacingMedium + topPadding,
            right: (2 * spacingMedium) + widthNavbarRight + widthRightPanel,
            bottom: spacingMedium + bottomPadding,
            left: (2 * spacingMedium) + widthLeftPanel,
        },

        noPaneExpanded: {
            top: spacingMedium + topPadding,
            right: spacingMedium + widthNavbarRight,
            bottom: spacingMedium + bottomPadding,
            left: spacingMedium,
        },
    };

    return mapPaddings;
};

export default getMapPaddings;
