const Filter = ({ filterValue, onFilterChange }) => {
    return (
        <p>filter shown with 
            <input value = {filterValue} onChange={onFilterChange}></input>
        </p>
    )
}

export default Filter