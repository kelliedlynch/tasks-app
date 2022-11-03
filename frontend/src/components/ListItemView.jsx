import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FiEdit } from "react-icons/fi";

import ListItemEditMenuView from "./ListItemEditMenuView";

import { BACKEND_URL, EDIT_ITEM_API } from "../Utility";

// console.log("ListItem loaded");

function ListItemView( {thisItem, didChangeList} ) {
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
      changeItemName(event.target.value)
    }
    if(event.key === "Escape") {
      unfocusItemName();
    }
  }

  async function toggleCompleted() {
    const completed = (listItem.completed === 0) ? 1 : 0;
    didEditListItem({item_id: listItem.itemId, completed: completed});
    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     do: "update_completed",
    //     item_id: listItem.itemId,
    //     completed: completed,
    //      })
    //   };
    // await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    // props.didChangeList();
  }

  async function didEditListItem(item) {
    console.log("editing", item)
    // for(const [key, value] of Object.entries(item)) {

    // }
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
    setShowEditListItemMenu(false);
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
      setShowEditNameForm(false);
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
      />
      </>
  );
}

export default ListItemView;
