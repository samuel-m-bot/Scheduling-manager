import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false)
    const [surname, setSurname] = useState('')
    const [validSurname, setValidSurname] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [role, setRole] = useState(["employee"])

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
        if (isSuccess) {
            setFirstName('')
            setSurname('')
            setEmail('')
            setPassword('')
            setRole('')
            navigate('/company/users')
        }
    }, [isSuccess, navigate])

    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onSurnameChanged = e => setSurname(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRoleChanged = e => setRole(e.target.value)

    const canSave = [validFirstName, validSurname, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ firstName, surname, email, password, role })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    // const validUserClass = !validEmail ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="firstName">
                    FirstName: <span className="nowrap">[3-20 letters]</span></label>
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
                    className={`form__input`}
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
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
                    className={`form__select`}
                    size="3"
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

export default NewUserForm