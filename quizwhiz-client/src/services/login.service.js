import axios from "./axios";

const login = async (data) => {
  return await axios.post("/Auth/login/", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export default login;
