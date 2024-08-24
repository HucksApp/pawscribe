import React, { useState, forwardRef } from 'react';
import {
  IconButton,
  Divider,
  Box,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight, Add, Delete } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import clsx from 'clsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { unstable_useTreeItem2 as useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { useSelector } from 'react-redux';
import struct_format from '../utils/formatter';
import { selectProject } from '../store/projectSlice';
import PropTypes from 'prop-types';
import '../css/project.css';

const ITEMS = [
  {
    id: '1',
    label: 'Documents',
    fileType: 'folder',
    children: [
      {
        id: '1.1',
        label: 'Company',
        fileType: 'folder',
        children: [
          { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
          { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
          { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
          { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
          { id: '1.1.5', label: 'Video conference', fileType: 'video' },
        ],
      },
      { id: '1.2', label: 'Personal', fileType: 'folder' },
      { id: '1.3', label: 'Group photo', fileType: 'image' },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    fileType: 'folder',
    children: [
      { id: '2.1', label: 'Learning materials', fileType: 'folder' },
      { id: '2.2', label: 'News', fileType: 'folder' },
      { id: '2.3', label: 'Forums', fileType: 'folder' },
      { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
    ],
  },
  { id: '3', label: 'History', fileType: 'folder' },
  { id: '4', label: 'Trash', fileType: 'trash' },
];

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon':
      {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
      },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color:
      theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const StyledTreeItemLabelText = styled(Typography)({
  color: '#616161',
  fontFamily: 'Raleway',
  fontWeight: 1000,
  fontSize: 'small',
});

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: 'warning.main',
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: '1.2rem' }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">
        {children}
      </StyledTreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  );
}

const isExpandable = reactChildren => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};
const bgColor = theme => (theme == 'vs-dark' ? '#1E1E1E' : '#e5e5e5');

const getIconFromFileType = fileType => {
  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'pdf':
      return PictureAsPdfIcon;
    case 'doc':
      return ArticleIcon;
    case 'video':
      return VideoCameraBackIcon;
    case 'folder':
      return FolderRounded;
    case 'trash':
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, setEditorContent, label, disabled, children, ...other } =
    props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  const icon = getIconFromFileType(item.fileType);

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = event => {
    event.preventDefault();
    event.stopPropagation(); // Stop the event from bubbling up to parent elements
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            item,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleMenuClick = action => {
    console.log(`Action: ${action} on item: ${itemId}`);
    handleClose();
  };

  const handleClick = () => {
    // Call the setEditorContent function when the item is clicked
    console.log(item, '=====');
    setEditorContent('console');
    //setEditorContent(item.data ? item.data : 'None' /*item.content*/);
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot
        {...getRootProps(other)}
        onContextMenu={handleContextMenu}
      >
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
          onClick={handleClick}
        >
          <TreeItem2IconContainer
            onClick={() => console.log(itemId)}
            {...getIconContainerProps()}
          >
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: expandable && status.expanded,
            })}
          />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && (
          <TreeItem2GroupTransition {...getGroupTransitionProps()} />
        )}
      </StyledTreeItemRoot>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {expandable
          ? [
              <MenuItem
                key="addFile"
                onClick={() => handleMenuClick('addFile')}
              >
                Add File
              </MenuItem>,
              <MenuItem
                key="addScript"
                onClick={() => handleMenuClick('addScript')}
              >
                Add Script
              </MenuItem>,
              <MenuItem key="delete" onClick={() => handleMenuClick('delete')}>
                Delete
              </MenuItem>,
            ]
          : [
              <MenuItem key="edit" onClick={() => handleMenuClick('edit')}>
                Edit
              </MenuItem>,
              <MenuItem key="delete" onClick={() => handleMenuClick('delete')}>
                Delete
              </MenuItem>,
              <MenuItem
                key="changePrivacy"
                onClick={() => handleMenuClick('changePrivacy')}
              >
                Change Privacy
              </MenuItem>,
            ]}
      </Menu>
    </TreeItem2Provider>
  );
});

const ProjectDrawer = ({
  themeType,
  open,
  toggleDrawer,
  addFile,
  deleteFile,
  setEditorContent,
}) => {
  const theme = useTheme();
  const apiRef = useTreeViewApiRef();
  const project = useSelector(selectProject);
  console.log(project);
  console.log(struct_format(project));

  return (
    <div
      style={{ backgroundColor: bgColor(themeType) }}
      className={`persitantdrawer ${open && 'persitant_open'}`}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(1),
          borderRight: 'solid thin #e5e5e5',
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {theme.direction === 'ltr' ? (
            <ChevronLeft
              sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
            />
          ) : (
            <ChevronRight
              sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
            />
          )}
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, color: '#616161', fontWeight: 1000 }}
        >
          Project
        </Typography>
        <IconButton onClick={addFile}>
          <Add sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }} />
        </IconButton>
        <IconButton onClick={deleteFile}>
          <Delete sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }} />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          borderRight: 'solid thin #e5e5e5',
        }}
      >
        <RichTreeView
          items={ITEMS}
          apiRef={apiRef}
          defaultExpandedItems={['1', '1.1']}
          sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 240 }}
          slots={{
            item: props => (
              <CustomTreeItem {...props} setEditorContent={setEditorContent} />
            ),
          }}
          experimentalFeatures={{
            indentationAtItemLevel: true,
            itemsReordering: true,
          }}
          itemsReordering
          canMoveItemToNewPosition={params => {
            return (
              params.newPosition.parentId === null ||
              ['folder', 'trash'].includes(
                apiRef.current.getItem(params.newPosition.parentId).fileType
              )
            );
          }}
        />
      </Box>
    </div>
  );
};

CustomTreeItem.propTypes = {
  id: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  setEditorContent: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};

CustomLabel.propTypes = {
  icon: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

ProjectDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  addFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  themeType: PropTypes.string.isRequired,
  setEditorContent: PropTypes.func.isRequired,
};
export default ProjectDrawer;
