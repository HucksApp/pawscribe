import { createSlice } from '@reduxjs/toolkit';
import { getWithExpiry, setWithExpiry } from './cache';

const initialProjectState = {
  fx: {}, // Metadata about the project folder
  id: null,
  owner_id: null,
  foldername: '',
  created_at: null,
  updated_at: null,
  children: [], // Nested folders and files
};

const projectSlice = createSlice({
  name: 'project',
  initialState: initialProjectState,
  reducers: {
    setProject(state, action) {
      setWithExpiry('project', action.payload, 10800000); // 3-hour TTL
      return action.payload;
    },
    updateProject(state, action) {
      const { id, data } = action.payload;

      const updateTree = (tree, id, data) => {
        if (tree.id === id) {
          return { ...tree, ...data };
        }
        return {
          ...tree,
          children: tree.children.map(child => updateTree(child, id, data)),
        };
      };

      const newState = updateTree(state, id, data);
      setWithExpiry('project', newState, 10800000);
      return newState;
    },
    addChildToProject(state, action) {
      const { parentId, child } = action.payload;

      const addChild = (tree, parentId, child) => {
        if (tree.id === parentId) {
          return { ...tree, children: [...tree.children, child] };
        }
        return {
          ...tree,
          children: tree.children.map(subtree =>
            addChild(subtree, parentId, child)
          ),
        };
      };

      const newState = addChild(state, parentId, child);
      setWithExpiry('project', newState, 10800000);
      return newState;
    },
    removeChildFromProject(state, action) {
      const { parentId, childId } = action.payload;

      const removeChild = (tree, childId) => {
        if (tree.id === parentId) {
          return {
            ...tree,
            children: tree.children.filter(child => child.id !== childId),
          };
        }
        return {
          ...tree,
          children: tree.children.map(subtree => removeChild(subtree, childId)),
        };
      };

      const newState = removeChild(state, childId);
      setWithExpiry('project', newState, 10800000);
      return newState;
    },
    loadProjectFromCache(state) {
      const cachedProject = getWithExpiry('project');
      return cachedProject ? cachedProject : state;
    },
    clearProject() {
      return initialProjectState;
    },
  },
});

// Selector function to get the project from the state
export const selectProject = state => state.project;

export const {
  setProject,
  updateProject,
  addChildToProject,
  removeChildFromProject,
  loadProjectFromCache,
  clearProject,
} = projectSlice.actions;

export default projectSlice.reducer;
