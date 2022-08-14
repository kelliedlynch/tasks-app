import React, { useState, useEffect, useRef } from 'react';

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import { BACKEND_URL, EDIT_API, GET_API, GET_LISTS_API } from "./Utility";

function ListSelector( props ) {
  const [editName, setEditName] = useState(false);
  const [currentList, setCurrentList] = useState({ name: "Loading"});
  const [allLists, setAllLists] = useState([]);

  const inputField = useRef()

  useEffect(() => {
    async function initLists() {
      const response = await fetch(BACKEND_URL + GET_LISTS_API );
      const rawAllLists = await response.json();
      rawAllLists.some( list => {
        if( list.default === 1 ) {
          // console.log("list is", list);
          setCurrentList(list);
          return true;
        }
        return false;
      })
      setAllLists(rawAllLists);
    }
    initLists();
  }, []);

  useEffect(() => {
    props.changeList(currentList.id)
  }, [currentList]);

  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id !== currentList.id) {
      otherLists.push(thisList);
    };
  });

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

  function handleKeyPress(event, listId) {
    console.log(event.target.value, listId);
    if(event.key === "Enter") {
      changeListName(event.target.value, listId)
      // setEditName(false);
    }
    if(event.key === "Escape") {
      setEditName(false);
    }
  }

  function changeList( id ) {
    console.log("inside changeList");
    allLists.some( thisList => {
      // console.log(id, thisList.id);
      if( id === thisList.id ) {
        setCurrentList(thisList);
        return true;
      }
      return false;
    });
  }

  async function changeListName( name, listId ) {
    console.log("listId", listId, "changing name from", currentList.name, "to", name);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_list_name",
        list_id: listId,
        name: name,
         })
      };
    await fetch(BACKEND_URL + EDIT_API, requestOptions);
    let updatedList = currentList;
    updatedList.name = name;
    await setCurrentList(updatedList);
    // await props.changeList(updatedList);
    setEditName(false);

  }

  return (
    <Dropdown as={ButtonGroup} onSelect={handleListChange} className="">
      {editName ? (

            <Form.Control type="text"
              defaultValue={currentList.name}
              onBlur={unfocusListName}
              autoFocus
              onFocus={e => e.currentTarget.select()}
              onKeyUp={event => handleKeyPress(event, props.currentListId)}
              ref={inputField}
               />

        ) : (
          <Button variant="primary" onClick={focusListName} >{currentList.name}</Button>
        )}

      <Dropdown.Toggle split variant="primary"></Dropdown.Toggle>
      <Dropdown.Menu>
        {allLists.map((list) =>
          <Dropdown.Item key={list.id} eventKey={list.id} >{list.name}</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item key="addNewList" >New List</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ListSelector;
