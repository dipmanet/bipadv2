import React from 'react';

export interface VizRiskContextProps {
    currentPage?: number;
    showFirstSlide?: boolean;
}
const VizRiskContext = React.createContext<VizRiskContextProps>({});
VizRiskContext.displayName = 'VizRiskContext';

export default VizRiskContext;
