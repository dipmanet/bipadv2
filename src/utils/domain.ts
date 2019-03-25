import { Loss, HazardType } from '#store/atom/page/types';

export const ONE_HUMAN_EQUIVALENT_MONEY = 50000;

// The following give the effect of loss. NOTE: They sum to 1
export const MONEY_LOSS_FACTOR = 0.2;
export const PEOPLE_LOSS_FACTOR = 0.4;
export const LIVESTOCK_LOSS_FACTOR = 0.1;
export const INFRASTRUCTURE_LOSS_FACTOR = 0.3;

export const calculateSeverity = (loss: Loss, scaleFactor: number = 1) => {
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

    return severity * scaleFactor;
};

export const calculateCategorizedSeverity = (loss: Loss, scaleFactor?: number) => {
    const severity = calculateSeverity(loss, scaleFactor);
    if (severity < 4) {
        return 'Minor';
    }
    if (severity < 50) {
        return 'Major';
    }
    return 'Catastrophic';
};

export const getHazardColor = (hazards: HazardType[], hazardId?: number) => {
    if (!hazardId) {
        return '#4666b0';
    }
    const hazard = hazards[hazardId];
    if (!hazard || !hazard.color) {
        return '#4666b0';
    }
    return hazard.color;
};
