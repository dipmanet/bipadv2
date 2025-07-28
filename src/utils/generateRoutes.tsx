/**
 * Generates an array of React Router RouteObject from the provided route settings.
 *
 * @param routeSettings - Array of route configurations, each containing:
 *   - path: the URL path for the route
 *   - load: a function returning a dynamic import for the route component
 *
 * @returns An array of RouteObject, each with:
 *   - path: URL path
 *   - element: the lazily loaded component wrapped in <Suspense> with a loading fallback
 *
 * This utility:
 * - Filters out routes without a defined path (e.g., fallback or error routes)
 * - Uses React.lazy for code splitting and <Suspense> to show a loading UI while loading.
 *
 * Example usage:
 * const routes = generateRoutes(routeSettings);
 * <Routes>{routes.map(r => <Route {...r} />)}</Routes>
 */

import { SomeRoute } from "#constants/routeSettings";
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "#components/Loading";

export function generateRoutes(routeSettings: SomeRoute[]): RouteObject[] {
	return routeSettings
		.filter((route) => route.path) // skip fallback routes with no path
		.map((route) => {
			const LazyComponent = lazy(route.load);

			return {
				path: route.path!,
				element: (
					<Suspense fallback={<Loading text="Loading Page" pending />}>
						<LazyComponent />
					</Suspense>
				),
			};
		});
}

// export function generateRoutes(routeSettings: SomeRoute[]): RouteObject[] {
// 	return routeSettings
// 		.filter((route) => route.path) // skip fallback routes with no path
// 		.map((route) => {
// 			// Loadable with loading fallback
// 			const LoadableComponent = Loadable({
// 				loader: route.load,
// 				loading: LoadingPage,
// 			});

// 			// helmetify
// 			const HelmetedComponent = helmetify(LoadableComponent);

// 			// authRoute wrapper
// 			const AuthenticatedComponent = authRoute<typeof route>()(HelmetedComponent);

// 			// errorBound wrapper
// 			const FinalComponent = errorBound<typeof route>(ErrorInPage)(AuthenticatedComponent);

// 			return {
// 				path: route.path!,
// 				element: <FinalComponent {...route} />,
// 			};
// 		});
// }
