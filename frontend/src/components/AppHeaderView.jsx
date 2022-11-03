import React from "react";

function AppHeaderView({title}) {

  return (
    <header>
      <div className="navbar theme-bg-base">
        <h3 className="mx-4 my-2">{title}</h3>
      </div>
    </header>
  );

}

export default AppHeaderView;
