import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import ErrorMessage from './ErrorMessage';

// eslint-disable-next-line react/prefer-stateless-function
class AppError extends React.Component {
    render() {
        return (
            <ErrorMessage
                {...this.props}
                errorText="Some problem occured. Try logging out."
            />
        );
    }
}

export default hoistNonReactStatics(AppError, ErrorMessage);
