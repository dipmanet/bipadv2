import React from "react";

type RiskInfoLayerType = unknown;

const RiskInfoLayerContext = React.createContext<RiskInfoLayerType>({} as RiskInfoLayerType);

export default RiskInfoLayerContext;
