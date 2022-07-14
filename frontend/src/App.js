//import logo from './logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
const DEL_API = "del-task";
const ADD_API = "add-task";

function App() {

  return (
    <div>
      <Checklist  />
    </div>
  );
};

function Checklist(props) {
  const [listItems, setListItems] = useState(props.listItems ? props.listItems : []);

  async function initListItems() {
    // setLoading(true);
    console.log("initListItems");
    fetch(BACKEND_URL + GET_API)
      .then(response => response.json())
      .then(response => {
          setListItems (response);
          console.log("response was", response);
          // setLoading(false);
      });
  };

  useEffect(() => {
    initListItems();
  }, [props.listItems]);

  function rerender() {
    console.log("trying to rerender");
    initListItems();
  };

  return (
    <ul className = "checklist">
      {listItems.map((listItem) =>
        <ListItem key={listItem.taskid} item={listItem} rerender={rerender} />
      )}
      <li><AddListItemForm rerender={rerender} /></li>
    </ul>
  );
}

function ListItem(props) {
  const [completed, setCompleted] = useState(props.item.completed);

  useEffect(() => {
    setCompleted(props.item.completed);
  }, [props.item.completed]);
//

  async function handleCheckbox () {
    console.log("checkbox clicked");
    if( completed === 0 ) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskid: props.item.taskid })
      };
      let response = await fetch(BACKEND_URL + DEL_API, requestOptions);
      props.rerender();

      console.log("list item deleted:", props.item);
    }
  } 

  return (
    <li>
      <input type="checkbox" value={props.item.completed} onClick={handleCheckbox} />
      {props.item.name}
      </li>
  );
}

function AddListItemForm(props) {
  const [newListItemName, setNewListItemName] = useState("");
  // const [addNewItem, setAddNewItem] = useState();

  useEffect(() => {
    setNewListItemName("");
  }, []);

  const onChange = event => setNewListItemName(event.target.value);
  const submitOnEnter = event => { if( event.key === "Enter" ) handleSubmit(); }

  async function handleSubmit( event ) {
    console.log("handleSubmit", event);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListItemName })
    };

    let response = await fetch(BACKEND_URL + ADD_API, requestOptions);
    props.rerender();
    setNewListItemName("");

    console.log("list item added:", newListItemName, "response:", response);
  }

  return (
    <>
      <input type="text" value={newListItemName} id="listItemInput"
        onChange={ onChange } onKeyPress={ submitOnEnter }/>
      <button onClick={handleSubmit}> Add Item </button>
    </>
  );
}

export default App;
