import axios from "axios";

const BASE_URL = "http://10.10.23.98:3001/api/v1/users";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getAllUsers = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.get(BASE_URL);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.log("Error fetching users:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch users",
    };
  }
};

export const createUser = async (user: {
  name: string;
  email: string;
  age: number;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(BASE_URL, user);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.log("Error creating user:", error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || "Failed to create user",
    };
  }
};

export const updateUser = async (user: {
  id: number;
  name?: string;
  email?: string;
  age?: number;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.put(`${BASE_URL}/${user.id}`, user);
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.log("Error updating user:", error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || "Failed to update user",
    };
  }
};

export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.log("Error deleting user:", error);
    return {
      success: false,
      data: undefined,
      message: error.response?.data?.message || "Failed to delete user",
    };
  }
};
