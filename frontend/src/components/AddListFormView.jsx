import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';


import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import { BsPlusCircle } from "react-icons/bs";

function AddListItemFormView({ createNewList }) {
  const [showFormField, setShowFormField] = useState(false);
  // const [newListName, setNewListName] = useState(false);

  // const inputField = useRef(null)

  const inputField = useRef(null)

  // useEffect(() => {
  //   if( inputField.current ) {
  //     const fieldContents = ReactDOM.findDOMNode(inputField.current);
  //     fieldContents.focus();
  //     fieldContents.select();
  //   }
  // }, [showFormField]);
  useEffect(() => {
    if( inputField.current ) {
        const fieldContents = ReactDOM.findDOMNode(inputField.current);
        fieldContents.focus();
        fieldContents.select();
      }
  }, [showFormField]);
  // const onFieldValueChange = event => setNewListName(event.target.value);

  function handleKeyPress(event, listId) {
    if(event.key === "Enter") {
      createNewList(event.target.value);
      setShowFormField(false);

    } else if(event.key === "Escape") {
      setShowFormField(false);
    }
  }

  if(showFormField) {
    return (
      <ListGroup.Item>
        <Form.Control type="text"
          defaultValue="New List"
          onBlur={() => setShowFormField(false)}
          onKeyUp={event => handleKeyPress(event)}
          // onFocus={selectText}
          // onChange={onFieldValueChange}
          ref={inputField}
        />
      </ListGroup.Item>
    );
  }

  return (
    <ListGroup.Item as="button" onClick={() => setShowFormField(true)} >
      <BsPlusCircle /> New List
    </ListGroup.Item>
  );

}

export default AddListItemFormView;
