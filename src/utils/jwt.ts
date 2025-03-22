import { jwtDecode } from "jwt-decode";

const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const getId = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const data = refreshToken ? decodeToken(refreshToken) : null;
  return data ? data.id : null;
};

export { decodeToken, getId };
