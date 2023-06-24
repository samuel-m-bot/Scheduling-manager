import { selectAppointmentById } from './appointmentsApiSlice'

const selectorTest = () => {
  
    const mockState = {
        // Add any other top-level keys in your Redux state
        // Replace with your actual state key if different
        appointments: { 
          entities: {
            'appointment1': { id: 'appointment1', user: 'user1', employee: 'employee1', service: 'service1', startTime: '10:00', endTime: '11:00' },
            'appointment2': { id: 'appointment2', user: 'user2', employee: 'employee2', service: 'service2', startTime: '11:00', endTime: '12:00' },
          },
          ids: ['appointment1', 'appointment2']
        }
      }
      
      console.log(selectAppointmentById(mockState, 'appointment1')) // Logs: { id: 'appointment1', user: 'user1', employee: 'employee1', service: 'service1', startTime: '10:00', endTime: '11:00' }
      
      console.log(selectAppointmentById(mockState, 'appointment2')) // Logs: { id: 'appointment2', user: 'user2', employee: 'employee2', service: 'service2', startTime: '11:00', endTime: '12:00' }
      
      console.log(selectAppointmentById(mockState, 'appointment3')) // Logs: undefined
      
}

export default selectorTest

// Simulate your Redux state structure