import { JSX, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Explore from "./pages/Explore/Explore";
// import ErrorPage from "./pages/Global/ErrorPage";
// import Layout from "./pages/Global/Layout";
import Home from "./pages/Home";
// import Login from "./pages/Login/Login";
// import Signup from "./pages/Signup/Signup";

interface RoutesChildren {
  routes_children: {
    path: string;
    element: JSX.Element;
    hasHeader?: boolean;
    hasFooter?: boolean;
  }[];
}

const Layout = ({ routes_children }: RoutesChildren) => {
  // const { pathname } = useLocation();
  console.log(routes_children);

  return (
    <div id="layout" className="h-full w-full">
      {/* {routes_children.find((child) => matchPath(child.path, pathname))
        ?.hasHeader && <Header />} */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
      {/* {routes_children.find((child) => matchPath(child.path, pathname))
        ?.hasFooter && <Footer />} */}
    </div>
  );
};

const Router = () => {
  // const routes_children_auth = [
  //   { path: "/login", element: <Login />, hasHeader: true, hasFooter: true },
  //   { path: "/signup", element: <Signup />, hasHeader: true, hasFooter: true },
  // ];

  const routes_children = [
    { path: "/", element: <Home />, hasHeader: true, hasFooter: true },
    {
      path: "/explore",
      element: <Explore />,
      hasHeader: true,
      hasFooter: true,
    },
    // ...routes_children_auth,
    // { path: "/*", element: <ErrorPage /> },
  ];

  const routes = [
    {
      element: <Layout routes_children={routes_children} />,
      // errorElement: <ErrorPage />,
      children: routes_children,

      // loader: async () => {
      //   console.log("Loading data...");
      //   return null;
      // },
    },
  ];

  //TODO: add basename
  const router = createBrowserRouter(routes, { basename: "/" });
  return <RouterProvider router={router} />;
};

export default Router;
