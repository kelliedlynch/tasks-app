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

  function didAddNewList() {
    initLists()
  }

  function didDeleteCurrentList() {
    initLists();
  }

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
      await response.json();

      let newLists = JSON.parse(JSON.stringify(allLists));
      newLists[listData.listId].listName = listData.listName;
      await setAllLists(newLists);
    }

  return (
    <>
    <AppHeaderView title="Tasks-App Demo" />
    <div className="d-flex h-100">
      <Collapse in={showLeftPanel} dimension="width">
        <div className="theme-bg-contrast-lt" id="leftPanel">
          <BrowserView
            allLists={allLists}
            currentListId={currentList}
            setCurrentList={didSetCurrentList}
            didAddNewList={didAddNewList}
          />
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
        <ChecklistView
          currentList={allLists[currentList]}
          didEditList={didEditList}
          didDeleteCurrentList={didDeleteCurrentList}
        />
      </div>
    </div>

    </>
  );
};

export default App;
