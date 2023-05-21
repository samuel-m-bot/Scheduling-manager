import {Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import CompanyLayout from './components/CompanyLayout'
import Welcome from './features/auth/Welcome'
import ServicesList from './features/services/ServicesList'
import AppointmentsList from './features/appointments/AppointmentsList'
import UsersList from './features/users/UsersList'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route path='company' element={<CompanyLayout />}>
          <Route index element={<Welcome />} />

          <Route path='services'>
            <Route index element={<ServicesList />} />
          </Route>

          <Route path='appointments'>
            <Route index element={<AppointmentsList />} />
          </Route>

          <Route path='users'>
            <Route index element={<UsersList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
