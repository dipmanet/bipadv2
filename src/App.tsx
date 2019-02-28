import React from 'react';

import Multiplexer from './Multiplexer';

interface State {
}
interface Props {
}

// NOTE: BrowserRouter is acting weird so not using React.PureComponent
/* Loads required info from server */
/* Attach prompt on Router context */
/* Create Router context */
// eslint-disable-next-line react/prefer-stateless-function
export default class App extends React.Component<Props, State> {
    public render() {
        return (
            <Multiplexer />
        );
    }
}
