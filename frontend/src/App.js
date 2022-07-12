//import logo from './logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
const DEL_API = "del-task";

// const demo_tasks = [
//   { id: 0, name: "task number one", completed: 0 },
//   { id: 1, name: "task number two", completed: 0 },
//   { id: 2, name: "task number three", completed: 0 },
//   { id: 3, name: "task number four", completed: 0 },
// ];

// const live_tasks = () => {
  // const data = fetch(BACKEND_URL + GET_API)
// let live_tasks = []

// fetch(BACKEND_URL + GET_API)
//     .then(response => response.json())
//     .then(data => {
//       live_tasks = data;
//       // console.log("data", data);
//     });
// console.log(live_tasks);
    // console.log(data);
    // return data.result;



function App() {
  const [loading, setLoading] = useState(false);
  const [listItems, setListItems] = useState([]);


  useEffect(() => {
    const initListItems = async () => {
      setLoading(true);
      const response = fetch(BACKEND_URL + GET_API)
        .then(response => response.json())
        .then(response => {
          // console.log(response)
            setListItems (response);
            setLoading(false);
        })
      // const resJson = await response.json();
      // console.log("resJson", resJson);


    }
    initListItems();
  }, []);




      // setLoading(true);
      // const finalResponse = await fetch(BACKEND_URL + GET_API)
      //   .then(response => response.json())
      //   .then(response => {
      //     setTasks(response.result);
      //     return response.result;
      //     console.log("response.result", response.result);
      //   });
      // const response = await fetch(BACKEND_URL + GET_API);
      // const resJson = response.json();
      // const result = resJson.result;
      // console.log("response is", response.json());
      // setTasks(response);
      // setLoading(false);
    // };
    // initTasks();
  //   return;
  // }, []);



  return (
    <div>
    {loading ? (
      <h4>Loading...</h4>) :
      <Checklist listItems={listItems} />
  }
  </div>
  );
}





function Checklist(props) {
  const [listItems, setListItems] = useState(props.listItems);

  function addListItem(newItem) {
    setListItems([...listItems, newItem]);
  }

  useEffect(() => {
    setListItems(props.listItems);
  }, [props.listItems]);
  console.log(props);


  return (
    <ul className = "taskList">
      {props.listItems.map((listItem) =>
        <ListItem key={listItem.taskid} item={listItem} />
      )}
      <li><AddListItemForm addListItem={addListItem} /></li>
    </ul>
  );
}

function AddListItemForm( { addListItem } ) {
  const [newListItemName, setNewListItemName] = useState();

  // useEffect(() => {
  //   setNewListItemName();
  // }, []);

  function handleSubmit( event ) {
    // TODO: what should the taskid of a new task be, if any?
    addListItem( { taskid: -1, name: newListItemName, completed: 0 });
    console.log("list item added", newListItemName);
    // what does this do?
    event.preventDefault();
  }

  return (
    <form onSubmit={ e => {handleSubmit(e)}}>
      <input type="text" name="newListItemName" value={newListItemName}
        onChange={event => setNewListItemName(event.target.value)} />
      <input type="submit" value="Add Item" />
    </form>
    );
}

function ListItem(props) {
  const [completed, setCompleted] = useState(props.item.completed);

  useEffect(() => {
    setCompleted(props.item.completed);
  }, [props.item.completed]);
//

  function handleCheckbox () {
    console.log("checkbox clicked");
    if( completed === 0 ) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskid: props.item.taskid })
      };
      fetch(BACKEND_URL + DEL_API, requestOptions)
      .then(setCompleted(1))

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
