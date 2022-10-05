const Credentials = require('../../db/model/credentials.js');

const register = {
    username: {
        custom: {
            options: async value => {
                if(value.length < 5){
                    return Promise.reject('Username must be at least 5 characters long');
                }
                const foundUser = await Credentials.find({ username: value });
                if (foundUser.length > 0) {
                    return Promise.reject('Username already in use');
                }
            }
        }
    },
    password: {
        custom: {
            options: async value => {
                if(value.length < 8){
                    return Promise.reject('Password must be at least 8 characters long');
                }
            }
        }
    },
    email: {
        custom: {
            options: async value => {
                if(value.length <= 0 || !value.includes('@')){
                    return Promise.reject('Invalid email');
                }
                const foundEmail = await Credentials.find({ email: value });
                if (foundEmail.length > 0) {
                    return Promise.reject('Email already in use');
                }
            }
        }
    }
}

module.exports = {
    register
}