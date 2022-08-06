import React, { useState, useEffect } from 'react';

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import ItemMenu from "./ItemMenu";

function ListItem( props ) {

  function handleCheckbox() {
    props.toggleCompleted( props.listItem );
  }

  function deleteItem() {
    props.deleteItem( props.listItem );
  }
  // let labelClass = "form-check-label";
  //if(props.listItem.completed) { labelClass += " text-decoration-line-through"};

  return (
    <ListGroup.Item>
      <Form>
        <Form.Group className="mb-3" controlId="formItemCheckbox">
          <Form.Check inline type="checkbox" onChange={handleCheckbox}
            checked={props.listItem.completed} />
          <Form.Label bsPrefix={props.listItem.completed ? "text-decoration-line-through form-label" : ""}>
            {props.listItem.name}</Form.Label>
          <ItemMenu deleteItem={deleteItem} />
        </Form.Group>
      </Form>
    </ListGroup.Item>
  );
}

export default ListItem;
