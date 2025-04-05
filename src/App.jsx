import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useState, useEffect, useRef, } from "react";
import { nanoid } from 'nanoid';
import axios from "axios";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);



/**
 * A todo list application.
 *
 * @param {Object} props
 * @param {Array<{id: string, name: string, completed: boolean}>} props.tasks - An array of todo tasks. Each task is an object with an `id`, a `name`, and a `completed` property.
 * @returns {ReactElement} A JSX element representing the todo list application.
 */

function App(props) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(props.filter);

  useEffect(() => {
    axios
      .get('http://localhost:5000/tasks')
      .then((res) => {
        setTasks(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, []);


  /**
   * Toggles the completion status of a task with the given `id`.
   *
   * @param {string} id - The id of the task to toggle.
   * @returns {undefined}
   */
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  /**
   * Deletes a task with the given `id` from the task list.
   *
   * @param {string} id - The id of the task to delete.
   * @returns {undefined}
   */

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const taskList = Array.isArray(tasks) ? tasks
    ?.filter(FILTER_MAP[filter] || (() => true))
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    )) : [];

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  /**
   * Adds a new task with the given `name` to the task list.
   *
   * @param {string} name - The name of the task to add.
   * @returns {undefined}
   */
  function addTask(name) {
    if (name != "") {
      const newTask = { name, completed: false };

      axios
        .post('http://localhost:5000/tasks', newTask)
        .then((res) => setTasks(...tasks, res.data))
        .catch((err) => {
          console.log(err)
        })
    }
  }

  console.log("tasks => ", tasks);

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  /**
   * Edits the name of a task with the given `id`.
   *
   * @param {string} id - The id of the task to edit.
   * @param {string} newName - The new name for the task.
   * @returns {undefined}
   */

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);


  return (
    <div className="todoapp stack-large">
      <h1>My TODO list</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText}</h2>

      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
