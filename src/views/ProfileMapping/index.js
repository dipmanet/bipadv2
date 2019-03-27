import React from 'react';

export default class ProfileMapping extends React.PureComponent {
    render() {
        const { className } = this.props;
        return (
            <div
                className={className}
            />
        );
    }
}
