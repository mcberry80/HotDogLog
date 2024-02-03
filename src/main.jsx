
import Root from './Routes/root';
import User from './Routes/user';
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
    {
      path: "/user/:userId",
      element: <User />,
    }
  ]);

  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
