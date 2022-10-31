import React from "react";

function AppHeader({title}) {

  return (
    <header>
      <div className="navbar bg-theme-primary">
        <h4 className="mx-4 my-2">{title}</h4>
      </div>
    </header>
  );

}

export default AppHeader;
