import {Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import CompanyLayout from './components/CompanyLayout'
import Welcome from './features/auth/Welcome'
import ServicesList from './features/services/ServicesList'
import AppointmentsList from './features/appointments/AppointmentsList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditService from './features/services/EditService'
import NewService from './features/services/NewServiceForm'
import NewAppointment from './features/appointments/NewAppointment'
import EditAppointment from './features/appointments/EditAppointment'
import Prefetch from './features/auth/Prefetch'
import { prefix } from '@fortawesome/free-solid-svg-icons'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route element={<Prefetch />}>
          <Route path='company' element={<CompanyLayout />}>
            <Route index element={<Welcome />} />

            <Route path='users'>
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>

            <Route path='services'>
              <Route index element={<ServicesList />} />
              <Route path=":id" element={<EditService />} />
              <Route path="new" element={<NewService />} />
            </Route>

            <Route path='appointments'>
              <Route index element={<AppointmentsList />} />
              <Route path=":id" element={<EditAppointment />} />
              <Route path="new" element={<NewAppointment />} />
            </Route>

          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
