import { Role } from "./role";

export class User {
    constructor(
        public id = '',
        public username = '',
        public email = '',
        public role = new Role()
    ) {}
}