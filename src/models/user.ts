export class User {
    constructor(
        public id = '',
        public username = '',
        public email = ''
    ) {}

    get user_name(){
        return this.username;
    }

    get user_email(){
        return this.email;
    }

    // get name(){
    //     return this.first_name + ' ' + this.last_name;
    // }
}