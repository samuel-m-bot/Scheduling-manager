import { useState, useEffect, useRef } from "react"
import { useUpdateServiceMutation, useDeleteServiceMutation } from "./servicesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import './Services.css'

const PRICE_REGEX = /^[0-9]*\.?[0-9]{0,2}$/
const DURATION_REGEX = /^[1-9][0-9]{0,2}$/

const EditServiceForm = ({ service }) => {

    const [updateService, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateServiceMutation()

    const [deleteService, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteServiceMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(service.name)
    const [description, setDescription] = useState(service.description)
    const [price, setPrice] = useState(service.price)
    const [validPrice, setValidPrice] = useState(false)
    const [duration, setDuration] = useState(service.duration)
    const [validDuration, setValidDuration] = useState(false)

    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price))
    }, [price])

    useEffect(() => {
        setValidDuration(DURATION_REGEX.test(duration))
    }, [duration])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setName('')
            setDescription('')
            setPrice('')
            setDuration('')
            navigate('/company/services')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const textareaRef = useRef(null);

    useEffect(() => {
        // when the component first mounts, adjust the height of the textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, []);

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => {
        setDescription(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }
    const onPriceChanged = e => setPrice(e.target.value)
    const onDurationChanged = e => setDuration(e.target.value)

    const onSaveServiceClicked = async (e) => {
        await updateService({ id: service.id, name, description, price, duration})
    }

    const onDeleteServiceClicked = async () => {
        await deleteService({ id: service.id })
    }

    let canSave = [validPrice, validDuration].every(Boolean) && !isLoading

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPriceClass = !validPrice ? 'form__input--incomplete' : ''
    const validDurationClass = !validDuration ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Service</h2>
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
                    <textarea
                        ref={textareaRef}
                        className={`form__input`}
                        id="description"
                        name="description"
                        autoComplete="off"
                        value={description}
                        onChange={onDescriptionChanged}
                        style={{height: 'auto', overflowY: 'hidden'}}
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
                    Duration: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validDurationClass}`}
                    id="duration"
                    name="duration"
                    type="number"
                    value={duration}
                    onChange={onDurationChanged}
                />
                <div>
                    <button
                        className="icon-button"
                        title="Save"
                        onClick={onSaveServiceClicked}
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                        className="icon-button"
                        title="Delete"
                        onClick={onDeleteServiceClicked}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </form>
        </>
    )

    return content
}
export default EditServiceForm