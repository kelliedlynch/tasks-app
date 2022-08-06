import React, { useState, useEffect, useRef } from 'react';

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import ChecklistBody from "./ChecklistBody";


const BACKEND_URL = "http://localhost:5000/";
const GET_API = "get-items";
const GET_LISTS_API = "get-lists";
const EDIT_API = "edit-item"


function App() {


  const [currentList, setCurrentList] = useState({ name: "Loading"});
  //
  const [allLists, setAllLists] = useState([]);

  useEffect(() => {
    async function initLists() {
      const response = await fetch(BACKEND_URL + GET_LISTS_API );
      const rawAllLists = await response.json();
      rawAllLists.some( list => {
        if( list.default === 1 ) {
          console.log("list is", list);
          setCurrentList( list );
          return true;
        }
        return false;
      })
      setAllLists(rawAllLists);
    }
    initLists();
  }, []);

  function changeList( id ) {
    console.log("inside changeList");
    allLists.some( thisList => {
      console.log(typeof id, typeof thisList.id);
      if( id === thisList.id ) {
        setCurrentList(thisList);
        return true;
      }
      return false;
    });
  }



  let otherLists = []
  allLists.forEach(thisList => {
    if(thisList.id !== currentList.id) {
      otherLists.push(thisList);
    };
  });

  return (
    <div className="container-sm">
      <ListSelector lists={otherLists} currentList={currentList} changeList={changeList} />
      <ChecklistBody currentList={currentList} />
    </div>
  );
};


function ListSelector( props ) {
  function handleListChange(key) {
    console.log("key is", key);
    props.changeList( +key );
  }

  return (
    <Dropdown>
      <DropdownButton id="dropdown-basic-button" size="lg" title={props.currentList.name} onSelect={handleListChange}>
        {props.lists.map((list) =>
          <Dropdown.Item key={list.id} eventKey={list.id} >{list.name}</Dropdown.Item>
        )}
      </DropdownButton>
    </Dropdown>
  );
}








export default App;
