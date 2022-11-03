import React, { useState, useEffect, useRef, useCallback } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

import { FiEdit } from "react-icons/fi";

import ListItemView from "./ListItemView";
import AddListItemForm from "./AddListItemForm";
import EditListMenuView from "./EditListMenuView";
import { BACKEND_URL, GET_API, sortList } from "../Utility";

// console.log("ChecklistBody loaded");

function ChecklistView({currentList, didEditList}) {
  const isMounted = useRef(false);

  let listData = currentList;
  listData["items"] = [];

  const [list, setList] = useState(listData);
  const [editListMenuOpen, setEditListMenuOpen] = useState(false);

  const fetchAllListItems = useCallback(
    async () => {
      const response = await fetch(BACKEND_URL + GET_API + "/" + currentList.listId );
      const rawList = await response.json();
      const listData = {...currentList, "items": sortList(rawList)};
      setList(listData);
    }, [currentList])

  useEffect(() => {
    if(isMounted.current && currentList.listId !== 0) {
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

  function didEditListDetails(newListData) {
    newListData.listId = list.listId;
    didEditList(newListData);
  }

  function didClickDeleteList(listId) {
    console.log("confirm delete list");
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
        <ListItemView
        key={listItem.itemId}
        item={listItem}
        didChangeList={didChangeList}
        />
      )}
      <li className="list-group-item"><AddListItemForm didChangeList={didChangeList} listId={list.listId} /></li>
    </ListGroup>

    <EditListMenuView
      show={editListMenuOpen}
      hide={closeEditListMenu}
      listName={list.listName}
      didEditListDetails={didEditListDetails}
      closeEditListMenu={closeEditListMenu}
      didClickDeleteList={didClickDeleteList} />
    </>
  );
}

export default ChecklistView;
