import React, { useState, useEffect } from 'react';

import ListSelector from "./ListSelector";
import ChecklistBody from "./ChecklistBody";
import { BACKEND_URL, GET_LISTS_API, EDIT_LIST_API  } from "./Utility";  



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

  useEffect(() => {

  }, [currentListId]);

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

  async function createNewList(name) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "create_new_list",
        list_name: name,
      }),
    }

    const response = await fetch(BACKEND_URL + EDIT_LIST_API, requestOptions);
    const content = await response.json();
    // let newList = {
    //   listId: content.list_id,
    //   listName: name,
    // }
    setCurrentListId(content.list_id);
  }


  // async function addListItem( item ) {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       do: "add_list_item",
  //       name: item.name,
  //       list_id: item.id })
  //   }
  //   console.log("request looks like", requestOptions);
  //   const response = await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);
  //   const content = await response.json();
  //   item.item_id = content.item_id;
  //   item.completed = 0;
  //   setListItems(sortList([...listItems, item]));
  // }


  return (
    <div className="container-sm">
      <ListSelector currentListId={currentListId} changeList={currentListWasChanged} createNewList={createNewList} />
      <ChecklistBody currentListId={currentListId} />
    </div>
  );
};

export default App;
