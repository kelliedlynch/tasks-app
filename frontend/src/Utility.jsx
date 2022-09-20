export const BACKEND_URL = "http://localhost:5001/";
export const GET_API = "get-items";
export const GET_LISTS_API = "get-lists";
export const EDIT_ITEM_API = "edit-item";
export const EDIT_LIST_API = "edit-list"

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

