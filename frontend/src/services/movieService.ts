import axios, { AxiosError } from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Region {
  code: string;
  name: string;
}

export const regions: Region[] = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('TMDB API Error Response:', axiosError.response.data);
      if (axiosError.response.data?.status_code === 7) {
        throw new Error('Invalid TMDB API key. Please provide a valid API key in your .env file');
      }
      throw new Error(`TMDB API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      console.error('TMDB API No Response:', axiosError.request);
      throw new Error('No response from TMDB API');
    }
  }
  console.error('Unexpected error:', error);
  throw error;
};

const movieService = {
  // Get newest releases by region
  getNewestMovies: async (region: string = 'IN') => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1,
          region,
        },
      });
      return response.data.results;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get top rated movies by region
  getTopRatedMovies: async (region: string = 'IN') => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1,
          region,
        },
      });
      return response.data.results;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (movieId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get movie images
  getMovieImages: async (movieId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
      });
      return response.data.results;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get movies by language
  getMoviesByLanguage: async (language: string, region: string = 'IN') => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          with_original_language: language,
          region,
          sort_by: 'popularity.desc',
        },
      });
      return response.data.results;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default movieService; 