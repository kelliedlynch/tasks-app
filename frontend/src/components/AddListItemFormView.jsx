import React, { useState } from 'react';

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import { BACKEND_URL, ADD_ITEM_API } from "../Utility";

function AddListItemFormView(props) {
  const [newListItemName, setNewListItemName] = useState("");

  const onChange = event => setNewListItemName(event.target.value);
  const submitOnEnter = event => { if( event.key === "Enter" ) handleSubmit(); }

  async function handleSubmit( event ) {
    if(newListItemName === "") { return };
    addListItem(newListItemName)
    setNewListItemName("");
  }

  async function addListItem(item) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        list_id: props.listId,
        item: {
          item_name: newListItemName,
        }
      })
    }
    await fetch(BACKEND_URL + ADD_ITEM_API, requestOptions);
    props.didChangeList()
  }

  return (
    <>
      <InputGroup>
        <Form.Control type="text"
          placeholder="Add an item"
          value={newListItemName}
          id="listItemInput"
          onChange={onChange}
          onKeyPress={submitOnEnter} />
        <Button variant="secondary" onClick={handleSubmit}>Add Item</Button>
      </InputGroup>
    </>
  );
}

export default AddListItemFormView;
