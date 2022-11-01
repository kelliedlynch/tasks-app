import React, { useState, useEffect, useRef, useCallback } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { FiEdit } from "react-icons/fi";

import ListItem from "./ListItem";
import AddListItemForm from "./AddListItemForm";
import EditListMenuView from "./EditListMenuView";
import { BACKEND_URL, GET_API, sortList } from "../Utility";

// console.log("ChecklistBody loaded");

function ChecklistView({currentList}) {
  const isMounted = useRef(false);

  const [list, setList] = useState(currentList);
  const [editListMenuOpen, setEditListMenuOpen] = useState(false);

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

  const openEditListMenu = () => {
    console.log("list name", list.listName);
    setEditListMenuOpen(true);
  }

  const closeEditListMenu = () => {
    setEditListMenuOpen(false);
  }

  return (
    <>
    <div className="px-4 pt-3 pb-1">
      <Stack direction="horizontal">
        <h3 className="theme-accent">{list.listName}</h3>
        <div className="ms-auto" >
          <Button onClick={openEditListMenu} variant="outline-secondary"><FiEdit /></Button>
        </div>
      </Stack>
    </div>
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

    <EditListMenuView show={editListMenuOpen} hide={closeEditListMenu} listName={list.listName} />
    </>
  );
}

export default ChecklistView;
