import React, { useState, useEffect } from 'react';

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "tasks";
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
  incompleteItems.sort(function(a, b){return a["item_id"] - b["item_id"]});
  completeItems.sort(function(a, b){return a["item_id"] - b["item_id"]});
  return incompleteItems.concat(completeItems);
}

function App() {
  return (
    <div className="container-sm">
      <Checklist />
    </div>
  );
};

function Checklist(props) {
  const [listItems, setListItems] = useState([]);

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
    item.completed = (item.completed === 0) ? 1 : 0;
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
      newItems.forEach(thisItem => {
        if( thisItem.item_id === item.item_id ) {
          thisItem.completed = item.completed;
        }
      });
      setListItems(sortList(newItems));
  }

  async function addListItem( item ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "add_list_item",
        name: item.name })
    }
    const response = await fetch(BACKEND_URL + EDIT_API, requestOptions);
    const content = await response.json();
    item.item_id = content.item_id;
    item.completed = 0;
    setListItems(sortList([...listItems, item]));
  }

  return (
    <ul className="list-group">
      {listItems.map((listItem) =>
        <ListItem key={listItem.item_id} listItem={listItem} toggleCompleted={toggleCompleted} />
      )}
      <li className="list-group-item"><AddListItemForm addListItem={addListItem} /></li>
    </ul>
  );
}

function ListItem( props ) {

  function handleCheckbox() {
    props.toggleCompleted( props.listItem );
  }

  let liClass = "list-group-item";
  if(props.listItem.completed) { liClass += " disabled"};

  return (
    <li className={liClass}>
      <div class="form-check">
        <input type="checkbox" className="form-check-input" onChange={handleCheckbox}
          checked={props.listItem.completed} id={props.key} />
        <label class="form-check-label" for={props.key}>{props.listItem.name}</label>
      </div>
    </li>
  );
}

function AddListItemForm(props) {
  const [newListItemName, setNewListItemName] = useState("");

  useEffect(() => {
    setNewListItemName("");
  }, []);

  const onChange = event => setNewListItemName(event.target.value);
  const submitOnEnter = event => { if( event.key === "Enter" ) handleSubmit(); }

  async function handleSubmit( event ) {
    if(newListItemName === "") { return };
    const newListItem = {
      name: newListItemName,
    }
    props.addListItem( newListItem );
    setNewListItemName("");
  }

  return (
    <>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Add an item"
          value={newListItemName} id="listItemInput" onChange={ onChange }
          onKeyPress={ submitOnEnter }/>
        <button type="button" class="btn btn-secondary" onClick={handleSubmit}>
          Add Item </button>
      </div>
    </>
  );
}

export default App;
