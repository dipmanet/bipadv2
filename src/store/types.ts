/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/indent */
import { RouteState } from './atom/route/types';
import { PageState } from './atom/page/types';
import { AuthState } from './atom/auth/types';
import { CovidState } from './atom/covid/types';
import { HealthInfrastructureState } from './atom/healthinfrastructure/types';
import { IncidentState } from './atom/incident/types';
import { NotificationState } from './atom/notification/types';
import { AdminState } from './atom/admin/types';

// eslint-disable-next-line import/prefer-default-export
export interface AppState {
	route: RouteState;
	page: PageState;
	auth: AuthState;
	covid: CovidState;
	healthInfrastructure: HealthInfrastructureState;
	incident: IncidentState;
	notification: NotificationState;
	admin: AdminState;
}
