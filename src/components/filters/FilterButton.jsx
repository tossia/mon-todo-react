function FilterButton(props) {
  return (
    <button
      type="button"
      className="todo-cancel"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}>

      <span>{props.name}</span>

    </button>
  );
}

export default FilterButton;
