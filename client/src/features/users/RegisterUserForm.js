import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const RegisterUserForm = () => {
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
    const [role, setRole] = useState("employee")
    const [registrationCompleted, setRegistrationCompleted] = useState(false)

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

    const handelRegisteredComplete = () => (
        navigate('/')
    )
    useEffect(() => {
        if (isSuccess) {
            setRegistrationCompleted(true)
        }
    }, [isSuccess])

    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onSurnameChanged = e => setSurname(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const canSave = [validFirstName, validSurname, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try {
                await addNewUser({ firstName, surname, email, password })
                setRegistrationCompleted(true) 
            } catch (err) {
                console.error("Failed to register user: ", err)
            }
        }
    }
    

    const errClass = isError ? "errmsg" : "offscreen"
    // const validUserClass = !validEmail ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''

    const content = registrationCompleted
        ? (
            <div>
                <h1>Register successful. Account was created. Go back to home screen and login to account</h1>
                <button onClick={handelRegisteredComplete}>Go back to home screen</button>
            </div>
        )
        : (
            <>
                <p className={errClass}>{error?.data?.message}</p>

                <form className="form" onSubmit={onSaveUserClicked}>
                    <div className="form__title-row">
                        <h2>Register</h2>
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

                    <button
                        className="icon-button"
                        title="Register"
                        disabled={!canSave}
                    >
                        Register
                    </button>
                </form>
            </>
        )
    return content
}

export default RegisterUserForm