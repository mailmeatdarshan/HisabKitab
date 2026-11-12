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
import ErrorBoundary from "./components/ErrorBoundary";
import { SettingsProvider } from "./context/SettingsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
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
        path: "/app/settings",
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
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorBoundary />,
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
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  </React.StrictMode>
);

// Global PWA install prompt handler
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredInstallPrompt = e;
  window.dispatchEvent(new Event("pwa-prompt-ready"));
});

// Register PWA Service Worker for app installability
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.log("PWA Service Worker registered with scope:", reg.scope);
      })
      .catch((err) => {
        console.log("PWA Service Worker registration failed:", err);
      });
  });
}