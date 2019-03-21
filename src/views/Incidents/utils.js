export const ONE_HUMAN_EQUIVALENT_MONEY = 50000;

// The following give the effect of loss. NOTE: They sum to 1
// FIXME: The exact values to be decided later
export const MONEY_LOSS_FACTOR = 0.2;
export const PEOPLE_LOSS_FACTOR = 0.4;
export const LIVESTOCK_LOSS_FACTOR = 0.1;
export const INFRASTRUCTURE_LOSS_FACTOR = 0.3;

export const calculateSeverity = (loss) => {
    const {
        estimatedLoss = 0,
        peopleDeathCount = 0,
        livestockDestroyedCount = 0,
        infrastructureDestroyedCount = 0,
    } = loss;

    const offset = 0.2;

    const severity = offset +
        ((MONEY_LOSS_FACTOR * estimatedLoss) / ONE_HUMAN_EQUIVALENT_MONEY) +
        (PEOPLE_LOSS_FACTOR * peopleDeathCount) +
        (LIVESTOCK_LOSS_FACTOR * livestockDestroyedCount) +
        (INFRASTRUCTURE_LOSS_FACTOR * infrastructureDestroyedCount);

    return severity;
};

export const calculateScaledSeverity = (scaleFactor, loss) => scaleFactor * calculateSeverity(loss);

// FIXME: The exact values to be decided later
export const calculateCategorizedSeverity = (loss) => {
    const severity = calculateSeverity(loss);
    if (severity < 4) return 'Minor';
    if (severity < 50) return 'Major';
    return 'Catastrophic';
};

export const hazardColorMap = {
    fire: '#ff4656',
    earthquake: '#f08842',
    flood: '#f08842',
    landslide: '#f08842',
};

export const getHazardColor = (hazard, hari) => {
    if (hari) {
        console.warn(hazard);
    }
    if (hazard.color) {
        return hazard.color;
    }
    return hazardColorMap[hazard.title.toLowerCase()] || '#4666b0';
};
