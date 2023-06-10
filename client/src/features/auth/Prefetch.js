import { store } from '../../app/store'
import { servicesApiSlice } from '../services/servicesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { appointmentsApiSlice } from '../appointments/appointmentsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        //const services = store.dispatch(servicesApiSlice.endpoints.getServices.initiate())
        const appointments = store.dispatch(appointmentsApiSlice.endpoints.getServices.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            //services.unsubscribe()
            appointments.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch