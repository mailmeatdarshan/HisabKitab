import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import RecordForm from "./components/RecordForm";
import RecordList from "./components/RecordList";
import "./index.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import SpendingCharts from "./components/SpendingCharts";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./components/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app/recordlist",
        element: <RecordList />,
      },
      {
        path: "/app/subscriptions",
        element: <RecordList />,
      },
      {
        path: "/app/debts",
        element: <RecordList />,
      },
      {
        path: "/app/gullak",
        element: <RecordList />,
      },
      {
        index: true, 
        element: <SpendingCharts />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

const Root = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <RouterProvider router={router} />;
};


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);