import React, { useState, useRef, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditListMenuView({show, hide, listName}) {
  const [nameFieldValue, setNameFieldValue] = useState(listName);

  const listNameField = useRef();

  console.log("listName on menu render", listName);

  useEffect(() => {
    setNameFieldValue(listName);
  }, [listName]);

  const onChangeNameFieldValue = (event) => {
    console.log("nameFieldValue changing", event.target.value)
    setNameFieldValue(event.target.value);
  }

  const submitListChanges = (event) => {
    event.preventDefault();
    hide();
  }

  return (
  <Modal show={show} onHide={hide}>
    <Modal.Header>
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
      </Modal.Footer>
    </Form>
  </Modal>
  );
}

export default EditListMenuView;
