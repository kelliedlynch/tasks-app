import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import { BACKEND_URL, EDIT_API, GET_API, GET_LISTS_API, sortList } from "./Utility";



function ChecklistBody(props) {
  const isMounted = useRef(false);

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    // console.log("currentList is", props.currentList);
    if(isMounted.current) {
      // console.log("currently true", isMounted.current);
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

  function listItemWasToggled(itemId) {
    let updatedItems = listItems;
    for ( let i=0; i<updatedItems.length; i++ ) {
      if( updatedItems[i].item_id === itemId ) {
        updatedItems[i].completed = (updatedItems[i].completed ? 0 : 1);
        break;
      }
    }
    setListItems(sortList(updatedItems));
  }

  function listItemWasDeleted(itemId) {
    let updatedItems = []
    listItems.forEach( listItem => {
        if( listItem.item_id !== itemId ) {
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





  return (
    <>
    <ListGroup>
      {listItems.map((listItem) =>
        <ListItem
        key={listItem.item_id}
        name={listItem.name}
        itemId={listItem.item_id}
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
