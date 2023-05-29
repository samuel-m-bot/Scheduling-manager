import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import {apiSlice} from '../../app/api/apiSlice'

const servicesAdapter = createEntityAdapter({})

const initialState = servicesAdapter.getInitialState()
const servicesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getServices: builder.query({
            query: () => './service',
            validateStatus: (response, result) =>{
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadServices = responseData.map(services => {
                    services.id= services._id
                    return services
                });
                return servicesAdapter.setAll(initialState, loadServices)
            },
            providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: 'services', id: 'LIST'},
                        ...result.ids.map(id =>({type: 'services', id}))
                    ]
                } else return [{type: 'services', id: 'LIST'}]
            }
        }),
    }),
})

export const{
    useGetServicesQuery,
} = servicesApiSlice

export const selectServicesResult = servicesApiSlice.endpoints.getServices.select()

const selectServicesData = createSelector(
    selectServicesResult,
    servicesResult => servicesResult.data
)

export const{
    selectAll: selectAllServices,
    selectById: selectServicesById,
    selectIds: selectServicesIds
} = servicesAdapter.getSelectors(state => selectServicesData(state) ??
initialState)