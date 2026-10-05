

function Checkbox({ id, name, value, checked, onChange, label }) {
    return (
        <div className='filter-input'>
            <input
                type='checkbox'
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
}

export default Checkbox