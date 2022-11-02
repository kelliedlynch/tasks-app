import React, { useState, useRef, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditListMenuView({show, hide, listName, didEditListDetails, closeEditListMenu, didClickDeleteList}) {
  const [nameFieldValue, setNameFieldValue] = useState(listName);

  const listNameField = useRef();

  useEffect(() => {
    setNameFieldValue(listName);
  }, [listName]);

  const onChangeNameFieldValue = (event) => {
    setNameFieldValue(event.target.value);
  }

  const submitListChanges = (event) => {
    event.preventDefault();
    // console.log(event.target);
    didEditListDetails({ listName: nameFieldValue })
    hide();
  }

  return (
  <Modal show={show} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title className="theme-accent">
        Edit List
      </Modal.Title>
    </Modal.Header>
    <Form onSubmit={submitListChanges} >
      <Modal.Body>

        <Form.Group>
          <Form.Label>List Name</Form.Label>
          <Form.Control ref={listNameField} value={nameFieldValue} onChange={onChangeNameFieldValue} />
        </Form.Group>

      </Modal.Body>
      <Modal.Footer>
        <Button type="submit">Save</Button>
        <Button variant="danger" type="button" onClick={didClickDeleteList}>Delete</Button>
        <Button variant="secondary" type="button" onClick={closeEditListMenu}>Cancel</Button>
      </Modal.Footer>
    </Form>
  </Modal>
  );
}

export default EditListMenuView;
