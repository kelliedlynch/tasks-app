import React, { useState, useEffect } from 'react';

import Button from "react-bootstrap/Button";

function ItemMenu(props) {
  const [itemMenuButtons, setItemMenuButtons] = useState([]);

  useEffect(() => {
    setItemMenuButtons([{
      variant: "light",
      text: "⋯"
    }]);
  }, []);

  function deleteItem() {
    props.deleteItem();
  }

  function editItem() {

  }

  function showItemMenu() {
    setItemMenuButtons([{
      variant: "danger",
      text: "Delete",
      action: deleteItem,
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
