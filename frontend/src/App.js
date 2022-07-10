//import logo from './logo.svg';
//import './App.css';
import React from 'react';
import { useState, useEffect } from "react";

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";

const demo_tasks = [
  { id: 0, name: "task number one", completed: 0 },
  { id: 1, name: "task number two", completed: 0 },
  { id: 2, name: "task number three", completed: 0 },
  { id: 3, name: "task number four", completed: 0 },
];

// const live_tasks = () => {
  // const data = fetch(BACKEND_URL + GET_API)
let live_tasks = []

fetch(BACKEND_URL + GET_API)
    .then(response => response.json())
    .then(data => {
      live_tasks = data;
      console.log(data);
    });
// console.log(live_tasks);
    // console.log(data);
    // return data.result;


function App() {
  console.log(live_tasks);
  return (
    <Checklist listItems={live_tasks} />
  );
}

// class Checklist extends React.Component {
//   constructor(props) {
//     super(props);
//     this.tasks = props.tasks;
//   }
function Checklist(props) {
  const [listItems, setListItems] = useState(props.listItems);

  useEffect(() => {
    setListItems(props.listItems);
  }, [props.listItems]);

  return (
    <ul className = "taskList">
      {listItems.map((listItem) =>
        <ListItem key={listItem.id} item={listItem} />
      )}
    </ul>
  );
}



function ListItem(props) {
  const [completed, setCompleted] = useState(props.item.completed);

  useEffect(() => {
    setCompleted(props.item.completed);
  }, [props.item.completed]);

  function handleCheckbox () {
    console.log("checkbox clicked");
    if( completed === 0 ) {
      setCompleted(1);
    } else if( completed === 1 ) {
      setCompleted(0);
    }
  } 

  return (
    <li>
      <input type="checkbox" value={props.item.completed} onClick={handleCheckbox} />
      {props.item.name}
      </li>
  );
}


export default App;
