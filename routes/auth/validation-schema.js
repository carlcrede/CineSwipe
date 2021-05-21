const { find } = require('../../db/model/user.js');
const User = require('../../db/model/user.js');

const register = {
    username: {
        custom: {
            options: async value => {
                const foundUser = await User.find({ user: value });
                if (foundUser.length > 0) {
                    return Promise.reject('Username already in use');
                }
            }
        }
    },
    password: {
        custom: {
            options: async value => {
                const findUpperCase = /[A-Z]/;
                const findLowerCase = /[a-z]/;
                const findNumber = /[0-9]/;
                if(value.length < 7){
                    return Promise.reject('Password must be at least 7 characters long');
                }
                else if(findUpperCase.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 uppercase letter [A-Z]');
                } 
                else if (findLowerCase.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 lowercase letter [a-z]');
                }
                else if (findNumber.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 number [0-9]');
                } else {
                    return Promise.resolve();
                }
            }
        }
    },
    email: {
        normalizeEmail: true,
        custom: {
            options: async value => {
                const foundEmail = await User.find({ email: value });
                if (foundEmail.length > 0) {
                    return Promise.reject('Email already in use');
                }
            }
        }
    }
}

const login = {
    username: {
        custom: {
            options: async value => {
                const foundUser = await User.find({ user: value });
                if (foundUser.length > 0) {
                    return Promise.reject('Username already in use');
                }
            }
        }
    },
    password: {
        custom: {
            options: async value => {
                const findUpperCase = /[A-Z]/;
                const findLowerCase = /[a-z]/;
                const findNumber = /[0-9]/;
                if(value.length < 7){
                    return Promise.reject('Password must be at least 7 characters long');
                }
                else if(findUpperCase.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 uppercase letter [A-Z]');
                } 
                else if (findLowerCase.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 lowercase letter [a-z]');
                }
                else if (findNumber.exec(value) === null) {
                    return Promise.reject('Password must contain at least 1 number [0-9]');
                } else {
                    return Promise.resolve();
                }
            }
        }
    },
    email: {
        normalizeEmail: true,
        custom: {
            options: async value => {
                const foundEmail = await User.find({ email: value });
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