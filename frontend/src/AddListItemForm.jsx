import React, { useState, useEffect } from 'react';

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

// console.log("AddListItemForm loaded");

function AddListItemForm(props) {
  const [newListItemName, setNewListItemName] = useState("");

  useEffect(() => {
    setNewListItemName("");
  }, []);

  const onChange = event => setNewListItemName(event.target.value);
  const submitOnEnter = event => { if( event.key === "Enter" ) handleSubmit(); }

  async function handleSubmit( event ) {
    if(newListItemName === "") { return };
    const newListItem = {
      itemName: newListItemName,
      listId: props.listId,
    }
    props.addListItem( newListItem );
    setNewListItemName("");
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
