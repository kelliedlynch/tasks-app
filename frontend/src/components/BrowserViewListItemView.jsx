import React, { useState, useEffect } from "react";
// import { FaEdit } from "react-icons/fa";

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

function BrowserViewListItemView({listData, setCurrentList}) {
  const [list, setList] = useState(listData);
  // const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    setList(listData);
  }, [listData])

  function switchList() {
    // console.log(list.listId);
    setCurrentList(list.listId);
  }

  return(
    <ListGroup.Item as="button" onClick={switchList} >

          {list.listName}

    </ListGroup.Item>
  );
}

export default BrowserViewListItemView;
