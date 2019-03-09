import { RouteState } from './atom/route/types';
import { PageState } from './atom/page/types';

// eslint-disable-next-line import/prefer-default-export
export interface AppState {
    route: RouteState;
    page: PageState;
}
