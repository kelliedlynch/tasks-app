import React, { useState, useEffect, useRef } from 'react';

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "get-items";
const GET_LISTS_API = "get-lists";
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

      <Checklist listId="1" />
    </div>
  );
};

function Checklist(props) {
  const isMounted = useRef(false);
  console.log("isMounted set to", isMounted.current);
  // const [listName, setListName] = useState("")
  // const [currentListId, setCurrentListId] = useState(0);
  const [currentList, setCurrentList] = useState({});
  const [listItems, setListItems] = useState([]);
  const [allLists, setAllLists] = useState([]);
  // const [listId, setListId] = useState("");
  // setListId(props.listId);
  // console.log(listId)
  useEffect(() => {
    async function initLists() {
      const response = await fetch(BACKEND_URL + GET_LISTS_API );
      const rawAllLists = await response.json();
      rawAllLists.forEach( list => {
        if( list.default == 1 ) {
          console.log("list is", list);
          setCurrentList( list );
        }
      })
      setAllLists(rawAllLists);
    }
    initLists();
  }, []);
  useEffect(() => {
    console.log("currentList is", currentList);
    if(isMounted.current) {
      console.log("currently true", isMounted.current);
      async function initListItems() {
        const response = await fetch(BACKEND_URL + GET_API + "/" + currentList["id"] );
        const rawList = await response.json();
        const sortedList = sortList( rawList );
        setListItems(sortedList);
      }
      initListItems();
    } else {
      console.log("currently false");
      isMounted.current = true;
    }
  }, [currentList]);


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

  function changeList( id ) {
    console.log("inside changeList");
    allLists.some( thisList => {
      if( id == thisList.id ) {
        setCurrentList(thisList);
        return true;
      }
    });
  }


  async function addListItem( item ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "add_list_item",
        name: item.name,
        list_id: item.id })
    }
    console.log("request looks like", requestOptions);
    const response = await fetch(BACKEND_URL + EDIT_API, requestOptions);
    const content = await response.json();
    item.item_id = content.item_id;
    item.completed = 0;
    setListItems(sortList([...listItems, item]));
  }

  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id != currentList.id) {
      otherLists.push(thisList);
    };
  });

  return (
    <>
    <ListSelector lists={otherLists} currentList={currentList} changeList={changeList} />
    <ListGroup>
      {listItems.map((listItem) =>

        <ListItem key={listItem.item_id} listItem={listItem} toggleCompleted={toggleCompleted} />
      )}
      <li className="list-group-item"><AddListItemForm addListItem={addListItem} listId={currentList.id} /></li>
    </ListGroup>
    </>
  );
}

function ListSelector( props ) {
  function handleListChange(key) {
    console.log("key is", key);
    props.changeList( key );
  }

  return (
    <Dropdown>
      <DropdownButton id="dropdown-basic-button" title={props.currentList.name} onSelect={handleListChange}>
        {props.lists.map((list) =>
          <Dropdown.Item eventKey={list.id} >{list.name}</Dropdown.Item>
        )}
      </DropdownButton>
    </Dropdown>
  );
}


function ListItem( props ) {

  function handleCheckbox() {
    props.toggleCompleted( props.listItem );
  }

  let labelClass = "form-check-label";
  if(props.listItem.completed) { labelClass += " text-decoration-line-through"};

  return (
    <ListGroup.Item>
      <Form>
        <Form.Group className="mb-3" controlId="formItemCheckbox">
          <Form.Check inline type="checkbox" onChange={handleCheckbox}
            checked={props.listItem.completed} />
          <Form.Label bsPrefix={props.listItem.completed ? "text-decoration-line-through form-label" : ""}>
            {props.listItem.name}</Form.Label>
        </Form.Group>
      </Form>
    </ListGroup.Item>
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
      id: props.listId,
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
        <Button variant="secondary" onClick={handleSubmit}>Add Item</Button>
      </div>
    </>
  );
}

export default App;
