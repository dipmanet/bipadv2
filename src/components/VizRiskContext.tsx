import React from 'react';

export interface VizRiskContextProps {
    currentPage?: number;
    showFirstSlide?: boolean;
    infraChosen?: string;
    floodInfraChosen?: string;
    evacChosen? : string;
}
const VizRiskContext = React.createContext<VizRiskContextProps>({});
VizRiskContext.displayName = 'VizRiskContext';

export default VizRiskContext;
