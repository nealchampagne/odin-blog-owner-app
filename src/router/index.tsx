import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../AdminLayout.jsx";
import AdminGuard from "../components/AdminGuard.jsx";

import PostsList from "../pages/PostsList.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import PostDetail from "../pages/PostDetail.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";

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
