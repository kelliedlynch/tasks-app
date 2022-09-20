import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import ItemMenu from "./ItemMenu";

import { BACKEND_URL, EDIT_ITEM_API } from "./Utility";

// console.log("ListItem loaded");

function ListItem( props ) {
  const [editName, setEditName] = useState(false);
  const [listItem, setListItem] = useState({
    itemId: props.item.itemId,
    itemName: props.item.itemName,
    completed: props.item.completed,
  });

  useEffect(() => {
    setListItem(props.item);
  }, [props.item])

  const inputField = useRef()
  // let focusInputField = false;

  useEffect(() => {
    if(editName === true) {
      inputField.current.focus();
    }
  }, [editName]);

  function focusItemName(event) {
    setEditName(true);
  }

  function unfocusItemName() {
    setEditName(false);
  }

  function handleKeyPress(event) {
    if(event.key === "Enter") {
      changeItemName(event.target.value)
    }
    if(event.key === "Escape") {
      unfocusItemName();
    }
  }

  async function toggleCompleted() {
    let completed = (listItem.completed === 0) ? 1 : 0;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_completed",
        item_id: listItem.itemId,
        completed: completed,
         })
      };
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    props.listWasChanged();
  }

  async function changeItemName(itemName) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_item_name",
        item_id: listItem.itemId,
        item_name: itemName,
         })
      };
      await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
      let updatedItem = {...listItem};
      updatedItem.itemName = itemName;
      await setListItem(updatedItem);
      setEditName(false);
  }

  function deleteThisItem() {
    props.listWasChanged();
  }

  return (
    <ListGroup.Item>

        <Form.Group
          className="mb-3"
          controlId="formItemCheckbox"
          >
          <Form.Check
            id={`listItemCheckbox${listItem.itemId}`}
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
                  defaultValue={listItem.itemName}
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
                  {listItem.itemName}</Form.Check.Label>
              )}
            </Col>
          <Col xs={2}>
          <ItemMenu itemId={listItem.itemId} edit={focusItemName} delete={deleteThisItem} />
          </Col>
      </Row>
      </Container>
          </Form.Check>


        </Form.Group>

      </ListGroup.Item>
  );
}

export default ListItem;
