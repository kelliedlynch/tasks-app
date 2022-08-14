import React, { useState, useEffect, useRef } from 'react';

import ListSelector from "./ListSelector";
import ChecklistBody from "./ChecklistBody";

const BACKEND_URL = "http://localhost:5000/";
const GET_API = "get-items";
const GET_LISTS_API = "get-lists";
const EDIT_API = "edit"


function App() {
  const [currentListId, setCurrentListId] = useState(0);

  function currentListWasChanged(listId) {
    setCurrentListId(listId);
  }
  // async function updateCurrentList(newListData) {
  //   console.log("newListData", newListData);
  //   setCurrentList(newListData);
  // }



  return (
    <div className="container-sm">
      <ListSelector currentListId={currentListId} changeList={currentListWasChanged} />
      <ChecklistBody currentListId={currentListId} changeList={currentListWasChanged} />
    </div>
  );
};

export default App;
