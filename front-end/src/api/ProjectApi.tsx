import axios from "axios";
import { Project } from "../types/Project";

const BASE_URL = "http://10.10.23.98:3001/api/v1/projects";

/**
 * GET all projects from API
 */
export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    console.log("Fetched projects:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (project: {
  title: string;
  description: string;
  status: string;
  userId: number[];
}) => {
  const endpointName = "post_api_v1_projects";
  try {
    console.log(`Calling API: ${endpointName}`);
    const response = await axios.post(BASE_URL, project, {
      headers: {
        "X-Endpoint-Name": endpointName,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${endpointName}:`, error);
    throw error;
  }
};

export const updateProject = async (project: Project) => {
  try {
    const response = await fetch(`${BASE_URL}/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to update project");
  }
};

export const deleteProject = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error deleting project.",
    };
  }
};
