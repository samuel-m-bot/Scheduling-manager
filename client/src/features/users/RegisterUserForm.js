import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import "./Users.css"
import { Link } from "react-router-dom"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const handelRegisteredComplete = () => (
        navigate('/')
    )
    useEffect(() => {
        if (isSuccess) {
            setRegistrationCompleted(true)
        }
    }, [isSuccess])

    const [firstNameError, setFirstNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstNameTouched, setFirstNameTouched] = useState(false);
    const [surnameTouched, setSurnameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    useEffect(() => {
        if (firstNameTouched) {
            setFirstNameError(firstName && !USER_REGEX.test(firstName) ? 'First name is invalid' : '');
        }
    }, [firstName, firstNameTouched]);
    
    useEffect(() => {
        if (surnameTouched) {
            setSurnameError(surname && !USER_REGEX.test(surname) ? 'Surname is invalid' : '');
        }
    }, [surname, surnameTouched]);
    
    useEffect(() => {
        if (emailTouched) {
            setEmailError(email && !EMAIL_REGEX.test(email) ? 'Email is invalid' : '');
        }
    }, [email, emailTouched]);
    
    useEffect(() => {
        if (passwordTouched) {
            setPasswordError(password && !PWD_REGEX.test(password) ? 'Password is invalid' : '');
        }
    }, [password, passwordTouched]);

    const onFirstNameChanged = e => {
        setFirstName(e.target.value)
        if (!firstNameTouched) {
            setFirstNameTouched(true)
        }
    }

    const onSurnameChanged = e => {
        setSurname(e.target.value)
        if (!surnameTouched) {
            setSurnameTouched(true)
        }
    }

    const onEmailChanged = e => {
        setEmail(e.target.value)
        if (!emailTouched) {
            setEmailTouched(true)
        }
    }

    const onPasswordChanged = e => {
        setPassword(e.target.value)
        if (!passwordTouched) {
            setPasswordTouched(true)
        }
    }

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
            <div className="register-success">
                <h1>Register successful. Account was created. Go back to home screen and login to account</h1>
                <button onClick={handelRegisteredComplete}>Go back to home screen</button>
            </div>
        )
        : (
            <>
                <header className='public__header'>
                    <nav class="nav-bar">
                        <div class="nav-section left">
                            <Link to="/"><h1>Quick Fix</h1></Link>
                        </div>
                        <div class="nav-section center">
                            <Link to="/">Home</Link>
                        </div>
                        <div class="nav-section right">
                            <select id="language-selector">
                                <option value="english" selected>English</option>
                                <option value="spanish">Español</option>
                                <option value="french">Français</option>
                            </select>
                        </div>
                    </nav>
            </header>
            {(error?.data && 
                <p className="error-message">{error?.data?.message}</p>
            )}
                <div className="registration-form__container">
                    <form className="registration-form" onSubmit={onSaveUserClicked}>
                        <div className="registration-form__title-row">
                            <h2>Register</h2>
                        </div>
                        <label className="registration-form__label" htmlFor="firstName">
                            FirstName: <span className="nowrap">[3-20 letters]</span></label>
                        <input
                            className={`registration-form__input ${firstNameError ? 'error' : ''}`}
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="off"
                            value={firstName}
                            onChange={onFirstNameChanged}
                        />
                        {firstNameError && firstNameTouched && <div className="input-error">{firstNameError}</div>}

                        <label className="registration-form__label" htmlFor="surname">
                            Surname: <span className="nowrap">[3-20 letters]</span></label>
                        <input
                            className={`registration-form__input ${surnameError ? 'error' : ''}`}
                            id="surname"
                            name="surname"
                            type="text"
                            autoComplete="off"
                            value={surname}
                            onChange={onSurnameChanged}
                        />
                        {surnameError && surnameTouched && <div className="input-error">{surnameError}</div>}

                        <label className="registration-form__label" htmlFor="email">
                            Email: <span className="nowrap">[3-20 letters]</span></label>
                        <input
                            className={`registration-form__input ${emailError ? 'error' : ''}`}
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="off"
                            value={email}
                            onChange={onEmailChanged}
                        />
                        {emailError && emailTouched && <div className="input-error">{emailError}</div>}

                        <label className="registration-form__label" htmlFor="password">
                            Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                        <input
                            className={`registration-form__input ${passwordError ? 'error' : ''}`}
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={onPasswordChanged}
                        />
                        {passwordError && passwordTouched &&<div className="input-error">{passwordError}</div>}

                        <button
                            className="registration-form__button"
                            title="Register"
                            disabled={!canSave}
                        >
                            Register
                        </button>
                        <Link to="/" className='userLoginBackLink'>Back to Home</Link>
                    </form>
                </div>
            </>
        )
    return content
}

export default RegisterUserForm