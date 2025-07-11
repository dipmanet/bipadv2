import React, { useContext, useEffect } from "react";
// import Helmet from "react-helmet";

import PageContext from "#components/PageContext";

interface HelmetifyProps {
	name: string;
	title: string;
	path: string;
	iconName: string;
}

// eslint-disable-next-line max-len
const helmetify =
	<T extends HelmetifyProps>(WrappedComponent: React.ComponentType<T>) =>
	(props: T) => {
		const pageContext = useContext(PageContext);
		useEffect(() => {
			console.info("Mounting", props.name);
			if (pageContext.setActiveRouteDetails) {
				pageContext.setActiveRouteDetails({
					name: props.name,
					title: props.title,
					path: props.path,
					iconName: props.iconName,
				});
			}

			return () => {
				console.info("Unmounting", props.name);
			};
		}, []);

		return (
			<React.Fragment>
				{/* <Helmet> */}
				<meta charSet="utf-8" />
				<title>{props.title}</title>
				{/* </Helmet> */}
				{/* <WrappedComponent {...props} /> */}
			</React.Fragment>
		);
	};

export default helmetify;
