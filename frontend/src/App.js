import React, { useState, useEffect, useCallback } from 'react';


import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";

// import ListSelector from "./components/ListSelector";
// import ChecklistBody from "./components/ChecklistBody";
import ChecklistView from"./components/ChecklistView";
import AppHeader from "./components/AppHeader";
import AllListsView from "./components/AllListsView";
import { BACKEND_URL, GET_LISTS_API, EDIT_LIST_API  } from "./Utility";  



function App() {
  const [currentList, setCurrentList] = useState({listId: undefined, listName: "Loading", items: []});
  const [allLists, setAllLists] = useState([]);
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  const initLists = useCallback(async () => {
    const response = await fetch(BACKEND_URL + GET_LISTS_API );
    const rawAllLists = await response.json();
    await setAllLists(rawAllLists);
    rawAllLists.some( list => {
      if( list.isDefault === 1 ) {
        list.items=[];
        console.log("initializing list",  list);
        setCurrentList(list);
        return true;
      }
      return false;
    });
    // console.log(allLists);
  }, []);

  useEffect(() => {
    initLists();
  }, [initLists]);

  function didSetCurrentList(listId) {
    allLists.some(list => {
      if(list.listId === listId) {
        console.log("setting currentList");
        setCurrentList(list);
        return true;
      }
      return false;
    });
  }

  // function didChangeList(listId) {
  //   if(listId < 0) {
  //     initLists();
  //   } else {
  //     setCurrentListId(listId);
  //   }
  // }

  // async function createNewList(listName) {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       do: "create_new_list",
  //       list_name: listName,
  //     }),
  //   }

  //   const response = await fetch(BACKEND_URL + EDIT_LIST_API, requestOptions);
  //   const content = await response.json();
  //   setCurrentListId(content.list_id);
  // }

  return (
    <>
    <AppHeader title="ToDo List Demo" />
    <div className="d-flex">
      <Collapse in={showLeftPanel} dimension="width">
        <div className="theme-bg-contrast-lt" id="leftPanel">
          <AllListsView allLists={allLists} setCurrentList={didSetCurrentList} />
        </div>
      </Collapse>
      <div className="theme-bg-contrast-lt">
        <Button variant="light" onClick={() => setShowLeftPanel(!showLeftPanel)} aria-controls="leftPanel" aria-expanded={showLeftPanel}>{showLeftPanel ? "«" : "»"}</Button>
      </div>
      <div className="flex-fill px-3">
        <ChecklistView currentList={currentList} />
      </div>
    </div>

    </>
  );
};

export default App;
