import React, {useState, useEffect} from "react";

import ListGroup from "react-bootstrap/ListGroup";

function AllListsView({allLists}) {
  const [lists, setLists] = useState(allLists);

  useEffect(() => {
    setLists(allLists);
  }, [allLists]);

  return (
    <>
    <ListGroup>
      {lists.map((list) => {
        return(<ListGroup.Item key={list.listId}>{list.listName}</ListGroup.Item>);
      })}
    </ListGroup>
    </>
  );
}

export default AllListsView;
