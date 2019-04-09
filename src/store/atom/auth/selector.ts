import { AppState } from '../../types';

import { AuthState } from './types';


// eslint-disable-next-line import/prefer-default-export
export const authStateSelector = ({ auth }: AppState): AuthState => auth;
