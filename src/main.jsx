import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import axios from 'axios';

axios.get('http://localhost:5000/tasks')
  .then(response => {
    const tasks = response.data.tasks;
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App tasks={tasks} />
      </StrictMode>,
    )
  })
  .catch(error => {
    console.error(error);
  });