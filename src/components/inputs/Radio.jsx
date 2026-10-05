

function Radio({ className, id, name, checked, value, onChange, label }) {
    return (
        <div className={className}>
          <input type='radio' id={id} name={name} value={value}
            checked={checked} onChange={onChange} />
          <label htmlFor={id}>{label}</label>
        </div>
    );
}

export default Radio