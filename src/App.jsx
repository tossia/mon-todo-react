import FilterButton from "./components/filters/FilterButton";
import FilterPrioButton from "./components/filters/FiltrePrioButton";
import Todo from "./components/Todo";
import { useState, useEffect, useRef, useContext } from "react";
// import { nanoid } from 'nanoid';
import axios from "axios";
import TaskForm from "./components/TaskForm";
import "./index.css";
import { priorityValues } from './constants';
import { ThemeProvider, ThemeContext } from './Theme.jsx';
import Header from "./components/shared/Header.jsx";
// import { ErrorBoundary } from 'react-error-boundary';



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

const FILTER_PRIO_MAP = {
  All: () => true,
  High: (task) => task.priority === "High",
  Medium: (task) => task.priority === "Medium",
  Low: (task) => task.priority === "Low",
  "Non défini": (task) => task.priority === "",
};

const FILTER_PRIO_NAMES = Object.keys(FILTER_PRIO_MAP);


/**
 * A todo list application.
 *
 * @param {Object} props
 * @param {Array<{id: string, name: string, completed: boolean}>} props.tasks - An array of todo tasks. Each task is an object with an `id`, a `name`, and a `completed` property.
 * @returns {ReactElement} A JSX element representing the todo list application.
 */

function App(props) {

  const { theme } = useContext(ThemeContext);

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(props.filter || 'All');
  const [filterPrio, setFilterPrio] = useState(props.filterPrio || 'All');


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
  const toggleTaskCompleted = (id) => {
    const task = tasks.find((task) => task.id === id);
    const updatedTasks = { ...task, completed: !task.completed };

    axios
      .put(`http://localhost:5000/tasks/${id}`, updatedTasks)
      .then(() => setTasks(tasks.map((task) => task.id === id ? updatedTasks : task))
      )
      .catch((err) => {
        console.log(err)
      })
  }

  /**
   * Deletes a task with the given `id` from the task list.
   *
   * @param {string} id - The id of the task to delete.
   * @returns {undefined}
   */
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setTasks(tasks.filter((task) => task.id !== id));
        } else {
          console.error(`Error deleting task with ID ${id}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const taskList = Array.isArray(tasks) ? tasks
    ?.filter(FILTER_MAP[filter])
    .filter(FILTER_PRIO_MAP[filterPrio])
    .map((task) => (
      <Todo
        key={task.id}
        task={task}
        id={task.id}
        name={task.name}
        completed={task.completed}
        priority={task.priority}
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

  const filterPrioList = FILTER_PRIO_NAMES.map((name) => (
    <FilterPrioButton
      key={name}
      priority={name}
      color={priorityValues.find((p) => p.value === name)?.color}
      isPressed={filterPrio === name}
      setFilter={setFilterPrio}
    />
  ));

  /**
   * Adds a new task with the given `name` to the task list.
   *
   * @param {string} name - The name of the task to add.
   * @returns {undefined}
   */
  const addTask = (name, priority) => {
    if (name != "") {
      const newTask = { name, completed: false, priority };

      axios
        .post('http://localhost:5000/tasks', newTask)
        .then((res) => setTasks([...tasks, res.data]))
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const prioHeadingText = `${taskList.length} ${tasksNoun} ${filterPrio} priority`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  const prioHeadingRef = useRef(null);
  const prevPrioLength = usePrevious(tasks.length);

  /**
   * Edits the name of a task with the given `id`.
   *
   * @param {string} id - The id of the task to edit.
   * @param {string} newName - The new name for the task.
   * @returns {undefined}
   */

  function editTask(id, newName, newPriority) {
    const task = tasks.find((task) => task.id === id);
    const updatedTasks = { ...task, name: newName, priority: newPriority };

    axios
      .put(`http://localhost:5000/tasks/${id}`, updatedTasks)
      .then(() => setTasks(tasks.map((task) => task.id === id ? updatedTasks : task))
      )
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  useEffect(() => {
    if (tasks.length < prevPrioLength) {
      prioHeadingRef.current.focus();
    }
  }, [tasks.length, prevPrioLength]);


  return (
    <div className={`App ${theme}`}>
      <Header />
      <h1>My TODO list</h1>

      <div className="App">
        <div><TaskForm addTask={addTask} /> </div>
        <div className="filters btn_group stack-exception">
          {filterList}
        </div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText}</h2>

        <div className="filters btn_group stack-exception">
          {filterPrioList}
        </div>
        <h2 id="list-heading" tabIndex="-1" ref={prioHeadingRef}>{prioHeadingText}</h2>
        <ul
          role="list"
          className="todo-list stack-large stack-exception App"
          aria-labelledby="list-heading">
          {taskList}
        </ul>
      </div>
    </div>
  );
}

export default App;
