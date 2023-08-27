import http from "./Api";
import axios from "axios";

class LoginService {
    async login(credentials) {
        try {
            const { data } = await http.post("/login", credentials, { withCredentials: true });

            if (data) {
                // Set the access token in the Authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            }

            return data; // Return the data from the response
        } catch (error) {
            throw error;
        }
    }
}

const loginService = new LoginService();
export default loginService;