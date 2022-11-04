import React, {useState, useEffect} from "react";

import ListGroup from "react-bootstrap/ListGroup";
// import Button from "react-bootstrap/Button";

import BrowserViewListItemView from "./BrowserViewListItemView";
import AddListFormView from "./AddListFormView";
import { BACKEND_URL, ADD_LIST_API } from "../Utility";

function BrowserView({ allLists, currentListId, setCurrentList, didAddNewList }) {
  const [lists, setLists] = useState(allLists);

  useEffect(() => {
    setLists(allLists);
  }, [allLists]);

  async function createNewList(listName) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        list_name: listName
      })
    }
    await fetch(BACKEND_URL + ADD_LIST_API, requestOptions);
    didAddNewList();
  }

  console.log("currentListId", currentListId)

  return (
    <>
    <div className="listbrowser">
      <h4 className="theme-accent listbrowser">All Lists</h4>
    </div>
    <ListGroup variant="flush" className="">
      {Object.keys(lists).map( thisId => {
        return(
          <BrowserViewListItemView
            key={thisId}
            listData={lists[thisId]}
            isCurrentList={parseInt(thisId) === currentListId}
            setCurrentList={setCurrentList}
          />);
      })}
      <AddListFormView
        createNewList={createNewList}
      />
    </ListGroup>
    </>
  );
}

export default BrowserView;
