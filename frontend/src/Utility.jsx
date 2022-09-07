export const BACKEND_URL = "http://localhost:5001/";
export const GET_API = "get-items";
export const GET_LISTS_API = "get-lists";
export const EDIT_API = "edit"

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
  incompleteItems.sort(function(a, b){return a["item_id"] - b["item_id"]});
  completeItems.sort(function(a, b){return a["item_id"] - b["item_id"]});
  return incompleteItems.concat(completeItems);
}

