import {
    createSelector,
    createEntitAdapter,
    createEntityAdapter
} from '@reduxjs/toolkit'
import {apiSlice} from '../../app/api/apiSlice'

const appointmentsAdapter = createEntityAdapter({})

const initialState = appointmentsAdapter.getInitialState()
const appointmentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getappointmentss: builder.query({
            query: () => './appointmentss',
            validateStatus: (response, result) =>{
                return response.status === 200 && !results.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadappointmentss = responseData.map(appointments => {
                    appointments.id= appointments._id
                    return appointments
                });
                return appointmentsAdapter.setAll(initialState, loadappointmentss)
            },
            providesTags: (result, error, arg) => {
                if(result?ids) {
                    return [
                        {type: 'appointments', id: 'LIST'},
                        ...result.ids.map(id =>({type: 'appointments', id}))
                    ]
                } else return [{type: 'appointments', id: 'LIST'}]
            }
        }),
    }),
})

export const{
    appointmentsGetappointmentsQuery,
} = appointmentsApiSlice

export const selectappointmentsResult = appointmentsApiSlice.endpoints.getappointmentss.select()

const selectappointmentsData = createSelectore(
    selectappointmentsResult,
    appointmentsResult => appointmentsResult.data
)

export const{
    selectAll: selectAllappointmentss,
    selectById: selectappointmentsById,
    selectIds: selectappointmentsIds
} = appointmentsAdapter.getSelectors(state => selectappointmentsData(state) ??
initialState)