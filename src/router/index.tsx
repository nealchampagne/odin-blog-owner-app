import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import AdminGuard from "../components/AdminGuard";

import PostsList from "../pages/PostsList";
import CreatePost from "../pages/CreatePost";
import PostDetail from "../pages/PostDetail";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        element: <AdminGuard />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "posts", element: <PostsList /> },
          { path: "posts/new", element: <CreatePost /> },
          { path: "posts/:id", element: <PostDetail /> }
        ]
      }
    ]
  }
]);
