import React, { useState, useEffect } from 'react';

import ListSelector from "./ListSelector";
import ChecklistBody from "./ChecklistBody";
import { BACKEND_URL, GET_LISTS_API, EDIT_LIST_API  } from "./Utility";  



function App() {
  const [currentListId, setCurrentListId] = useState(undefined);

  useEffect(() => {
    async function initLists() {
        const response = await fetch(BACKEND_URL + GET_LISTS_API );
        const rawAllLists = await response.json();
        rawAllLists.some( list => {
          if( list.isDefault === 1 ) {
            setCurrentListId(list.listId);
            return true;
          }
          return false;
        })
    }
    initLists();
  }, []);


  function currentListWasChanged(listId) {
    setCurrentListId(listId);
  }

  async function createNewList(listName) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "create_new_list",
        list_name: listName,
      }),
    }

    const response = await fetch(BACKEND_URL + EDIT_LIST_API, requestOptions);
    const content = await response.json();
    setCurrentListId(content.list_id);
  }

  return (
    <div className="container-sm">
      <ListSelector currentListId={currentListId} changeList={currentListWasChanged} createNewList={createNewList} />
      <ChecklistBody currentListId={currentListId} />
    </div>
  );
};

export default App;
