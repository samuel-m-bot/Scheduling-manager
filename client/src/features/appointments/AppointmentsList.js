import { useGetAppointmentsQuery } from "./appointmentsApiSlice"
import Appointment from './Appointments'

const AppointmentsList = (isEdit) => {

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

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <h1 className="errmsg">ERROR:{error?.data?.message}</h1>
    }

    if (isSuccess) {
        const ids = appointments.map(appointment => appointment.id);
        console.log(ids);
        const tableContent = ids.length
        ? ids.map(appointmentId => <Appointment key={appointmentId} appointmentId={appointmentId} isEdit={isEdit} />)
        : null


        content = (
            <table className="appointments-table">
                <thead className="appointments-table__head">
                    <tr>
                        <th className="appointments-table__heading appointments-table__heading--time">Time</th>
                        <th className="appointments-table__heading appointments-table__heading--user">User</th>
                        <th className="appointments-table__heading appointments-table__heading--employee">Employee</th>
                        <th className="appointments-table__heading appointments-table__heading--service">Service</th>
                        {!isEdit && <th className="appointments-table__heading appointments-table__heading--edit">Edit</th>}
                    </tr>
                </thead>
                <tbody className="appointments-table__body">
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default AppointmentsList