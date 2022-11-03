import React, { useState, useEffect, useCallback } from 'react';


import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

import { MdDoubleArrow } from "react-icons/md";

import ChecklistView from"./components/ChecklistView";
import AppHeaderView from "./components/AppHeaderView";
import BrowserView from "./components/BrowserView";
import { BACKEND_URL, GET_LISTS_API, EDIT_LIST_API  } from "./Utility";  



function App() {
  const [currentList, setCurrentList] = useState(0);
  const [allLists, setAllLists] = useState([{ 0: { "listId": 0, "listName": "Loading", "isDefault": 1 }}]);
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  const initLists = useCallback(async () => {
    const response = await fetch(BACKEND_URL + GET_LISTS_API );
    const rawAllLists = await response.json();
    let listDict = {};
    for(const list of rawAllLists) {
      // console.log("list in rawAllLists", list);
      listDict[list.listId] = list;
      if(list.isDefault === 1) {
        setCurrentList(list.listId);
      }
    }
    // console.log("listDict", listDict, "rawAllLists", rawAllLists);
    await setAllLists(listDict);

  }, []);

  useEffect(() => {
    initLists();
  }, [initLists]);

  // function updateLocalList(listData) {
  //   let newAllLists = allLists;
  //   newAllLists.some( list => {
  //     if(list.listId === listData.id) {
  //       list = listData;
  //     }
  //     return false;
  //   })
  // }

  function didSetCurrentList(listId) {
    setCurrentList(listId);
  }

  async function didEditList(listData) {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          do: "edit_list",
          list_id: listData.listId,
          list_name: listData.listName
        }),
      }

      const response = await fetch(BACKEND_URL + EDIT_LIST_API, requestOptions);
      const content = await response.json();

      let newLists = JSON.parse(JSON.stringify(allLists));
      newLists[listData.listId].listName = listData.listName;
      await setAllLists(newLists);
    }

    // console.log(allLists[currentList]);
    // let foo = allLists[currentList];

  return (
    <>
    <AppHeaderView title="ToDo List Demo" />
    <div className="d-flex">
      <Collapse in={showLeftPanel} dimension="width">
        <div className="theme-bg-contrast-lt" id="leftPanel">
          <BrowserView allLists={allLists} setCurrentList={didSetCurrentList} />
        </div>
      </Collapse>
      <div className="panel-preview"></div>
      <div className="">
        <Button
          className="panel-open-button"
          variant="light"
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          aria-controls="leftPanel"
          aria-expanded={showLeftPanel}>
            <MdDoubleArrow className={"" + (showLeftPanel ? "arrow-point-left" : "arrow-point-right")} />
        </Button>
      </div>
      <div className="flex-fill px-3">
        <ChecklistView currentList={allLists[currentList]} didEditList={didEditList} />
      </div>
    </div>

    </>
  );
};

export default App;
