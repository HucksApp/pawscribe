import axios from 'axios';
import { Notify } from './Notification';
const base = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.getItem('jwt_token');

const apiFetch = (type, url, set, filter, state, navigate) => {
  if (!token) navigate('/');
  return async () => {
    try {
      const response = await axios[type](base + url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      set(response.data);
      filter(response.data);
      state(false);
    } catch (error) {
      console.log(error);
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg == 'Token has expired'
        )
          navigate('/');
        else
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
};

export default apiFetch;





catch (error) {
    console.log(error);
    if (error.response)
      if (
        error.response.data.msg &&
        error.response.data.msg == 'Token has expired'
      )
        navigate('/');
      else
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

