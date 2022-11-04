import React, { useState, useEffect, useRef, useCallback } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

import { FiEdit } from "react-icons/fi";

import ListItemView from "./ListItemView";
import AddListItemFormView from "./AddListItemFormView";
import EditListMenuView from "./EditListMenuView";
import ConfirmDeleteListView from "./ConfirmDeleteListView";
import { BACKEND_URL, GET_API, DELETE_ITEM_API, DELETE_LIST_API, sortList } from "../Utility";

// console.log("ChecklistBody loaded");

function ChecklistView({currentList, didEditList, didDeleteCurrentList }) {
  const isMounted = useRef(false);

  const [list, setList] = useState({...currentList, items: []});
  const [editListMenuOpen, setEditListMenuOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchAllListItems = useCallback(
    async () => {
      console.log("fetching all list items");

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
    setEditListMenuOpen(false);
    setShowConfirmModal(true);
  }

  async function didDeleteList(listId) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        list_id: listId
      })
    }
    await fetch(BACKEND_URL + DELETE_LIST_API, requestOptions);
    didDeleteCurrentList();
  }

  function closeConfirmModal() {
    setShowConfirmModal(false);
  }

  async function didClickDeleteListItem(itemId) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: itemId
      })
    }
    await fetch(BACKEND_URL + DELETE_ITEM_API, requestOptions);
    didChangeList();
  }

  return (
    <>
    <div className="px-4 pt-3 pb-1">
      <Stack direction="horizontal">
        <h3 className="theme-accent">{list.listName}</h3>
        <div className="ms-auto" >
          <Button
            onClick={openEditListMenu}
            className="theme-edit-button"
          >
            <FiEdit />
          </Button>
        </div>
      </Stack>
    </div>
    <ListGroup>
      {list.items.map((listItem) =>
        <ListItemView
        key={listItem.itemId}
        thisItem={listItem}
        didChangeList={didChangeList}
        didClickDeleteListItem={didClickDeleteListItem}
        />
      )}
      <li className="list-group-item"><AddListItemFormView didChangeList={didChangeList} listId={list.listId} /></li>
    </ListGroup>

    <EditListMenuView
      show={editListMenuOpen}
      hide={closeEditListMenu}
      listName={list.listName}
      didEditListDetails={didEditListDetails}
      closeEditListMenu={closeEditListMenu}
      didClickDeleteList={didClickDeleteList} />

    <ConfirmDeleteListView
      show={showConfirmModal}
      hide={closeConfirmModal}
      listName={list.listName}
      didDeleteList={() => didDeleteList(list.listId)}
      closeConfirmModal={closeConfirmModal}
    />
    </>
  );
}

export default ChecklistView;
