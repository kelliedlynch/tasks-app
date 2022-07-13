//import logo from './logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
const DEL_API = "del-task";
const ADD_API = "add-task";

function App() {
  // const [loading, setLoading] = useState(false);
  // const [listItems, setListItems] = useState([]);


  // useEffect(() => {
  //   const initListItems = async () => {
  //     // setLoading(true);
  //     const response = fetch(BACKEND_URL + GET_API)
  //       .then(response => response.json())
  //       .then(response => {
  //         // console.log(response)
  //           setListItems (response);
  //           // setLoading(false);
  //       });
  //   };
  //   initListItems();
  // }, [])

  return (
    <div>
      <Checklist  />
    </div>
  );
};





function Checklist(props) {
  const [listItems, setListItems] = useState(props.listItems ? props.listItems : []);

  // function addListItem(newItem) {
  //   setListItems([...listItems, newItem]);
  // }

  // const listItems = props.listItems;
  // useEffect(() => {
  //   setListItems(props.listItems);
  //   console.log("rendering?");
  // }, [props.listItems]);
  // console.log(listItems);

  async function initListItems() {
    // setLoading(true);
    console.log("initListItems");
    const response = fetch(BACKEND_URL + GET_API)
      .then(response => response.json())
      .then(response => {
        // console.log(response)
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
        <ListItem key={listItem.taskid} item={listItem} />
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

function AddListItemForm(props) {
  const [newListItemName, setNewListItemName] = useState("");
  // const [addNewItem, setAddNewItem] = useState();

  useEffect(() => {
    setNewListItemName("default");
  }, []);

  const onChange = event => setNewListItemName(event.target.value);

  async function handleSubmit( event ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListItemName })
    };
    let response = fetch(BACKEND_URL + ADD_API, requestOptions)
      .then(props.rerender())
      .then( console.log("list item added", newListItemName) );

    // what does this do?
    event.preventDefault();
    // props.rerender();
  }

  return (
    <form onSubmit={ async () => { await handleSubmit(); }}>
      <input type="text" name="newListItemName" value={newListItemName}
        onChange={ onChange } />
      <input type="submit" value="Add Item" />
    </form>
    );
}

export default App;
