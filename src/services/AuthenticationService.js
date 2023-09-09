import http from "./Api";
import axios from "axios";

class AuthenticationService {

    create(data) {
        return http.post("/register", data);
    }

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

    forgot(email) {
        return http.post("/forgot", email);
    }

    findByTitle(search, page = 1) {
        return http.get(`/users/user?search=${search}&page=${page}`);
    }

    findByProducts(search, page = 1) {
        return http.get(`/products/product?search=${search}&page=${page}`);
    }

    findByOrders(search, page = 1) {
        return http.get(`/order?search=${search}&page=${page}`);
    }

    //   getAll() {
    //     return http.get("/pengguna");
    //   }

    //   get(id) {
    //     return http.get(`/pengguna/${id}`);
    //   }

    //   update(id, data) {
    //     return http.put(`/pengguna/${id}`, data);
    //   }

    //   delete(id) {
    //     return http.delete(`/pengguna/${id}`);
    //   }

    //   deleteAll() {
    //     return http.delete(`/pengguna`);
    //   }

}

const authenticationService = new AuthenticationService();
export default authenticationService;