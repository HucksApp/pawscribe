/**
 * Dashboard Component
 *
 * The `Dashboard` component serves as the main user interface where users can view and manage files, folders, and texts.
 * It dynamically displays a list of files, texts, and folders while handling empty states by showing a "No Content" message.
 *
 * The component integrates with the Redux store to fetch data for files, texts, and folders and updates the view accordingly when the content changes.
 *
 * Main features:
 * - Displays an `Appbar` component for search functionality.
 * - Conditionally renders `FileList`, `TextList`, and `FolderList` components if there is content.
 * - Shows a `NoContent` message when no folders, files, or texts exist in the state.
 * - Includes a `Footer` component for consistent UI design.
 *
 * Props:
 * - `stateChanged`: A boolean flag indicating whether the state of the application has changed, triggering the re-fetch of data.
 * - `setStateChange`: A function that resets the `stateChanged` flag to control re-rendering after content updates.
 *
 * State:
 * - `searchValue`: A string that holds the current input from the search bar used to filter the displayed content.
 *
 * Hooks:
 * - `useEffect`: Monitors changes in the `texts`, `files`, and `folders` from the Redux store and resets `stateChanged` when content changes.
 *
 * Dependencies:
 * - `useSelector`: Used to access Redux state for files, texts, and folders.
 * - PropTypes for runtime validation of props.
 *
 * Example usage:
 * ```jsx
 * <Dashboard stateChanged={true} setStateChange={handleStateChange} />
 * ```
 *
 * Custom Components Used:
 * - `Appbar`: Displays the top navigation bar with the search field.
 * - `FileList`: Displays a list of files matching the search input.
 * - `TextList`: Displays a list of text documents matching the search input.
 * - `FolderList`: Displays a list of folders matching the search input.
 * - `NoContent`: Shows a message when no files, texts, or folders are available.
 * - `Footer`: Adds a footer section to the dashboard for UI consistency.
 *
 * @module Dashboard
 */

import React, { useState, useEffect } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import TextList from './TextList';
import Footer from './Footer';
import NoContent from './NoContent';
import PropTypes from 'prop-types';
import FolderList from './FolderList';
import { useSelector } from 'react-redux';
import '../css/dashboard.css';

const Dashboard = ({ stateChanged, setStateChange }) => {
  // State to store the current search value from the search bar
  const [searchValue, setSearchValue] = useState('');

  // Accessing files, texts, and folders from the Redux store using useSelector
  const texts = useSelector(state => state.texts);
  const files = useSelector(state => state.files);
  const folders = useSelector(state => state.folders);

  // Effect hook to handle changes in texts, files, and folders
  // If content changes, reset the stateChanged flag using setStateChange
  useEffect(() => {
    if (stateChanged) {
      setStateChange(false); // Reset the state change flag after re-render
    }
  }, [texts, files, folders, stateChanged, setStateChange]);

  // Check if all content (files, texts, and folders) is empty
  const isEmptyContent = [files, texts, folders].every(
    list => Array.isArray(list) && list.length === 0
  );

  return (
    <div className="dashboard">
      {/* Appbar component with a search bar, passing setSearchValue to update search state */}
      <Appbar setSearchValue={setSearchValue} />

      {/* Conditional rendering based on whether there is any content */}
      {isEmptyContent ? (
        <NoContent msg={'No Folder, Files, or script present'} />
      ) : (
        <>
          {/* Render FileList with search and state management props */}
          <FileList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
          {/* Render TextList with search and state management props */}
          <TextList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
          {/* Render FolderList with search and state management props */}
          <FolderList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
        </>
      )}

      {/* Footer component for UI consistency */}
      <Footer />
    </div>
  );
};

// PropTypes validation for the component's props
Dashboard.propTypes = {
  stateChanged: PropTypes.bool.isRequired, // Prop to check if the state has changed
  setStateChange: PropTypes.func.isRequired, // Function to reset the state change flag
};

export default Dashboard;
