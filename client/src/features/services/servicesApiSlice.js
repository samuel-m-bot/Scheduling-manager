import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from '../../app/api/apiSlice'

const servicesAdapter = createEntityAdapter({})

const initialState = servicesAdapter.getInitialState()

export const servicesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getServices: builder.query({
            query: () => '/service',
            validateStatus: (response, result) =>{
                return response.status === 200 && !result.isError
            },
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
        addNewService: builder.mutation({
            query: initialServiceData => ({
                url: '/service',
                method: 'POST',
                body: {
                    ...initialServiceData,
                }
            }),
            invalidatesTags: [
                { type: 'services', id: "LIST"}
            ]
        }),
        updateService: builder.mutation({
            query: initialServiceData => ({
                url: '/service',
                method: 'PATCH',
                body: {
                    ...initialServiceData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'services', id: arg.id}
            ]
        }),
        deleteService: builder.mutation({
            query: ({ id }) => ({
                url: '/service',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'services', id: arg.id}
            ]
        }),
        getServiceById: builder.query({
            query: (id) => `/service/${id}`,
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError
            },
            transformResponse: (responseData) => {
              responseData.id = responseData._id;
              return responseData;
            },
            providesTags: (result, error, id) => [{ type: 'services', id }],
        }),
    }),
})

export const{
    useGetServicesQuery,
    useAddNewServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    useGetServiceByIdQuery
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