import Loading from "#components/Loading";
import DangerButton from "#rsca/Button/DangerButton";
import styles from "../styles.module.scss";

function reloadPage() {
	window.location.reload(false);
}
interface LoadOptions {
	error: string;
	retry: () => void;
}

export const ErrorInPage = () => (
	<div className={styles.errorInPage}>
		Some problem occurred.
		<DangerButton transparent onClick={reloadPage}>
			Reload
		</DangerButton>
	</div>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
	<div className={styles.retryableErrorInPage}>
		Some problem occurred.
		<DangerButton onClick={retry} transparent>
			Reload
		</DangerButton>
	</div>
);

export const LoadingPage = ({ error, retry }: LoadOptions) => {
	if (error) {
		// NOTE: show error while loading page
		console.error(error);
		return <RetryableErrorInPage error={error} retry={retry} />;
	}
	return <Loading text="Loading Page" pending />;
};

// to be use later
// import Loading from "#components/Loading";
// import { SomeRoute } from "#constants/routeSettings";
// import { Suspense, lazy } from "react";
// import { RouteObject } from "react-router-dom";
// import helmetify from "src/helmetify";
// import authRoute from "#components/authRoute";
// import { ErrorInPage } from "src/Multiplexer/components";
// import errorBound from "src/errorBound";

// export function generateRoutes(routeSettings: SomeRoute[]): RouteObject[] {
// 	return routeSettings
// 		.filter((route) => route.path) // skip fallback routes with no path
// 		.map((route) => {
// 			// lazy load
// 			const LazyComponent = lazy(route.load);

// 			// wrap with helmetify
// 			const HelmetedComponent = helmetify(LazyComponent);

// 			// wrap with authRoute
// 			const AuthenticatedComponent = authRoute<typeof route>()(HelmetedComponent);

// 			// wrap with error boundary
// 			const FinalComponent = errorBound<typeof route>(ErrorInPage)(AuthenticatedComponent);

// 			return {
// 				path: route.path!,
// 				element: (
// 					<Suspense fallback={<Loading text="Loading Resources" />}>
// 						<FinalComponent {...route} />
// 					</Suspense>
// 				),
// 			};
// 		});
// }
