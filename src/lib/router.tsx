import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import {
  BaseLayout,
  Dashboard,
  ErrorBoundary,
  PageNotFound,
  Vizrisk,
  IBF,
} from "#lib/routes";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },

  // onboarding
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/vizrisk",
    element: (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Vizrisk />,
      },
    ],
  },
  {
    path: "/ibf",
    element: (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <IBF />,
      },
    ],
  },
]);
