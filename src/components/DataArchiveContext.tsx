import React from 'react';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

export interface DataArchiveContextProps {
    chosenOption?: Options;
    handleOptionClick?: Function;
    setData?: Function;
    data?: [];
}
const DataArchiveContext = React.createContext<DataArchiveContextProps>({});
DataArchiveContext.displayName = 'DataArchiveContext';

export default DataArchiveContext;
