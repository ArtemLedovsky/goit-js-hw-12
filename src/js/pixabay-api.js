import axios from 'axios';

export async function searchImagesProcess(inputQuery, page) {
  const URL = 'https://pixabay.com/api/';
  const KEY = '45377125-53da1a565bd8b37af868a9bcd';
  try {
    const response = await axios.get(URL, {
      params: {
        key: KEY,
        q: inputQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });
    return response.data;
  } catch {
    error => {
      iziToast.error({
        position: 'topRight',
        message: `${error.message}`,
      });
    };
  }
}
