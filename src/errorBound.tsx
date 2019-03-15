import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

// export default (ErrorComponent) => {

interface Handler {
    handleException?(error: Error, errorInfo: React.ErrorInfo): void;
}

export default function unnamed<P>(ErrorComponent: React.ComponentType<P> & Handler) {
    return (WrappedComponent: React.ComponentType<P>) => {
        interface State {
            hasError: boolean;
        }

        class BoundedComponent extends React.PureComponent<P, State> {
            public constructor(props: P) {
                super(props);

                this.state = {
                    hasError: false,
                };
            }

            public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
                this.setState({ hasError: true });

                if (ErrorComponent && ErrorComponent.handleException) {
                    ErrorComponent.handleException(error, errorInfo);
                }
            }

            public render() {
                const { ...otherProps } = this.props;

                if (!this.state.hasError) {
                    return (
                        <WrappedComponent {...otherProps} />
                    );
                }

                if (ErrorComponent) {
                    return (
                        <ErrorComponent
                            {...otherProps}
                        />
                    );
                }

                const defaultErrorText = '(x_x)';
                return (
                    <div>
                        { defaultErrorText }
                    </div>
                );
            }
        }

        return hoistNonReactStatics<React.ComponentType<P>, React.ComponentType<P> & Handler>(
            BoundedComponent,
            WrappedComponent,
        );
    };
}
