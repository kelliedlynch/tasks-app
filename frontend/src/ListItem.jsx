import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import ItemMenu from "./ItemMenu";

const BACKEND_URL = "http://localhost:5000/";
const EDIT_API = "edit-item"

function ListItem( props ) {
  const [editName, setEditName] = useState(false);
  const [listItem, setListItem] = useState({
    item_id: props.itemId,
    name: props.name,
    completed: props.completed,
  });


  const inputField = useRef()
  // let focusInputField = false;

  useEffect(() => {
    console.log("editName set to", editName);
    if(editName === true) {
      console.log(inputField);
      inputField.current.focus();
    }
  }, [editName]);

  function focusItemName(event) {
    // event.preventDefault();
    setEditName(true);
    console.log("editName is", editName);
  }

  function unfocusItemName() {
    setEditName(false);
  }

  function handleKeyPress(event) {
    console.log("key pressed", event.target.value);
    if(event.key === "Enter") {
      changeItemName(event.target.value)
    }
    if(event.key === "Escape") {
      unfocusItemName();
    }
  }

  async function toggleCompleted() {
    let updatedItem = listItem;
    updatedItem.completed = (updatedItem.completed === 0) ? 1 : 0;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_completed",
        item_id: updatedItem.item_id,
        completed: updatedItem.completed,
         })
      };
    await fetch(BACKEND_URL + EDIT_API, requestOptions);
    setListItem(updatedItem)

    props.toggle(updatedItem.item_id);
  }

  async function changeItemName(name) {
    console.log("changing name from", props.name, "to", name);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_name",
        item_id: listItem.item_id,
        name: name,
         })
      };
      await fetch(BACKEND_URL + EDIT_API, requestOptions);
      let updatedItem = listItem;
      updatedItem.name = name;
      console.log("new list item", updatedItem);
      await setListItem(updatedItem);
      setEditName(false);
  }

  function deleteThisItem() {
    props.delete( listItem.item_id );
  }

  function stopLabelPropagation(event) {
    event.preventDefault();
    focusItemName();
    // event.stopPropagation();
  }

  return (
    <ListGroup.Item>

        <Form.Group
          className="mb-3"
          controlId="formItemCheckbox"
          >
          <Form.Check
            id={`listItemCheckbox${listItem.item_id}`}
            type="checkbox" >
      <Container fluid >
      <Row>
            <Col xs="auto">
              <Form.Check.Input type="checkbox"
                onClick={toggleCompleted}
                defaultChecked={listItem.completed}

                 />
            </Col>
            <Col>
              {editName ? (
                <Form.Control type="text"
                  defaultValue={listItem.name}
                  onBlur={unfocusItemName}
                  autoFocus
                  onFocus={e => e.currentTarget.select()}
                  onKeyUp={handleKeyPress}
                  ref={inputField}
                />
              ):(
                  <Form.Check.Label
                    // onClick={stopLabelPropagation}
                    onClick={focusItemName}
                    bsPrefix={listItem.completed ?
                     ("text-decoration-line-through form-label")
                      : ("")}>
                  {listItem.name}</Form.Check.Label>
              )}
            </Col>
          <Col xs={2}>
          <ItemMenu itemId={listItem.item_id} edit={focusItemName} delete={deleteThisItem} />
          </Col>
      </Row>
      </Container>
          </Form.Check>


        </Form.Group>

      </ListGroup.Item>
  );
}

export default ListItem;
