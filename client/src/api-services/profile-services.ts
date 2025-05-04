import { AxiosError } from "axios";
import { axiosClient } from "../config/axios-config";
import { useUserStore } from "../store/user-store";

export const updateProfilePicture = async (data: FormData) => {
  try {
    const res = await axiosClient.put("/users/update-profile", data);
    const updatedProfileUrl = res.data.profileImage;
    let user = useUserStore.getState().user;
    let updateUser = useUserStore().updateUser;

    if (user) {
      updateUser({
        ...user,
        profileImage: updatedProfileUrl,
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to login"
        );
      }
    }

    return error;
  }
};
