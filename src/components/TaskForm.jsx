import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PriorityList from "./PriorityList";
import { priorityValues } from '../constants';

function TaskForm({ addTask }) {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [show, setShow] = useState(false);
    const editFieldRef = useRef(null);

    useEffect(() => {
        if (show && editFieldRef.current) {
            editFieldRef.current.focus();
        }
    }, [show]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /**
     * Handles the change of the name input of the task form.
     *
     * @param {object} event - The event object from the input change event.
     * @returns {undefined}
     */
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addTask(name, priority);
        setName("");
        setPriority("");
        handleClose();
    };

    return (
        <div>
            <button onClick={handleShow} className="btn btn-primary btn-lg">
                Add new task
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="todo-label" htmlFor="task-name">
                                Task Name
                            </label>
                            <input
                                id="task-name"
                                className="todo-text"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                ref={editFieldRef}
                            />
                        </div>
                        <div className="filters select px-3 py-3">
                            <PriorityList value={priority} onChange={handlePriorityChange} />
                        </div>
                        <div className="btn_group">
                            <button
                                type="button"
                                className="todo-cancel"
                                onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary todo-edit">
                                Save
                            </button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TaskForm;
