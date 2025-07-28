import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export interface RouterProps {
	navigate: ReturnType<typeof useNavigate>;
	location: ReturnType<typeof useLocation>;
	params: ReturnType<typeof useParams>;
}

// This HOC injects router props into class-based components
export function WithRouter<P extends object>(
	Component: React.ComponentType<P & { router: RouterProps }>
): React.FC<P> {
	return function ComponentWithRouterProp(props: P) {
		const navigate = useNavigate();
		const location = useLocation();
		const params = useParams();

		return <Component {...props} router={{ navigate, location, params }} />;
	};
}
