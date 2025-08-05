import { lazy, Suspense, ReactElement, ComponentType } from "react";
import Loading from "#components/Loading";

/**
 * Wraps a lazy-loaded component in Suspense with a fallback.
 * For components that take no props or will be rendered without props.
 */
export function lazyWithSuspense(
	importFn: () => Promise<{ default: ComponentType }>
): ReactElement {
	const LazyComponent = lazy(importFn);

	return (
		<Suspense fallback={<Loading text="Loading Page" pending />}>
			<LazyComponent />
		</Suspense>
	);
}
