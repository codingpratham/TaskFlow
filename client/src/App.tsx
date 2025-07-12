import {  Routes, Route, BrowserRouter } from "react-router-dom";

import LoginPage from "./pages/LoginPage"; 
import PrivateRoute from "./utils/privateRoute";
import UserDashboard from "./pages/UserDashboard";
import TeamAdminDashboard from "./pages/TeamAdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import PendingTask from "./pages/user/PendingTask";
import CompletedTasks from "./pages/user/CompletedTasks";
import CreateTeamPage from "./pages/team/CreateTeamPage";
import CreateProjectPage from "./pages/team/CreateProjectPage";
import CreateTask from "./pages/team/CreateTask";
import InviteUser from "./pages/team/InviteUser";
import Notification from "./pages/team/Notification";
import AllTask from "./pages/user/AllTask";


function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="*" element={
          <PrivateRoute allowedRoles={["USER", "TEAM_ADMIN"]}>
            <Layout>
            <div>
              Page Not Found
            </div>
            </Layout>
          </PrivateRoute>
        }/>
        <Route path="/register" element={
          <>
          <Layout>
            <RegisterPage/>
          </Layout>
          </>
          }
          />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/user-dashboard" element={
          <PrivateRoute allowedRoles={["USER"]}>
            <Layout>
            <UserDashboard/>
            </Layout>
          </PrivateRoute>}/>

          <Route path="/user-tasks" element={
            <PrivateRoute allowedRoles={["USER"]}>
              <Layout>
              <AllTask/>
              </Layout>
            </PrivateRoute>
          }/>

          <Route path="/user-tasks/pending" element={
            <PrivateRoute allowedRoles={["USER"]}>
              <Layout>
              <PendingTask/>
              </Layout>
            </PrivateRoute>
          }/>

          <Route path="/user-tasks/completed" element={
            <PrivateRoute allowedRoles={["USER"]}>
              <Layout>
              <CompletedTasks/>
              </Layout>
            </PrivateRoute>
          }/>

        <Route path="/team-dashboard" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <TeamAdminDashboard/>
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/create-team" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <CreateTeamPage/>
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/create-project" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <CreateProjectPage/>
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/create-task" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <CreateTask/>
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/invite-user" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <InviteUser/>
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/notification" element={
          <PrivateRoute allowedRoles={["TEAM_ADMIN"]}>
            <Layout>
            <Notification/>
            </Layout>
          </PrivateRoute>
        } />
       
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
