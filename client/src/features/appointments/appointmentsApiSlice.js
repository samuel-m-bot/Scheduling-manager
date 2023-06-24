import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const appointmentsAdapter = createEntityAdapter();

const initialState = appointmentsAdapter.getInitialState();

export const appointmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAppointments: builder.query({
      query: () => '/appointment',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: responseData => {
        return responseData.map(appointment => ({
          ...appointment,
          id: appointment._id
        }));
      },  
      providesTags: ['Appointment', 'LIST'],
    }),
    addNewAppointment: builder.mutation({
      query: ({ user, employee, service, startTime, endTime }) => ({
        url: '/appointment',
        method: 'POST',
        body: { user, employee, service, startTime, endTime },
      }),
      invalidatesTags: ['Appointment', 'LIST'],
    }),
    updateAppointment: builder.mutation({
      query: initialAppointmentData => ({
        url: '/appointment',
        method: 'PATCH',
        body: { ...initialAppointmentData },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Appointment', id: arg.id}
    ],
    }),
    deleteAppointment: builder.mutation({
      query: ({ id }) => ({
        url: '/appointment',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Appointment', id: arg.id}
    ],
    }),
    getAvailableSlots: builder.query({
      query: ({ serviceId, date }) => `/appointment/timeslots/${serviceId}/${date}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: ['Appointment', 'LIST'],
    }),
    getAvailableEmployees: builder.query({
      query: ({ serviceId, slotStart, slotEnd }) => `/appointment/available-employees/${serviceId}/${slotStart}/${slotEnd}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      providesTags: ['Appointment', 'LIST'],
    }),    
  }),
})

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: appointmentsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(appointmentsApiSlice.endpoints.getAppointments.matchFulfilled, (state, action) => {
      appointmentsAdapter.setAll(state, action.payload);
    });
  },
});

export const { reducer: appointmentsReducer } = appointmentsSlice;

export const {
  selectAll: selectAllAppointments,
  selectById: selectAppointmentById,
  selectIds: selectAppointmentIds,
} = appointmentsAdapter.getSelectors(state => state.appointments);

// These are your existing export statements
export const {
  useGetAppointmentsQuery,
  useAddNewAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAvailableSlotsQuery,
  useGetAvailableEmployeesQuery
} = appointmentsApiSlice;

