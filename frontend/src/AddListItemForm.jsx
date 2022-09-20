import React, { useState } from 'react';

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import { BACKEND_URL, EDIT_ITEM_API } from "./Utility";

function AddListItemForm(props) {
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "add_list_item",
        item_name: newListItemName,
        list_id: props.listId })
    }
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    props.listWasChanged()
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

export default AddListItemForm;
