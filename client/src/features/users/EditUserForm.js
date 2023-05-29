import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [firstName, setFirstName] = useState(user.firstName)
    const [validFirstName, setValidFirstName] = useState(false)
    const [surname, setSurname] = useState(user.surname)
    const [validSurname, setValidSurname] = useState(false)
    const [email, setEmail] = useState(user.email)
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [role, setRole] = useState("employee")

    useEffect(() => {
        setValidFirstName(USER_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setValidSurname(USER_REGEX.test(surname))
    }, [surname])

    // useEffect(() => {
    //     setValidEmail(USER_REGEX.test(email))
    // }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setFirstName('')
            setSurname('')
            setEmail('')
            setPassword('')
            setRole('')
            navigate('/company/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onSurnameChanged = e => setSurname(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRoleChanged = e => setRole(e.target.value)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, firstName, surname, email, password, role})
        } else {
            await updateUser({ id: user.id, firstName, surname, email, role})
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let canSave
    if (password) {
        canSave = [validFirstName, validSurname, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [validFirstName, validSurname].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="firstName">
                    First Name: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input`}
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="off"
                    value={firstName}
                    onChange={onFirstNameChanged}
                />

                <label className="form__label" htmlFor="surname">
                    Surname: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input`}
                    id="surname"
                    name="surname"
                    type="text"
                    autoComplete="off"
                    value={surname}
                    onChange={onSurnameChanged}
                />

                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input `}
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select `}
                    value={role}
                    onChange={onRoleChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}
export default EditUserForm