//import logo from './logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';

// const http = require("http");

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
// const DEL_API = "del-task";
const ADD_API = "add-task";
const EDIT_API = "edit-item"

function sortList( unsortedList ) {
  let incompleteItems = [];
  let completeItems = [];
  unsortedList.forEach( item => {
    if( item.completed === 0 ) {
      incompleteItems.push(item);
    } else {
      completeItems.push(item);
    };
  });
  return incompleteItems.concat(completeItems);
}

function App() {
  // const [listItems, setListItems] = useState();

  // // async function initListItems() {
  //   // setLoading(true);
  //   console.log("initListItems");
  //   const response = await fetch(BACKEND_URL + GET_API);
  //   const rawList = await response.json();
  //   console.log("rawList", rawList);
  //   const sortedList = sortList( rawList );
  //   setListItems( sortedList );
  //   // return sortedList;
  //     // .then(response => response.json())
  //     // .then(response => {
  //     //     setListItems (response);
  //     //     console.log("initListItems response was", response);
  //     //     // setLoading(false);
  //     // });
  // // };
  // // initListItems();
  // console.log(listItems);

  return (
    <div>
      <Checklist />
    </div>
  );
};

function Checklist(props) {
  const [listItems, setListItems] = useState([]);

  // async function initListItems() {
  //   // setLoading(true);
  //   console.log("initListItems");
  //   const response = await fetch(BACKEND_URL + GET_API);
  //   const rawList = await response.json();
  //   const sortedList = sortList( rawList );
  //   // setListItems( sortedList );
  //   return sortedList;

      // .then(response => response.json())
      // .then(response => {
      //     setListItems (response);
      //     console.log("initListItems response was", response);
      //     // setLoading(false);
      // });
  // };
  // initListItems();

  useEffect(() => {
    async function initListItems() {
      const response = await fetch(BACKEND_URL + GET_API);
      const rawList = await response.json();
      const sortedList = sortList( rawList );
      setListItems(sortedList);
    }
    initListItems();
  }, []);

  async function toggleCompleted( item ) {
    if( item.completed === 0 ) {
      item.completed = 1;
    } else {
      item.completed = 0;
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_completed",
        item_id: item.item_id,
        completed: item.completed,
         })
      };
      await fetch(BACKEND_URL + EDIT_API, requestOptions);
      let newItems = [...listItems];
      console.log("newItems before update", newItems);
      newItems.forEach(thisItem => {
        if( thisItem.item_id === item.item_id ) {
          thisItem.completed = item.completed;
        }
      });
      console.log("newItems after update", sortList(newItems));
      setListItems(sortList(newItems));
  }

  return (
    <ul className = "checklist">
      {listItems.map((listItem) =>
        <ListItem key={listItem.item_id} listItem={listItem} toggleCompleted={toggleCompleted} />
      )}
      <li><AddListItemForm setListItems={setListItems} /></li>
    </ul>
  );
}

function ListItem( props ) {
  // const [listItem, setListItem] = useState(props.item);
  // const [completed, setCompleted] = useState(props.item.completed);
  // const item_id = props.item.item_id;

  useEffect(() => {
    // function completeListItem() {
    //   const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       do: "update_completed",
    //       item_id: listItem.item_id,
    //       completed: listItem.completed,
    //        })
    //     };
    //     fetch(BACKEND_URL + EDIT_API, requestOptions);
    // }
    // completeListItem();
  }, );
//

  function handleCheckbox() {
    props.toggleCompleted( props.listItem );
    // props.rerender();
  }

  return (
    <li>
      <input type="checkbox" checked={props.listItem.completed} onChange={handleCheckbox} />
      {props.listItem.name}
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

    await fetch(BACKEND_URL + ADD_API, requestOptions);
    props.rerender();
    setNewListItemName("");

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
