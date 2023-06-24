import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'

const User = ({ userId }) => {
    const tes = useSelector(state => console.log(state))
    const user = useSelector(state => selectUserById(state, userId))

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/company/users/${userId}`)

        //const userRolesString = user.role.toString().replaceAll(',', ', ')

        const cellStatus = user.isAvailable ? '' : 'table__cell--inactive'

        return (
            <tr className="table__row user">
                <td className='table__cell'>{user.firstName}</td>
                <td className='table__cell'>{user.surname}</td>
                <td className='table__cell'>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
export default User