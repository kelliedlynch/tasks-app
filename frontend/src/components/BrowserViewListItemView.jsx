import React, { useState, useEffect } from "react";
// import { FaEdit } from "react-icons/fa";

import Button from "react-bootstrap/Button";


function BrowserViewListItemView({listData, isCurrentList, setCurrentList}) {
  const [list, setList] = useState(listData);
  // const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    setList(listData);
  }, [listData])

  function switchList() {
    // console.log(list.listId);
    setCurrentList(list.listId);
  }

  console.log("isCurrentList", isCurrentList);

  return(
    // <ListGroup.Item
    //   as="Button"
    //   onClick={switchList}
    //   variant="listbrowser"
    //   // className={"browser-item " + (isCurrentList ? "current-list" : "")}
    // >
    //       {list.listName}
    // </ListGroup.Item>
    <Button
      variant="listbrowser"
      onClick={switchList}
      className={isCurrentList ? " current-list": ""}
    >
      {list.listName}
    </Button>
  );
}

export default BrowserViewListItemView;
