import React, { useState } from "react";
// import { FaEdit } from "react-icons/fa";

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

function ListsViewList({listData, setCurrentList}) {
  const [list, setList] = useState(listData);
  // const [showEditButton, setShowEditButton] = useState(false);

  console.log("ListsViewList", list.listId);

  function switchList() {
    // console.log(list.listId);
    setCurrentList(list.listId);
  }

  return(
    <ListGroup.Item as="a" onClick={switchList} >
      <Stack direction="horizontal">
        <div className="theme-content">
          {list.listName}
        </div>
{/*        <div className="list-edit-icon" hidden >
          <FaEdit/>
        </div>*/}
      </Stack>
    </ListGroup.Item>
  );
}

export default ListsViewList;
