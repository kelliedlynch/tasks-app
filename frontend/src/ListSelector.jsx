import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

import { BACKEND_URL, EDIT_API, GET_LISTS_API } from "./Utility";

// console.log("ListSelector loaded");

function ListSelector( props ) {
  const [editName, setEditName] = useState(false);
  const [addNewList, setAddNewList] = useState(false);
  const [currentList, setCurrentList] = useState({ name: "Loading"});
  const [allLists, setAllLists] = useState([]);
  const isMounted = useRef(false);
  const listsInitialized = useRef(false);

  const inputField = useRef()
  const changeList = useCallback(() => {
    return props.changeList;
  }, [props.changeList]);
  // const changeList = props.changeList;
  // const currentListId = props.currentListId;

  useEffect(() => {
    async function initLists() {
      console.log("initLists in ListSelector", isMounted.current, props.currentListId)
      if(isMounted.current && props.currentListId !== undefined && !listsInitialized.current) {
        const response = await fetch(BACKEND_URL + GET_LISTS_API );
        const rawAllLists = await response.json();
        rawAllLists.some( list => {
          if( list.isDefault === 1 ) {
            console.log("list is", list);
            setCurrentList(list);
            return true;
          }
          return false;
        })
        await setAllLists(rawAllLists);
        listsInitialized.current = true
      } else if(isMounted.current && listsInitialized.current) {
        console.log("now we are changing lists")
        allLists.some( list => {
          if( list.listId === props.currentListId ) {
            setCurrentList(list);
            return true;
          }
          return false;
        })
      } else {
        // console.log("setting isMounted to true");
        isMounted.current = true;
      }
    }
    initLists();
  }, [props.currentListId]);

  useEffect(() => {
    console.log("isMounted, props.currentListId", isMounted.current, currentList.listId);
    if( isMounted.current && currentList.listId !== undefined ) {
      console.log("useEffect calls changeList");
      changeList(currentList.listId)
    }
  }, [currentList, changeList]);

  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id !== currentList.listId) {
      otherLists.push(thisList);
    };
  });

  // let editName = false;

  function handleListChange(eventKey) {
    if(eventKey === "addNewList") {
      console.log("add new list")
    }
    // console.log(eventKey);
    console.log("handleListChange");
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

  // function changeList( id ) {
  //   console.log("inside changeList");
  //   allLists.some( thisList => {
  //     // console.log(id, thisList.id);
  //     if( id === thisList.id ) {
  //       setCurrentList(thisList);
  //       return true;
  //     }
  //     return false;
  //   });
  // }

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
    await fetch(BACKEND_URL + EDIT_API, requestOptions);
    let updatedList = currentList;
    updatedList.listName = name;
    await setCurrentList(updatedList);
    // await props.changeList(updatedList);
    setEditName(false);

  }

  return (
    <Dropdown as={ButtonGroup} onSelect={handleListChange} className="">
      {editName ? (

            <Form.Control type="text"
              defaultValue={addNewList ? "New List" : currentList.listName}
              onBlur={unfocusListName}
              autoFocus
              onFocus={e => e.currentTarget.select()}
              onKeyUp={event => handleKeyPress(event, currentList.listId)}
              ref={inputField}
               />

        ) : (
            <Button variant="primary" onClick={focusListName} >{currentList.listName}</Button>
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
