import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FiEdit } from "react-icons/fi";

import ListItemEditMenuView from "./ListItemEditMenuView";

import { BACKEND_URL, EDIT_ITEM_API, toSnakeCase } from "../Utility";

// console.log("ListItem loaded");

function ListItemView( {thisItem, didChangeList, didClickDeleteListItem } ) {
  const [showEditNameForm, setShowEditNameForm] = useState(false);
  const [showOpenMenuButton, setShowOpenMenuButton] = useState(false);
  const [showEditListItemMenu, setShowEditListItemMenu] = useState(false);
  const [listItem, setListItem] = useState({
    itemId: thisItem.itemId,
    itemName: thisItem.itemName,
    completed: thisItem.completed,
  });

  useEffect(() => {
    setListItem(thisItem);
  }, [thisItem])

  const inputField = useRef()
  // let focusInputField = false;

  useEffect(() => {
    if(showEditNameForm === true) {
      inputField.current.focus();
    }
  }, [showEditNameForm]);

  function focusItemName(event) {
    setShowEditNameForm(true);
  }

  function unfocusItemName() {
    setShowEditNameForm(false);
  }

  function handleKeyPress(event) {
    if(event.key === "Enter") {
      didEditListItem({ itemId: listItem.itemId, itemName: event.target.value });
      unfocusItemName();
    }
    if(event.key === "Escape") {
      unfocusItemName();
    }
  }

  async function toggleCompleted() {
    const completed = (listItem.completed === 0) ? 1 : 0;
    didEditListItem({itemId: listItem.itemId, completed: completed});
  }

  async function didEditListItem(itemData) {
    let item = {}
    for(const [key, value] of Object.entries(itemData)) {
      item[toSnakeCase(key)] = value;
    }
    console.log(item)
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_data: item
      })
    }
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    let newItem = {...listItem}
    for(const [key, value] of Object.entries(item)) { newItem[key] = value }
    setListItem(newItem);
    didChangeList();
  }

  function closeEditListItemMenu() {
    console.log("closing menu")
    setShowEditListItemMenu(false);
  }

  return (
    <>
    <ListGroup.Item
      onMouseEnter={() => setShowOpenMenuButton(true)}
      onMouseLeave={() => setShowOpenMenuButton(false)}
    >
      <Row
        className="list-item-container d-flex align-items-center"
      >
        <Col
          className="list-item-left"
        >
          <Form.Check.Input type="checkbox"
            onClick={(toggleCompleted)}
            defaultChecked={listItem.completed}
             />
        </Col>
        <Col
          className="list-item-mid"
        >
            {showEditNameForm ? (
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
          <Col
            className="list-item-right"
          >
          {showOpenMenuButton && <Button className="theme-edit-button ms-auto" onClick={() => setShowEditListItemMenu(true)} ><FiEdit /></Button> }
          </Col>

      </Row>

      </ListGroup.Item>
      <ListItemEditMenuView
        show={showEditListItemMenu}
        hide={closeEditListItemMenu}
        listItem={listItem}
        didEditListItem={didEditListItem}
        didCloseEditListItemMenu={closeEditListItemMenu}
        didClickDeleteListItem={() => didClickDeleteListItem(listItem.itemId)}
      />
      </>
  );
}

export default ListItemView;
