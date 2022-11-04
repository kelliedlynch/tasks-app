import React, {useState, useEffect} from "react";

import ListGroup from "react-bootstrap/ListGroup";
// import Button from "react-bootstrap/Button";

import BrowserViewListItemView from "./BrowserViewListItemView";
import AddListFormView from "./AddListFormView";
import { BACKEND_URL, ADD_LIST_API } from "../Utility";

function BrowserView({ allLists, setCurrentList, didAddNewList }) {
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

  return (
    <>
    <div className="px-3 pt-3 pb-1">
      <h4 className="theme-base">All Lists</h4>
    </div>
    <ListGroup variant="flush">
      {Object.keys(lists).map( thisId => {
        return(<BrowserViewListItemView key={thisId} listData={lists[thisId]} setCurrentList={setCurrentList} />);
      })}
      <AddListFormView
        createNewList={createNewList}
      />
    </ListGroup>
    </>
  );
}

export default BrowserView;
