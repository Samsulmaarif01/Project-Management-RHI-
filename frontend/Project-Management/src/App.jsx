import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/UserDashboard'
import MyTask from './pages/User/MyTask'
import ViewTaskDetail from './pages/User/ViewTaskDetail'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'

const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/task" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* routes user*/}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTask />} />
          <Route path="/user/task-details/:id" element={<ViewTaskDetail/>} />
        </Route>
      </Routes>
    </Router>
  </div>
  )
}

export default App