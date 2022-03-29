import React from "react";
import { useRoutes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);

  return element;
}

export default App;
