import React, {useState, useEffect} from "react";

import ListGroup from "react-bootstrap/ListGroup";
// import Button from "react-bootstrap/Button";

import BrowserViewListItemView from "./BrowserViewListItemView";

function BrowserView({ allLists, setCurrentList }) {
  const [lists, setLists] = useState(allLists);

  useEffect(() => {
    setLists(allLists);
  }, [allLists]);

  return (
    <>
    <div className="px-3 pt-3 pb-1">
      <h4 className="theme-base">All Lists</h4>
    </div>
    <ListGroup variant="flush">
      {Object.keys(lists).map( thisId => {
        return(<BrowserViewListItemView key={thisId} listData={lists[thisId]} setCurrentList={setCurrentList} />);
      })}
    </ListGroup>
    </>
  );
}

export default BrowserView;
