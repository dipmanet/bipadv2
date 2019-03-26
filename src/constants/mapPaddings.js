import { currentStyle } from '#rsu/styles';
import styleProperties from './styleProperties';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

const getMapPaddings = () => {
    const spacingMedium = convertValueToNumber(currentStyle.dimens.spacingMedium);

    const widthLeftPanel = convertValueToNumber(styleProperties.widthLeftPanel);
    const widthRightPanel = convertValueToNumber(styleProperties.widthRightPanel);
    const widthNavbarRight = convertValueToNumber(styleProperties.widthNavbarRight);

    const mapPaddings = {
        leftPaneExpanded: {
            top: spacingMedium,
            right: spacingMedium + widthNavbarRight,
            bottom: spacingMedium,
            left: (2 * spacingMedium) + widthLeftPanel,
        },

        rightPaneExpanded: {
            top: spacingMedium,
            right: (2 * spacingMedium) + widthNavbarRight + widthRightPanel,
            bottom: spacingMedium,
            left: spacingMedium,
        },

        bothPaneExpanded: {
            top: spacingMedium,
            right: (2 * spacingMedium) + widthNavbarRight + widthRightPanel,
            bottom: spacingMedium,
            left: (2 * spacingMedium) + widthLeftPanel,
        },

        noPaneExpanded: {
            top: spacingMedium,
            right: spacingMedium + widthNavbarRight,
            bottom: spacingMedium,
            left: spacingMedium,
        },
    };

    return mapPaddings;
};

export default getMapPaddings;
