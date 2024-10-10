import axios from 'axios';
import { GITLAB_URL, GITLAB_TOKEN } from './config.js';

const axiosInstance = axios.create({
  baseURL: GITLAB_URL,
  headers: {
    'Private-Token': GITLAB_TOKEN,
  },
  proxy: false,
});

export async function fetchProjects() {
  try {
    const response = await axiosInstance.get(`/projects`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении проектов:', error.message);
    return [];
  }
}

export async function fetchAuthors(projectId) {
  try {
    const response = await axiosInstance.get(
      `/projects/${projectId}/members/all`,
      {
        params: { 
          per_page: 100,
        },
      }
    );

    const sortedAuthors = response.data.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return sortedAuthors;
  } catch (error) {
    console.error('Ошибка при получении авторов:', error.message);
    return [];
  }
}

export async function fetchMergeRequests(
  projectId,
  startDate,
  endDate,
  authorUsername
) {
  try {
    const response = await axiosInstance.get(
      `/projects/${projectId}/merge_requests`,
      {
        params: {
          state: 'merged',
          updated_after: startDate.toISOString(),
          updated_before: endDate.toISOString(),
          author_username: authorUsername,
          order_by: 'updated_at',
          sort: 'asc',
          per_page: 1000,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении MR:', error.message);
    return [];
  }
}
