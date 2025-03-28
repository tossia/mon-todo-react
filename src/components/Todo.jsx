/**
 * A single todo item
 * 
 * @param {Object} props
 * @param {String} props.name - The name of the todo item
 * @returns {ReactElement} A JSX element representing a single todo item
 */
function Todo(props) {
    return (
        <li className="todo stack-small">
            <div className="c-cb">
                <input id={props.id} type="checkbox" defaultChecked={props.completed} />
                <label className="todo-label" htmlFor="todo-0">
                    {props.name}
                </label>
            </div>
            <div className="btn-group">
                <button type="button" className="btn">
                    Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button type="button" className="btn btn__danger">
                    Delete <span className="visually-hidden">{props.name}</span>
                </button>
            </div>
        </li>
    );
}

export default Todo;
