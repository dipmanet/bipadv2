import React from 'react';
import Helmet from 'react-helmet';

interface HelmetifyProps {
    title: string;
}

// eslint-disable-next-line max-len
const helmetify = <T extends HelmetifyProps>(WrappedComponent: React.ComponentType<T>) => (props: T) => (
    <React.Fragment>
        <Helmet>
            <meta charSet="utf-8" />
            <title>
                {props.title}
            </title>
        </Helmet>
        <WrappedComponent
            {...props}
        />
    </React.Fragment>
);

export default helmetify;
