import { store } from '../../app/store'
import { servicesApiSlice } from '../services/servicesApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setApiReset } from '../../app/store';

const PrefetchServices = () => {
    
    const apiReset = useSelector(state => state.apiReset);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('subscribing')
        const services = store.dispatch(servicesApiSlice.endpoints.getServices.initiate())
        dispatch(setApiReset(false));

        return () => {
            console.log('unsubscribing')
            services.unsubscribe()
        }
    }, [apiReset])

    return <Outlet />
}
export default PrefetchServices