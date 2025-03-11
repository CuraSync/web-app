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

export default decodeToken;
