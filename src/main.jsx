
import Root from './routes/Root';
import User from './routes/User';
import AuthContext from './AuthContext';
import * as React from 'react';
import { useState } from 'react';

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

  const Main = () => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </AuthContext.Provider>
    );
}

createRoot(document.getElementById("root")).render(<Main />);