const struct_format = obj => {
  const ui = { ...obj };

  // Set label from obj.fx.name if fx exists, otherwise from obj.foldername
  ui.label = obj.fx && obj.fx.name ? obj.fx.name : obj.foldername;

  // Set fileType from obj.fx.type if fx exists, otherwise set it to null
  ui.fileType = obj.fx && obj.fx.type ? obj.fx.type : null;

  // Check for children and apply recursion if children exist
  if (obj.children && obj.children.length > 0) {
    ui.children = obj.children.map(child => struct_format(child));
  }

  console.log(ui); // For debugging purposes, you can remove this later
  return ui;
};

export default struct_format;
