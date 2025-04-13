function FilterPriority(props) {
    return (

        <select
            type="select"
            className="btn__filter"
            aria-pressed={props.isPressed}
            onClick={() => props.setFilter(props.priority)}>
        </select>

    );
}

export default FilterPriority;