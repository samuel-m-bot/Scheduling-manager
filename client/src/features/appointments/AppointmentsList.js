import { useGetAppointmentsQuery } from "./appointmentsApiSlice"
import Appointment from './Appointments'

const AppointmentsList = () => {

    const {
        data: appointments,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAppointmentsQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <h1 className="errmsg">ERROR:{error?.data?.message}</h1>
    }

    if (isSuccess) {
        const { ids } = appointments

        const tableContent = ids?.length
            ? ids.map(appointmentId => <Appointment key={appointmentId} appointmentId={appointmentId} />)
            : null

        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Time</th>
                        <th scope="col" className="table__th user__roles">User</th>
                        <th scope="col" className="table__th user__edit">Employee</th>
                        <th scope="col" className="table__th user__edit">Service</th>
                        <th scope="col" className="table__th user__edit">Employee</th>
                        <th scope="col" className="table__th user__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default AppointmentsList