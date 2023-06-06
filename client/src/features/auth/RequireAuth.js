import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { role } = useAuth()

    const content = (
        allowedRoles.includes(role)  // check if the user's role is in the list of allowed roles
            ? <Outlet />
            : <Navigate to="/employeeLogin" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth