import React from 'react';
import { priorityValues } from '../constants';


/**
 * A select box for choosing a priority.
 *
 * @param {object} props
 * @param {string} props.value - The value of the selected priority.
 * @param {function} props.onChange - The function to call when the selected priority changes.
 * @returns {ReactElement} A JSX element representing the priority select box.
 */
const PriorityList = ({ value, onChange }) => (

    <select className="selecte-priority" value={value} onChange={onChange}>
        {priorityValues.map((priority) => (
            <option key={priority.value} value={priority.value} style={{ color: priority.color }}>
                {priority.label}
            </option>
        ))}
    </select>
);

export default PriorityList;