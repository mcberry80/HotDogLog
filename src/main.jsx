
import Root from './Routes/root';
import * as React from 'react';

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import { createRoot } from 'react-dom/client';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
  ]);

  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
