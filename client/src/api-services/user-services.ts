import { axiosClient } from "../config/axios-config"

export const getAllUsers = async() => {
    try {
        await axiosClient.get("/users/all-users")
    } catch (error) {
        
    }
}