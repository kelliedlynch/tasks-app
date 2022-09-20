import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import { BACKEND_URL, EDIT_ITEM_API, GET_API, sortList } from "./Utility"; 

// console.log("ChecklistBody loaded");

function ChecklistBody(props) {
  const isMounted = useRef(false);

  const [listItems, setListItems] = useState([]);

  // let currentListId;
  // useEffect(() => {
  //   console.log("checking props.currentListId", props.currentListId);
  //   if(props.currentListId !== undefined) {
  //     currentListId = props.currentListId;
  //   };
  // });

  useEffect(() => {
    console.log("useEffect triggered on currentListId");
    // console.log("currentList is", props.currentList);
    if(isMounted.current && props.currentListId !== undefined) {
      console.log("loading checklist items");
      async function initListItems() {
        const response = await fetch(BACKEND_URL + GET_API + "/" + props.currentListId );
        const rawList = await response.json();
        const sortedList = sortList( rawList );
        setListItems(sortedList);
      }
      initListItems();
    } else {
      // console.log("currently false");
      isMounted.current = true;
    }
  }, [props.currentListId]);

  async function listItemWasToggled(itemId) {
    let updatedItems = listItems;
    for ( let i=0; i<updatedItems.length; i++ ) {
      console.log("loop", i);
      if( updatedItems[i].itemId === itemId ) {
        console.log("item found, updating completed tag");
        updatedItems[i].completed = (updatedItems[i].completed ? 0 : 1);
        break;
      }
    }
    let sortedItems = sortList(updatedItems);
    console.log("sortedItems", sortedItems);
    setListItems(sortedItems);
  }

  function listItemWasDeleted(itemId) {
    let updatedItems = []
    listItems.forEach( listItem => {
        if( listItem.itemId !== itemId ) {
          updatedItems.push(listItem);
        }
    })
    setListItems(updatedItems);
  }

  // TODO: should add/remove functions belong to the add form/listItem?
  async function addListItem( item ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "add_list_item",
        name: item.itemName,
        list_id: item.listId })
    }
    console.log("request looks like", requestOptions);
    const response = await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    const content = await response.json();
    item.item_id = content.item_id;
    item.completed = 0;
    setListItems(sortList([...listItems, item]));
  }





  return (
    <>
    <ListGroup>
      {listItems.map((listItem) =>
        <ListItem
        key={listItem.itemId}
        name={listItem.itemName}
        itemId={listItem.itemId}
        completed={listItem.completed}
        toggle={listItemWasToggled}
        delete={listItemWasDeleted}
        />
      )}
      <li className="list-group-item"><AddListItemForm addListItem={addListItem} listId={props.currentListId} /></li>
    </ListGroup>
    </>
  );
}

export default ChecklistBody;
