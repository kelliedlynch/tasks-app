import React, { useState, useEffect } from 'react';

import ListSelector from "./ListSelector";
import ChecklistBody from "./ChecklistBody";
import { BACKEND_URL, GET_LISTS_API  } from "./Utility";  



function App() {
  const [currentListId, setCurrentListId] = useState(undefined);
  // const [currentList, setCurrentList] = useState({ name: "Loading"});
  // const [currentListItems, setCurrentListItems] = useState([])
  // const [allLists, setAllLists] = useState([]);
  // const isMounted = useRef(false);

  console.log("App Loaded");


  useEffect(() => {
    async function initLists() {
      // if(isMounted.current && currentListId !== undefined) {
        console.log("getting default listId")
        const response = await fetch(BACKEND_URL + GET_LISTS_API );
        const rawAllLists = await response.json();
        // console.log("rawAllLists", rawAllLists)
        rawAllLists.some( list => {
          if( list.isDefault === 1 ) {
            // console.log("list is", list);
            // setCurrentList(list);
            setCurrentListId(list.listId);
            console.log("Current List ID found and set");
            return true;
          }
          return false;
        })
        // setAllLists(rawAllLists);
      // } else {
        // console.log("setting isMounted to true");
        // isMounted.current = true;
      // }
    }
    initLists();
  }, []);

  // useEffect(() => {
  //   if(isMounted.current) {
  //     console.log("loading currentList items");
  //     async function initListItems() {
  //       const response = await fetch(BACKEND_URL + GET_API + "/" + currentList.listId );
  //       const rawList = await response.json();
  //       // const sortedList = sortList( rawList );
  //       setCurrentListItems(rawList);
  //     }
  //     initListItems();
  //   } else {
  //     // console.log("currently false");
  //     isMounted.current = true;
  //   }
  // }, [currentList])

  function currentListWasChanged(listId) {
    console.log("currentListWasChanged");
    setCurrentListId(listId);
  }
  // async function updateCurrentList(newListData) {
  //   console.log("newListData", newListData);
  //   setCurrentList(newListData);
  // }



  return (
    <div className="container-sm">
      <ListSelector currentListId={currentListId} changeList={currentListWasChanged} />
      <ChecklistBody currentListId={currentListId} />
    </div>
  );
};

export default App;
