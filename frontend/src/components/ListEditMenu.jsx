import React, { useState, useEffect } from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"

import { BACKEND_URL, EDIT_LIST_API } from "../Utility";

// console.log("ItemMenu loaded");

function ListEditMenu(props) {
  const [listMenuButtons, setListMenuButtons] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setListMenuButtons([{
      variant: "light",
      text: "⋯"
    }]);
  }, []);

  function askToConfirm() {
    setShowConfirmModal(true);
  }

  function closeConfirmModal() {
    setShowConfirmModal(false);
  }

  async function deleteList() {
    setShowConfirmModal(false);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "delete_list",
        list_id: props.list.listId,
      })
    }
    await fetch(BACKEND_URL + EDIT_LIST_API, requestOptions);

    props.didChangeList(-1);
  }

  function editList() {
    props.edit();
  }

  function showListMenu() {
    setListMenuButtons([{
      variant: "danger",
      text: "Delete",
      action: askToConfirm,
    },
    {
      variant: "primary",
      text: "Edit",
      action: editList,
    }]);
  }

  function hideListMenu() {
    setListMenuButtons([{
      variant: "light",
      text: "⋯",
      action: showListMenu,
    }]);
  }

  function ConfirmDeleteDialog(props) {
    return (
      <Modal
        show={showConfirmModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete list "{props.listName}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will delete the list "{props.listName}" and all items on the list.
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deleteList}>Delete</Button>
          <Button onClick={closeConfirmModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      );
  }

  return (
    <>
      <div className="item-menu-button ms-auto" onMouseEnter={showListMenu} onMouseLeave={hideListMenu}>
        {listMenuButtons.map((button) =>
          <Button key={button.text} variant={button.variant} onClick={button.action}>{button.text}</Button>
        )}
      </div>

      <ConfirmDeleteDialog listName={props.list.listName} />
    </>
   );
}

export default ListEditMenu;
