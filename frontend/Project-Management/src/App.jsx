import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetail from "./pages/User/ViewTaskDetail";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import SuspenseLoader from "./components/SuspenseLoader";

const App = () => {
  const ProtectedRoute = ({ element, requiredRole }) => {
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUserRole = async () => {
        const userData = JSON.parse(localStorage.getItem("user-data") || "{}");
        if (userData) {
          setUserRole(userData.role);
        } else {
          setUserRole("");
        }
        setLoading(false);
      };

      fetchUserRole();
    }, []);

    if (loading) {
      return <SuspenseLoader />;
    }

    if (userRole !== requiredRole) {
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Admin Routes */}
            {/* <Route element={<PrivateRoute allowedRoles={"admin"} />}> */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute element={<Dashboard />} requiredRole="admin" />
              }
            />
            <Route path="/admin/task" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            {/* </Route> */}

            {/* routes user*/}
            {/* <Route element={<PrivateRoute allowedRoles={["member"]} />}> */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetail />} />
            {/* </Route> */}

            {/* default route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
