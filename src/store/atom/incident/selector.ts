/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable import/prefer-default-export */
import { AppState } from '../../types';

export const incidentPageSelector = (
	{ incident }: AppState,
) => incident.incidentPage;
