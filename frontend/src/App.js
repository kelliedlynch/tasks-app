//import logo from './logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
const DEL_API = "del-task";
const ADD_API = "add-task";
const EDIT_API = "edit-item"

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
          console.log("initListItems response was", response);
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
        <ListItem key={listItem.item_id} item={listItem} rerender={rerender} />
      )}
      <li><AddListItemForm rerender={rerender} /></li>
    </ul>
  );
}

function ListItem(props) {
  const [completed, setCompleted] = useState(props.item.completed);

  useEffect(() => {
    completeListItem();
  }, [completed]);
//

  function handleCheckbox() {
    if( completed == 0) {
      setCompleted(1);
    } else {
      setCompleted(0);
    }
  }

  function completeListItem() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_completed",
        item_id: props.item.item_id,
        completed: completed,
         })
      };
      fetch(BACKEND_URL + EDIT_API, requestOptions);
  } 

  return (
    <li>
      <input type="checkbox" checked={completed} onChange={handleCheckbox} />
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
