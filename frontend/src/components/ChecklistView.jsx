import React, { useState, useEffect, useRef, useCallback } from 'react';

import ListGroup from "react-bootstrap/ListGroup";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import { BACKEND_URL, GET_API, sortList } from "../Utility";

// console.log("ChecklistBody loaded");

function ChecklistView({currentList}) {
  const isMounted = useRef(false);

  const [list, setList] = useState(currentList);

  const fetchAllListItems = useCallback(
    async () => {
      const response = await fetch(BACKEND_URL + GET_API + "/" + currentList.listId );
      const rawList = await response.json();
      const listData = {...currentList, "items": sortList(rawList)};
      setList(listData);
    }, [currentList])

  useEffect(() => {
    if(isMounted.current && currentList.listId !== undefined) {
      fetchAllListItems()
    } else {
      isMounted.current = true;
    }
  }, [currentList, fetchAllListItems]);

  async function didChangeList() {
    fetchAllListItems();
  }

  return (
    <>
    <h4 className="text-theme-tertiary">{list.listName}</h4>
    <ListGroup>
      {list.items.map((listItem) =>
        <ListItem
        key={listItem.itemId}
        item={listItem}
        didChangeList={didChangeList}
        />
      )}
      <li className="list-group-item"><AddListItemForm didChangeList={didChangeList} listId={list.listId} /></li>
    </ListGroup>
    </>
  );
}

export default ChecklistView;
