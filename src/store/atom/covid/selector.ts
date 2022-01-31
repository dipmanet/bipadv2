/* eslint-disable import/prefer-default-export */
import { AppState } from '../../types';

export const covidPageSelector = ({ covid }: AppState) => covid.covidPage;
