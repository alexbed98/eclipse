import { FaLock, FaLockOpen } from 'react-icons/fa';

// isGrid = true -> formulaire sur 2 colonne
// isGrid = false -> formualire sur 1 colonne
// disable = false -> champs input desactiver
function Form({ fields, values, onChange, onSubmit, buttonText,
    isGrid = false, errorMessage, required = true, disabled = false,
    isEditing = false, onCancel }) {
    return (
        <form onSubmit={onSubmit} className={isGrid ? "register-form" : "auth-form"}>
            {fields.map((field) => (
                <div key={field.id} className="form-section">
                    <label htmlFor={field.id} className='form-label'>
                        <span>{field.label}</span>
                        <span className='lock-icon'>
                            {disabled ? <FaLock /> : <FaLockOpen className='unlocked' />}
                        </span>
                    </label>
                    <input
                        id={field.id}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        value={values[field.name] || ""}
                        onChange={onChange}
                        required={field.required ?? true}
                        disabled={disabled}
                    />
                </div>
            ))}

            {errorMessage && <div className="auth-error">{errorMessage}</div>}

            <div className='form-actions'>
                <button type="submit"
                    className={`form-button ${isEditing && 'button-edit'}`}>
                    {buttonText}
                </button>

                {isEditing && (
                    <button 
                        type='button' 
                        onClick={onCancel}
                        className='form-button button-cancel'
                    >
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
}

export default Form