import { useState, useEffect } from "react"
import { useAddNewServiceMutation } from "./servicesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const PRICE_REGEX = /^[0-9]*\.?[0-9]{0,2}$/
const DURATION_REGEX = /^[1-9][0-9]{0,2}$/

const NewServiceForm = () => {
    const [addNewService, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewServiceMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [validPrice, setValidPrice] = useState(false)
    const [duration, setDuration] = useState(0)
    const [validDuration, setValidDuration] = useState(false)

    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price))
    }, [price])

    useEffect(() => {
        setValidDuration(DURATION_REGEX.test(duration))
    }, [duration])


    useEffect(() => {
        if (isSuccess) {
            setName('')
            setDescription('')
            setPrice('')
            setDuration('')
            navigate('/company/services')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onPriceChanged = e => setPrice(e.target.value)
    const onDurationChanged = e => setDuration(e.target.value)

    const canSave = [validPrice, validDuration].every(Boolean) && !isLoading

    const onSaveServiceClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewService({ name, description, price, duration })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    // const validUserClass = !validEmail ? 'form__input--incomplete' : ''
    const validPriceClass = !validPrice ? 'form__input--incomplete' : ''
    const validDurationClass = !validDuration ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveServiceClicked}>
                <div className="form__title-row">
                    <h2>New Service</h2>
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
                <label className="form__label" htmlFor="name">
                    Name: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input`}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onNameChanged}
                />

                <label className="form__label" htmlFor="description">
                    Description: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input`}
                    id="description"
                    name="description"
                    type="text"
                    autoComplete="off"
                    value={description}
                    onChange={onDescriptionChanged}
                />

                <label className="form__label" htmlFor="price">
                    Price: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validPriceClass}`}
                    id="price"
                    name="price"
                    type="number"
                    autoComplete="off"
                    value={price}
                    onChange={onPriceChanged}
                />

                <label className="form__label" htmlFor="duration">
                    Duration: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validDurationClass}`}
                    id="duration"
                    name="duration"
                    type="number"
                    autoComplete="off"
                    value={duration}
                    onChange={onDurationChanged}
                />
            </form>
        </>
    )

    return content
}

export default NewServiceForm