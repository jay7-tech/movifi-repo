import axios, { AxiosError } from 'axios';
import apiClient from './apiConfig';

export interface BackendMovie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
}

const handleApiError = (error: unknown, operation: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(`Backend API Error (${operation}):`, axiosError.response.data);
      throw new Error(`Backend API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      console.error(`Backend API No Response (${operation}):`, axiosError.request);
      throw new Error('No response from backend API. Is the server running?');
    }
  }
  console.error(`Unexpected error during ${operation}:`, error);
  throw error;
};

export const backendMovieService = {
  async getMovies(): Promise<BackendMovie[]> {
    try {
      const response = await apiClient.get('/movies');
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },

  async getMovieById(id: string): Promise<BackendMovie | null> {
    try {
      const response = await apiClient.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  },

  async createMovie(movieData: BackendMovie): Promise<BackendMovie | null> {
    try {
      const response = await apiClient.post('/movies', movieData);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      return null;
    }
  },

  async updateMovie(id: string, movieData: Partial<BackendMovie>): Promise<BackendMovie | null> {
    try {
      const response = await apiClient.put(`/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error('Error updating movie:', error);
      return null;
    }
  },

  deleteMovie: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/movies/${id}`);
    } catch (error) {
      handleApiError(error, 'deleteMovie');
    }
  },
};

export default backendMovieService; 