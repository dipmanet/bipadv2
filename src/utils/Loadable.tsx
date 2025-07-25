import React, { Suspense, ComponentType, LazyExoticComponent } from "react";

interface LoadableOptions<T extends object = Record<string, unknown>> {
	loader: () => Promise<{ default: ComponentType<T> }>;
	loading: ComponentType;
}

/**
 * Loadable utility replicating react-loadable API using React.lazy + Suspense.
 */
export default function Loadable<T extends object = Record<string, unknown>>({
	loader,
	loading: LoadingComponent,
}: LoadableOptions<T>): ComponentType<T> {
	const LazyComponent: LazyExoticComponent<ComponentType<T>> = React.lazy(loader);

	const LoadableWrapper: ComponentType<T> = (props) => {
		return (
			<Suspense fallback={<LoadingComponent />}>
				<LazyComponent {...props} />
			</Suspense>
		);
	};

	return LoadableWrapper;
}
