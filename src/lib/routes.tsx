import React from "react";

// common
export const ErrorBoundary = React.lazy(() => import("#components/Layouts/ErrorBoundary"));
export const PageNotFound = React.lazy(() => import("#components/Layouts/PageNotFound"));

// layouts
export const BaseLayout = React.lazy(() => import("#components/Layouts/BaseLayout"));

// dashboard
export const Dashboard = React.lazy(() => import("#views/Dashboard"));

// vizrisk
export const Vizrisk = React.lazy(() => import("#views/VizRisk"));
