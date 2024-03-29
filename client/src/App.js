import {Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import EmployeeLogin from './features/auth/EmployeeLogin'
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
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import UserLogin from './features/auth/UserLogin'
import HomeLayout from './components/HomeLayout'
import PrefetchServices from './features/auth/PrefetchServices'
import WelcomeUser from './features/auth/WelcomeUser'
import UpdateAvailability from './features/users/UpdateAvailability'
import BookService from './features/appointments/BookService'
import Checkout from './features/appointments/Checkout'
import CompleteAppointment from './features/appointments/CompleteAppointment'
import RegisterUserForm from './features/users/RegisterUserForm'
import ViewAvailability from './features/users/ViewAvailability'
import About from './components/About'

const NotFound = () => (
  <div>
    <h2>404</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<PrefetchServices />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path='about' element={<About />} />
          <Route path='employeeLogin' element={<EmployeeLogin />} />
          <Route path='userLogin' element={<UserLogin />} />
          <Route path='userRegister' element={<RegisterUserForm />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.employee]}/>}>
              <Route element={<Prefetch />}>
                <Route path='company' element={<CompanyLayout />}>
                  <Route index element={<Welcome />} />

                  <Route path='users'>
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                    <Route path=":id/updateAvailability" element={<UpdateAvailability />} />
                    <Route path=":id/viewAvailability" element={<ViewAvailability />} />
                  </Route>

                  <Route path='services'>
                    <Route index element={<ServicesList isEdit={true} isBook={false}/>} />
                    <Route path=":id" element={<EditService />} />
                    <Route path="new" element={<NewService />} />
                  </Route>
                  
                  <Route path='appointments'>
                    <Route index element={<AppointmentsList isEdit={true}/>} />
                    <Route path=":id" element={<EditAppointment />} />
                    <Route path="complete/:id" element={<CompleteAppointment />} />
                    <Route path="new" element={<NewAppointment />} />
                  </Route>

                </Route>
              </Route>
            </Route>
            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
              <Route element={<Prefetch />}>
                <Route path='home' element={<HomeLayout />}>
                  <Route index element={<WelcomeUser />} />

                  <Route path='services'>
                    <Route index element={<ServicesList isEdit={false} isBook={true}/>} />
                    <Route path=":id" element={<BookService />} />
                    <Route path="checkout" element={<Checkout />} />
                  </Route>

                  <Route path='appointments'>
                    <Route index element={<AppointmentsList isEdit={false}/>} />
                  </Route>

                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
