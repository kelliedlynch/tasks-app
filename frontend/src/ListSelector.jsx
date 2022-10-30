import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import NavBar from "react-bootstrap/NavBar";
import Stack from "react-bootstrap/Stack";

import { BACKEND_URL, EDIT_ITEM_API, GET_LISTS_API } from "./Utility";
import ListEditMenu from "./ListEditMenu";

// console.log("ListSelector loaded");

function ListSelector( props ) {
  const [showListNameInputField, setShowListNameInputField] = useState(false);
  const [addingNewList, setAddingNewList] = useState(false);
  const [currentList, setCurrentList] = useState({ listName: "Loading"});
  const [allLists, setAllLists] = useState([]);
  const isMounted = useRef(false);
  const listsInitialized = useRef(false);

  const inputField = useRef(null)

  useEffect(() => {
    if( inputField.current ) {
      const fieldContents = ReactDOM.findDOMNode(inputField.current);
      fieldContents.focus();
      fieldContents.select();
    }
  }, [showListNameInputField]);

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

  useEffect(() => {
    initLists();
  }, [props.currentListId]);

  // useEffect(() => {
  //   if( isMounted.current && currentList.listId !== undefined ) {
  //     console.log("didChangeList triggered from local state change")
  //     didChangeList(currentList.listId)
  //   }
  // }, [currentList, didChangeList]);

  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id !== currentList.listId) {
      otherLists.push(thisList);
    };
  });

  function handleListChange(eventKey) {
    if(eventKey === "addingNewList") {
      setAddingNewList(true);
      setShowListNameInputField(true);
    } else {
      props.didChangeList( +eventKey );
    }
  }

  function replaceButtonWithField(eventKey) {
    setShowListNameInputField(true);
  }

  function didBlurListName() {
    setShowListNameInputField(false);
    setAddingNewList(false);
  }

  function handleKeyPress(event, listId) {
    if(event.key === "Enter" && addingNewList ) {
      props.createNewList(event.target.value);
      didBlurListName();

    } else if(event.key === "Enter") {
      didBlurListName();
      if(event.target.value !== currentList.listName) { 
        changeListName(event.target.value, listId);
      }
    }
    if(event.key === "Escape") {
      didBlurListName();
    }
  }

  async function changeListName( listName, listId ) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "update_list_name",
        list_id: listId,
        list_name: listName,
         })
      };
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
    let updatedList = {...currentList};
    updatedList.listName = listName;
    await setCurrentList(updatedList);
    initLists();
  }

  return (
    <Stack direction="horizontal" gap={3}>
      <Dropdown as={ButtonGroup} onSelect={handleListChange} className="">
        {showListNameInputField ? (

              <Form.Control type="text"
                defaultValue={addingNewList ? "New List" : currentList.listName}
                onBlur={didBlurListName}
                onKeyUp={event => handleKeyPress(event, currentList.listId)}
                ref={inputField}
                 />

          ) : (
              <h2 onClick={replaceButtonWithField} >{currentList.listName}</h2>
          )}

        <Dropdown.Toggle split as={NavBar.Toggle}></Dropdown.Toggle>
        <Dropdown.Menu>
          {allLists.map((list) =>
            <Dropdown.Item key={list.listId} eventKey={list.listId} >{list.listName}</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item key="addingNewList" eventKey="addingNewList" >New List</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ListEditMenu list={currentList} edit={replaceButtonWithField} didChangeList={props.didChangeList} />
    </Stack>
  );
}

export default ListSelector;
