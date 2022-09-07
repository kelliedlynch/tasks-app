import React, { useState, useEffect } from 'react';

import Button from "react-bootstrap/Button";

import { BACKEND_URL, EDIT_API } from "./Utility";

// console.log("ItemMenu loaded");

function ItemMenu(props) {
  const [itemMenuButtons, setItemMenuButtons] = useState([]);

  useEffect(() => {
    setItemMenuButtons([{
      variant: "light",
      text: "⋯"
    }]);
  }, []);

  async function deleteListItem() {
    console.log("item to be deleted", props.itemId )
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "delete_list_item",
        item_id: props.itemId,
      })
    }
    console.log("request looks like", requestOptions);
    await fetch(BACKEND_URL + EDIT_API, requestOptions);

    props.delete()
  }

  function editItem() {
    props.edit();
  }

  function showItemMenu() {
    setItemMenuButtons([{
      variant: "danger",
      text: "Delete",
      action: deleteListItem,
    },
    {
      variant: "primary",
      text: "Edit",
      action: editItem,
    }]);
  }

  function hideItemMenu() {
    setItemMenuButtons([{
      variant: "light",
      text: "⋯",
      action: showItemMenu,
    }]);
  }

  return (
       <div className="item-menu-button" onMouseEnter={showItemMenu} onMouseLeave={hideItemMenu}>
        {itemMenuButtons.map((button) =>
          <Button key={button.text} variant={button.variant} onClick={button.action}>{button.text}</Button>
        )}
      </div>
   );
}

export default ItemMenu;
