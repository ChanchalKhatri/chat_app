import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));

import useAuthStore from "./store/authStore";
import Loader from "./components/common/Loader";

const App = () => {
  const { isLogin } = useAuthStore();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/"
          element={isLogin ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!isLogin ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!isLogin ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </Suspense>
  );
};

export default App;
