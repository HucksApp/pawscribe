import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import AddProject from './AddProject';
import { Notify } from '../utils/Notification';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import NoContent from './NoContent';
import { useNavigate } from 'react-router-dom';
import FolderStats from './FolderStat';
import ProjectView from './ProjectView';
import { useSelector, useDispatch } from 'react-redux';
import { setProjects } from '../store/projectSlice';
import { clearUser } from '../store/userSlice';

const ProjectList = ({ searchValue, stateChanged, setStateChange }) => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const projects = useSelector(state => state.projects);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!token) navigate('/');

  const fetchProjects = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/projects/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      dispatch(
        setProjects(
          [...response.data].sort((a, b) =>
            a.foldername.localeCompare(b.foldername)
          )
        )
      );
      setFilteredProjects(
        [...response.data].sort((a, b) =>
          a.foldername.localeCompare(b.foldername)
        )
      );
      setStateChange(false);
    } catch (error) {
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg === 'Token has expired'
        ) {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
        } else
          Notify({
            message: `${error.message}. ${error.response.data.message} `,
            type: 'error',
          });
      else
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [stateChanged]);

  useEffect(() => {
    if (searchValue) {
      setFilteredProjects(
        [...projects]
          .filter(project =>
            project.foldername.toLowerCase().includes(searchValue.toLowerCase())
          )
          .sort((a, b) => a.foldername.localeCompare(b.foldername))
      );
    } else {
      setFilteredProjects(projects);
    }
  }, [searchValue]);
  if (!projects.length && pathname === '/projects')
    return (
      <Container sx={{ overflow: 'scroll' }}>
        <AddProject setStateChange={setStateChange} />
        <NoContent msg="No Project is Present" />
      </Container>
    );
  else if (!projects.length) return null;

  return (
    <Container>
      {projects && <FolderStats type="PROJECTS" folders={filteredProjects} />}
      <Grid container spacing={3}>
        <AnimatePresence>
          <AddProject setStateChange={setStateChange} />
          {filteredProjects.map(project => (
            <Grid item key={project.id} xs={8} sm={4} md={2}>
              <ProjectView
                project={project}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Container>
  );
};

ProjectList.propTypes = {
  searchValue: PropTypes.string.isRequired,
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default ProjectList;
