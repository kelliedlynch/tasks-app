
let backend = "";
switch(window.location.hostname) {
  case "localhost":
  case "127.0.0.1":
    backend = "http://127.0.0.1:5000/";
    break;
  case "kellielynch.org":
    backend = "https://kellielynch.org/wsgi-scripts/tasks.py/";
    break;
  case "kelliedlynch.github.io":
    backend = "https://tasks-app-backend-b4gpr763fq-uc.a.run.app/";
    break;
  default:
    backend = ""
}


export const BACKEND_URL = backend;
// export const BACKEND_URL = "https://kellielynch.org/wsgi-scripts/tasks.py/";
export const GET_API = "get-items";
export const GET_LISTS_API = "get-lists";
export const EDIT_ITEM_API = "edit-item-new";
export const EDIT_LIST_API = "edit-list";
export const DELETE_ITEM_API = "delete-item"

export const NEW_LIST_ID = -1;

// console.log("Utility loaded");

export function sortList( unsortedList ) {
  let incompleteItems = [];
  let completeItems = [];
  unsortedList.forEach( item => {
    if( item.completed === 0 ) {
      incompleteItems.push(item);
    } else {
      completeItems.push(item);
    };
  });
  incompleteItems.sort(function(a, b){return a["itemId"] - b["itemId"]});
  completeItems.sort(function(a, b){return a["itemId"] - b["itemId"]});
  return incompleteItems.concat(completeItems);
}

export const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');
