
// isGrid = true -> formulaire sur 2 colonne
// isGrid = false -> formualire sur 1 colonne
// disable = false -> champs input desactiver
function Form({ fields, values, onChange, onSubmit, buttonText, 
    isGrid = false, errorMessage, required = true, disabled = false }) {
    return (
        <form onSubmit={onSubmit} className={isGrid ? "register-form" : "auth-form"}>
            {fields.map((field) => (
                <div key={field.id} className="form-section">
                    <label htmlFor={field.id}>{field.label}</label>
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

            <button type="submit" className="form-button">
                {buttonText}
            </button>
        </form>
    );
}

export default Form