import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    isParamRequired,
    reverseRoute,
} from '@togglecorp/fujs';

import boundError from '#rscg/BoundError';
import Bundle from '#rscg/Bundle';
import withTracker from '#rscg/withTracker';

import AppError from '#components/error/AppError';
import { routes } from '#constants/routes';
import { setRouteParamsAction } from '#actionCreators';

const ErrorBoundBundle = boundError(AppError)(Bundle);

const LoadingRenderer = ({ text }) => (
    <div
        style={{
            zIndex: '1111',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
        }}
    >
        {text}
    </div>
);

const Page = ({ name, disabled, ...otherProps }) => {
    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {name}
                </title>
            </Helmet>
            <ErrorBoundBundle
                {...otherProps}
                name={name}
                key={name}
                renderer={LoadingRenderer}
            />
        </Fragment>
    );
};

const propTypes = {
    match: PropTypes.shape({
        location: PropTypes.string,
        params: PropTypes.shape({
            dummy: PropTypes.string,
        }),
        url: PropTypes.string,
    }).isRequired,

    location: PropTypes.shape({
        pathname: PropTypes.string,
    }).isRequired,

    setRouteParams: PropTypes.func.isRequired,

    name: PropTypes.string.isRequired,
    path: PropTypes.string,
};

const defaultProps = {
    path: '',
};

const mapDispatchToProps = dispatch => ({
    setRouteParams: params => dispatch(setRouteParamsAction(params)),
});

@withTracker
@connect(undefined, mapDispatchToProps)
class RouteSynchronizer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    componentDidMount() {
        const {
            match,
            location,
            setRouteParams,
        } = this.props;

        setRouteParams({
            match,
            location,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            JSON.stringify(this.props.match) !== JSON.stringify(nextProps.match)
            || JSON.stringify(this.props.location) !== JSON.stringify(nextProps.location)
        ) {
            this.props.setRouteParams({
                match: nextProps.match,
                location: nextProps.location,
            });
        }
    }

    render() {
        const {
            name,
            match, // eslint-disable-line no-unused-vars
            path, // eslint-disable-line no-unused-vars
            ...otherProps
        } = this.props;

        return (
            <Page
                name={name}
                {...otherProps}
            />
        );
    }
}

export default RouteSynchronizer;
