const struct_format = (obj, parentPath = '', index = 1) => {
  const ui = { ...obj };

  // Generate the id based on the parent's path and the current index
  const currentId = String(index); // Ensure the ID is a string
  ui.id = parentPath ? `${parentPath}.${currentId}` : currentId;

  // Set label from obj.fx.name if fx exists, otherwise from foldername or filename
  ui.label =
    obj.fx && obj.fx.name ? obj.fx.name : obj.foldername || obj.filename;

  // Set fileType from obj.fx.type if fx exists, otherwise use fileType directly or null
  ui.fileType =
    obj.fx && obj.fx.type ? obj.fx.type.toLowerCase() : obj.fileType || null;

  // If the object is a folder and contains children, recursively format the children
  if (obj.children && obj.children.length > 0) {
    // Map over the children and recursively call struct_format with the updated parent path and index
    ui.children = obj.children.map((child, childIndex) =>
      struct_format(child, ui.id, childIndex + 1)
    );
  }

  return ui;
};

export const getAllExpandableItems = items => {
  let expandableItems = [];

  const traverse = item => {
    if (item.children && item.children.length > 0) {
      expandableItems.push(item.id); // Add expandable item
      item.children.forEach(traverse); // Recursively traverse children
    }
  };

  items.forEach(traverse); // Start traversing from the root items
  return expandableItems;
};

export default struct_format;
