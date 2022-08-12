import React, { useState, useEffect, useRef } from 'react';

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

function ListSelector( props ) {
  const [editName, setEditName] = useState(false);

  // let editName = false;

  function handleListChange(eventKey) {
    // console.log(eventKey);
    props.changeList( +eventKey );
  }

  function focusListName(eventKey) {
    setEditName(true);
  }

  function unfocusListName(eventKey, event) {
    setEditName(false);
  }

  function handleKeyPress(event) {
    // console.log(event.target.value);
    if(event.key === "Enter") {
      changeListName(event.target.value)
      setEditName(false);
    }
    if(event.key === "Escape") {
      setEditName(false);
    }
  }

  function changeListName( name ) {

  }

  return (
    <Dropdown as={ButtonGroup} onSelect={handleListChange}>
      {editName ? (
          <Form>
            <Form.Control type="text"
              defaultValue={props.currentList.name}
              onBlur={unfocusListName}
              autoFocus
              onFocus={e => e.currentTarget.select()}
              onKeyDown={handleKeyPress}
               />
          </Form>
        ) : (
          <Button variant="primary" onClick={focusListName} >{props.currentList.name}</Button>
        )}

      <Dropdown.Toggle split variant="primary"></Dropdown.Toggle>
      <Dropdown.Menu>
        {props.lists.map((list) =>
          <Dropdown.Item key={list.id} eventKey={list.id} >{list.name}</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item key="addNewList" >New List</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ListSelector;
