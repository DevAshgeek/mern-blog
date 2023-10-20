/* eslint-disable jsx-a11y/anchor-is-valid */
import "./App.css";

import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/Pages/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage";
import { UserContextProvider } from "./components/UserContext";
import CreatePost from "./components/Pages/CreatePost";
import PostPage from "./components/Pages/PostPage";
import EditPost from "./components/Pages/EditPost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/create" element={<CreatePost />} />

          <Route path="/post/:id" element={<PostPage />} />

          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
