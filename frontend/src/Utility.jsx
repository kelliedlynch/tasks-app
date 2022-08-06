function sortList( unsortedList ) {
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

export default sortList;
