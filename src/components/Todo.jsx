import { useEffect, useRef, useState, } from "react";
import PriorityList from "./PriorityList";
import { priorityValues } from '../constants';

// const priorityValues = PriorityList.priorityValues;

const priorityColor = (priority) => {
    const priorityObject = priorityValues.find((p) => p.value === priority);
    return priorityObject ? priorityObject.color : 'black';
};

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


function Todo(props) {
    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPriority, setPriority] = useState("");

    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);

    const wasEditing = usePrevious(isEditing);

    useEffect(() => {
        if (wasEditing && !isEditing && editFieldRef.current) {
            editFieldRef.current.focus();
        }
    }, [wasEditing, isEditing, editFieldRef]);

    useEffect(() => {
        if (isEditing) {
            setNewName(props.name);
            setPriority(props.priority);
        }
    }, [isEditing, props.name, props.priority]);

    /**
     * Handles the change of the name input of the task form.
     *
     * @param {object} e - The event object from the input change event.
     * @returns {undefined}
     */
    function handleChange(e) {
        setNewName(e.target.value);
    }
    /**
     * Handles the change of the priority select of the task form.
     *
     * @param {object} et - The event object from the select change event.
     * @returns {undefined}
     */
    const handlePriorityChange = (event) => {
        const selectedValue = event.target.value;
        console.log('Selected value:', selectedValue);
        const priorityObject = priorityValues.find((priority) => priority.value === selectedValue);
        if (priorityObject) {
            setPriority(priorityObject.value);
        } else {
            console.error("Invalid priority value");
        }
    };


    /**
     * Handles the submission of the edit task form.
     *
     * If the new name is blank, resets the new name to the original name.
     * Otherwise, calls `editTask` with the new name and priority and resets the
     * new name and priority to blank and the original value respectively.
     *
     * @param {object} e - The event object from the form submission.
     * @returns {undefined}
     */
    function handleSubmit(e) {
        e.preventDefault();
        if (newName.trim() === "") {
            setNewName(props.name);
        } else {
            props.editTask(props.id, newName, newPriority);
            setNewName("");
            setPriority(props.priority);
            setEditing(false);
        }
    }

    const editingTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="todo-label" htmlFor={props.id}>
                    New name for {props.name}
                </label>
                <input
                    id={props.id}
                    className="todo-text"
                    type="text"
                    value={newName}
                    onChange={handleChange}
                    ref={editFieldRef}
                />
            </div>
            <div className="filters select px-3 py-3">
                <div className="filters select px-3 py-3">
                    <PriorityList value={newPriority} onChange={handlePriorityChange} />
                </div>
            </div>
            <div className="btn_group">
                <button
                    type="button"
                    className="todo-cancel"
                    onClick={() => setEditing(false)}>
                    Cancel
                    <span className="visually-hidden">renaming {props.name}</span>
                </button>
                <button type="submit" className="btn__primary todo-edit">
                    Save
                    <span className="visually-hidden">new name for {props.name}</span>
                </button>
            </div>
        </form>
    );

    const viewTemplate = (
        <div className="stack-small">
            <div className="c-cb">
                <input
                    id={props.id}
                    type="checkbox"
                    defaultChecked={props.completed}
                    onChange={() => props.toggleTaskCompleted(props.id)}
                />
                <label className="todo-label" htmlFor={props.id}>
                    {props.name}
                </label>
                <div className="todo-label">Priority : <b style={{ color: priorityColor(props.priority) }}>{props.priority || 'Non définie'}   </b></div>
            </div>
            <div className="btn_group">
                <button
                    type="button"
                    className="btn btn-info btn-lg"
                    onClick={() => {
                        setEditing(true)
                    }}
                    ref={editButtonRef}>

                    Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={() => props.deleteTask(props.id)}>
                    Delete <span className="visually-hidden btn__danger">{props.name}</span>
                </button>
            </div>
        </div>
    );

    return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
