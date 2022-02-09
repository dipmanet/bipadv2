import { RouteState } from './atom/route/types';
import { PageState } from './atom/page/types';
import { AuthState } from './atom/auth/types';
import { CovidState } from './atom/covid/types';
import { HealthInfrastructureState } from './atom/healthinfrastructure/types';

// eslint-disable-next-line import/prefer-default-export
export interface AppState {
    route: RouteState;
    page: PageState;
    auth: AuthState;
    covid: CovidState;
    healthInfrastructure: HealthInfrastructureState;
}
