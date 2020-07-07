import React from 'react';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

export interface DataArchiveContextProps {
    chosenOption?: Options;
    handleOptionClick?: Function;
    setData?: Function;
    data?: [];
}

export default React.createContext<DataArchiveContextProps>({});
