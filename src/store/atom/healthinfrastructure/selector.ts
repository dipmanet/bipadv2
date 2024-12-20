/* eslint-disable import/prefer-default-export */
import { AppState } from '../../types';

export const healthInfrastructurePageSelector = (
    { healthInfrastructure }: AppState,
) => healthInfrastructure.healthInfrastructurePage;
