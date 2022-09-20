/* eslint-disable import/prefer-default-export */
import Numeral from '#rscv/Numeral';

export const estimatedLossValueFormatter = (d) => {
    const { number, normalizeSuffix } = Numeral.getNormalizedNumber({
        value: d,
        normal: true,
        precision: 0,
    });
    if (normalizeSuffix) {
        return `${number}${normalizeSuffix}`;
    }
    return number;
};
