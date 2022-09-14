import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import { BACKEND_URL, EDIT_ITEM_API, GET_LISTS_API, NEW_LIST_ID } from "./Utility";

// console.log("ListSelector loaded");

function ListSelector( props ) {
  const [showListNameInputField, setShowListNameInputField] = useState(false);
  const [addNewList, setAddNewList] = useState(false);
  const [currentList, setCurrentList] = useState({ name: "Loading"});
  const [allLists, setAllLists] = useState([]);
  const isMounted = useRef(false);
  const listsInitialized = useRef(false);

  const inputField = useRef(null)
  const changeList = useCallback(() => {
    return props.changeList;
  }, [props.changeList]);

  useEffect(() => {
    if( inputField.current ) {
      const fieldContents = ReactDOM.findDOMNode(inputField.current);
      fieldContents.focus();
      fieldContents.select();
    }
  }, [showListNameInputField]);

  useEffect(() => {
    async function initLists() {
      if(isMounted.current) {
        const response = await fetch(BACKEND_URL + GET_LISTS_API );
        const rawAllLists = await response.json();

        if(props.currentListId !== undefined && !listsInitialized.current) {
          rawAllLists.some( list => {
            if( list.isDefault === 1 ) {
              setCurrentList(list);
              return true;
            }
            return false;
          })
          listsInitialized.current = true
        } else if(listsInitialized.current) {
          rawAllLists.some( list => {
            if( list.listId === props.currentListId ) {
              setCurrentList(list);
              return true;
            }
            return false;
          })
        }
        setAllLists(rawAllLists);


      } else {
        isMounted.current = true;
      }
    }
    initLists();
  }, [props.currentListId]);

  useEffect(() => {
    if( isMounted.current && currentList.listId !== undefined ) {
      changeList(currentList.listId)
    }
  }, [currentList, changeList]);

  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id !== currentList.listId) {
      otherLists.push(thisList);
    };
  });

  function handleListChange(eventKey) {
    if(eventKey === "addNewList") {
      setAddNewList(true);
      setShowListNameInputField(true);
    } else {
      props.changeList( +eventKey );
    }
  }

  function replaceButtonWithField(eventKey) {
    setShowListNameInputField(true);
  }

  function didBlurListName(eventKey, event) {
    setShowListNameInputField(false);
    setAddNewList(false);
  }

  function handleKeyPress(event, listId) {
    console.log(event.target.value, listId);
    if(event.key === "Enter" && addNewList ) {
      props.createNewList(event.target.value);
      didBlurListName();

    } else if(event.key === "Enter") {
      changeListName(event.target.value, listId);
      didBlurListName();
    }
    if(event.key === "Escape") {
      didBlurListName();
    }
  }

  async function createNewList(name) {
    console.log("create list", name);
  }

  async function changeListName( name, listId ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_list_name",
        list_id: listId,
        name: name,
         })
      };
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    let updatedList = currentList;
    updatedList.listName = name;
    await setCurrentList(updatedList);
  }

  return (
    <Dropdown as={ButtonGroup} onSelect={handleListChange} className="">
      {showListNameInputField ? (

            <Form.Control type="text"
              defaultValue={addNewList ? "New List" : currentList.listName}
              onBlur={didBlurListName}
              onKeyUp={event => handleKeyPress(event, currentList.listId)}
              ref={inputField}
               />

        ) : (
            <Button variant="primary" onClick={replaceButtonWithField} >{currentList.listName}</Button>
        )}

      <Dropdown.Toggle split variant="primary"></Dropdown.Toggle>
      <Dropdown.Menu>
        {allLists.map((list) =>
          <Dropdown.Item key={list.listId} eventKey={list.listId} >{list.listName}</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item key="addNewList" eventKey="addNewList" >New List</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ListSelector;
