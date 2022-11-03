import React, { useState, useRef, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditListItemMenuView({show, hide, listItem, didEditListItem, closeEditListItemMenu, didClickDeleteListItem}) {
  const [itemName, setItemName] = useState(listItem.itemName);

  const listItemNameField = useRef();

  useEffect(() => {
    setItemName(listItem.itemName);
  }, [listItem]);

  const onChangeNameFieldValue = (event) => {
    setItemName(event.target.value);
  }

  const submitListItemChanges = (event) => {
    event.preventDefault();
    console.log(event.target);
    didEditListItem({ ...listItem, itemName: itemName});
    hide();
  }

  return (
  <Modal show={show} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title className="theme-accent">
        Edit List Item
      </Modal.Title>
    </Modal.Header>
    <Form onSubmit={submitListItemChanges} >
      <Modal.Body>

        <Form.Group>
          <Form.Label>List Item Name</Form.Label>
          <Form.Control ref={listItemNameField} value={itemName} onChange={onChangeNameFieldValue} />
        </Form.Group>

      </Modal.Body>
      <Modal.Footer>
        <Button type="submit">Save</Button>
        <Button variant="danger" type="button" onClick={didClickDeleteListItem}>Delete</Button>
        <Button variant="secondary" type="button" onClick={closeEditListItemMenu}>Cancel</Button>
      </Modal.Footer>
    </Form>
  </Modal>
  );
}

export default EditListItemMenuView;
