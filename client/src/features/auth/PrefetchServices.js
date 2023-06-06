import { store } from '../../app/store'
import { servicesApiSlice } from '../services/servicesApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const PrefetchServices = () => {
    useEffect(() => {
        console.log('subscribing')
        const services = store.dispatch(servicesApiSlice.endpoints.getServices.initiate())

        return () => {
            console.log('unsubscribing')
            services.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default PrefetchServices