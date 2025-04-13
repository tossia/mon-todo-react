function FilterPrioButton(props) {
    return (
        <button
            type="button"
            className="todo-cancel"
            style={{ borderColor: props.color }}
            aria-pressed={props.isPressed}
            onClick={() => props.setFilter(props.priority)}>

            <span style={{ color: props.color }}>{props.priority}</span>

        </button>
    );
}

export default FilterPrioButton;