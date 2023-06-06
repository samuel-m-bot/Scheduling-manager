import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { email, role, firstName, surname } = decoded.UserInfo

        const isEmployee = role === 'employee'
        const isAdmin = role === 'admin'

        if (isEmployee) status = "Employee"
        if (isAdmin) status = "Admin"

        return { email, role, firstName, surname, status, isEmployee, isAdmin }
    }

    return { email: '', role: '', firstName: '',surname: '',isEmployee: false, isAdmin: false, status }
}
export default useAuth
