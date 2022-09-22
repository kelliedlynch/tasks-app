import React, { useState, useEffect, useRef } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import ItemEditMenu from "./ItemEditMenu";

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
    props.didChangeList();
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

  return (
    <ListGroup.Item>
      <Stack direction="horizontal" gap={3}>
        <Form.Check.Input type="checkbox"
          onClick={toggleCompleted}
          defaultChecked={listItem.completed}
           />
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

        <ItemEditMenu itemId={listItem.itemId} edit={focusItemName} didChangeList={props.didChangeList} />

      </Stack>


      </ListGroup.Item>
  );
}

export default ListItem;
