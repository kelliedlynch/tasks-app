import React, { useState, useEffect, useRef, useCallback } from 'react';

import ListGroup from "react-bootstrap/ListGroup";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import { BACKEND_URL, GET_API, sortList } from "./Utility"; 

// console.log("ChecklistBody loaded");

function ChecklistBody(props) {
  const isMounted = useRef(false);

  const [listItems, setListItems] = useState([]);

  const fetchAllListItems = useCallback( 
    async () => {
      const response = await fetch(BACKEND_URL + GET_API + "/" + props.currentListId );
      const rawList = await response.json();
      setListItems(sortList( rawList ));
    }, [props.currentListId])

  useEffect(() => {
    if(isMounted.current && props.currentListId !== undefined) {
      fetchAllListItems()
    } else {
      isMounted.current = true;
    }
  }, [props.currentListId, fetchAllListItems]);

  async function didChangeList() {
    fetchAllListItems();
  }



  return (
    <>
    <ListGroup>
      {listItems.map((listItem) =>
        <ListItem
        key={listItem.itemId}
        item={listItem}
        didChangeList={didChangeList}
        />
      )}
      <li className="list-group-item"><AddListItemForm didChangeList={didChangeList} listId={props.currentListId} /></li>
    </ListGroup>
    </>
  );
}

export default ChecklistBody;
