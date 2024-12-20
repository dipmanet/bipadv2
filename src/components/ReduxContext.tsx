import { Persistor } from 'redux-persist';
import React from 'react';

interface ReduxContextType {
    persistor?: Persistor;
}

export default React.createContext<ReduxContextType>({});
