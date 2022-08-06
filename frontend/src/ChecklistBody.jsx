import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import sortList from "./Utility";

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "get-items";
const GET_LISTS_API = "get-lists";
const EDIT_API = "edit-item"

function ChecklistBody(props) {
  const isMounted = useRef(false);

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    console.log("currentList is", props.currentList);
    if(isMounted.current) {
      console.log("currently true", isMounted.current);
      async function initListItems() {
        const response = await fetch(BACKEND_URL + GET_API + "/" + props.currentList["id"] );
        const rawList = await response.json();
        const sortedList = sortList( rawList );
        setListItems(sortedList);
      }
      initListItems();
    } else {
      console.log("currently false");
      isMounted.current = true;
    }
  }, [props.currentList]);

  // async function toggleCompleted( item ) {
  //   let newItems = [...listItems];
  //   newItems.forEach(thisItem => {
  //     if( thisItem.item_id === item.item_id ) {
  //       thisItem.completed = item.completed;
  //     }
  //   });
  //   setListItems(sortList(newItems));
  // }

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

  async function deleteListItem( item ) {
    console.log("item to be deleted", item )
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "delete_list_item",
        item_id: item.item_id,
      })
    }
    console.log("request looks like", requestOptions);
    await fetch(BACKEND_URL + EDIT_API, requestOptions);
    // const itemIndex = listItems.indexOf(item);
    const updatedListItems = listItems.filter(thisItem => thisItem !== item);
    setListItems(updatedListItems);
  }

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
      // props.toggleCompleted( item );
  }

  return (
    <>
    <ListGroup>
      {listItems.map((listItem) =>

        <ListItem key={listItem.item_id} listItem={listItem} toggleCompleted={toggleCompleted} deleteItem={deleteListItem} />
      )}
      <li className="list-group-item"><AddListItemForm addListItem={addListItem} listId={props.currentList.id} /></li>
    </ListGroup>
    </>
  );
}

export default ChecklistBody;
