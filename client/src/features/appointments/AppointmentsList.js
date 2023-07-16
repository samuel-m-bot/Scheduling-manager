import { useGetAppointmentsQuery } from "./appointmentsApiSlice"
import Appointment from './Appointments'
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const AppointmentsList = ({isEdit}) => {

    const { id, role } = useAuth()

    const [statusFilter, setStatusFilter] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [showOutcome, setShowOutcome] = useState(false);
    const [currentOutcome, setCurrentOutcome] = useState("");
    const [sortAscending, setSortAscending] = useState(true);


    const {
        data: appointments,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAppointmentsQuery('appointmentsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const handleFilterChange = (e) => {
        switch (e.target.name) {
          case 'status':
            setStatusFilter(e.target.value);
            break;
          case 'service':
            setServiceFilter(e.target.value);
            break;
          case 'time':
            setTimeFilter(e.target.value);
            break;
          default:
            break;
        }
    }
    const handleShowOutcome = (outcome) => {
        setCurrentOutcome(outcome);
        setShowOutcome(true);
    }
      
      
    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <h1 className="errmsg">ERROR:{error?.data?.message}</h1>
    }

    if (isSuccess) {
        let filteredAppointments;
    
        console.log(appointments)
        if (role === 'user') {
            filteredAppointments = appointments.filter(app => app.user._id === id);
        } else if (role === 'employee') {
            filteredAppointments = appointments.filter(app => app.employee._id === id);
        }else{
            filteredAppointments = appointments
        }
        let uniqueServices = [...new Set(appointments.map(appointment => appointment.service.name))];
        if (statusFilter) {
            filteredAppointments = filteredAppointments.filter(appointment => appointment.status === statusFilter);
        }
        if (serviceFilter) {
            filteredAppointments = filteredAppointments.filter(appointment => appointment.service.name === serviceFilter);
        }
        
        let sortedAppointments = [...filteredAppointments];
        if (timeFilter === "Soonest") {
            sortedAppointments.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        } else if (timeFilter === "Furthest") {
            sortedAppointments.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        }

        if (sortAscending) {
            sortedAppointments.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        } else {
            sortedAppointments.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        }
          
        
        console.log(sortedAppointments)
        const tableContent = sortedAppointments.length
        ? sortedAppointments.map(appointment => <Appointment key={appointment.id} appointmentId={appointment.id} isEdit={isEdit} showOutcome={handleShowOutcome}/>)
        : null


        content = (
            <div>
                <table className="appointments-table">
                    <thead>
                        <tr className="appointments-table__header">
                            <th scope="col">Status 
                            <select value={statusFilter} onChange={handleFilterChange} name="status" className="filler_select">
                        <option value="">--All--</option>
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select></th>
                            <th scope="col">
                                Date and Time
                                <button onClick={() => setSortAscending(!sortAscending)}>
                                    {sortAscending ? "▲" : "▼"}
                                </button>
                            </th>
                            <th scope="col">User</th>
                            <th scope="col">Employee</th>
                            <th scope="col">Service
                            <select value={serviceFilter} onChange={handleFilterChange} name="service" className="filler_select">
                                <option value="">--All--</option>
                                {uniqueServices.map((service, index) => <option value={service} key={index}>{service}</option>)}
                            </select></th>
                            {isEdit && (
                                <th scope="col">Edit</th>
                            )}
                            {isEdit && (
                                <th scope="col">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
                {showOutcome && 
                    <div className="modal">
                        <div className="modal-content">
                        <h4>Appointment Outcome</h4>
                        <p>{currentOutcome}</p>
                        <button onClick={() => setShowOutcome(false)}>Close</button>
                        </div>
                    </div>
                }
            </div>
        )
    }

    return <div>{content}</div>
}

export default AppointmentsList
