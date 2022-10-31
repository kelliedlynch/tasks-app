import React, { useState, useEffect } from 'react';

import Button from "react-bootstrap/Button";

import { BACKEND_URL, EDIT_ITEM_API } from "../Utility";

// console.log("ItemMenu loaded");

function ItemEditMenu(props) {
  const [itemMenuButtons, setItemMenuButtons] = useState([]);

  useEffect(() => {
    setItemMenuButtons([{
      variant: "light",
      text: "⋯"
    }]);
  }, []);

  async function deleteListItem() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        do: "delete_list_item",
        item_id: props.itemId,
      })
    }
    await fetch(BACKEND_URL + EDIT_ITEM_API, requestOptions);

    props.didChangeList()
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
       <div className="item-menu-button ms-auto" onMouseEnter={showItemMenu} onMouseLeave={hideItemMenu}>
        {itemMenuButtons.map((button) =>
          <Button key={button.text} variant={button.variant} onClick={button.action}>{button.text}</Button>
        )}
      </div>
   );
}

export default ItemEditMenu;
