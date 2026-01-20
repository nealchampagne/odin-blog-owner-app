import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import PostsList from "../pages/PostsList";
import CreatePost from "../pages/CreatePost";
import EditPost from "../pages/EditPost";
import PostDetail from "../pages/PostDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "posts", element: <PostsList /> },
      { path: "posts/new", element: <CreatePost /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "posts/:id/edit", element: <EditPost /> }
    ]
  }
]);
