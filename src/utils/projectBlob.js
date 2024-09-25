import axios from 'axios';

const getFileContent = file => {
  let loading = false;
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  const fetchBlobContent = async (blob = false) => {
    try {
      loading = true;
      console.log('Fetching file from API');
      const response = await axios.get(
        `${base}/Api/v1/files/download/${file.fx.file_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      if (blob) return response.data;
      const textContent = await response.data.text(); // Convert blob to text
      return textContent; // Return the fetched content
    } catch (error) {
      console.error('Error fetching file content:', error);
      return 'Error fetching content';
    } finally {
      loading = false;
    }
  };

  return { fetchBlobContent, loading };
};

export default getFileContent;
