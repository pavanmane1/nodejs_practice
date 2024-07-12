const connect = require('../config/dbconnect');
const User = require('../Model/userModel');

const getUSers = async () => {

    
    // return new Promise((resolve, reject) => {
    //     connect.query('SELECT * FROM hrm.user', (error, result) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             const allUsers = result.rows.map(rows => new User(rows.id, rows.name, rows.email, rows.phone));
    //             resolve(allUsers);
    //         }
    //     });
    // });
};
const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        connect.query('SELECT * FROM hrm.user WHERE id = $1', [id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                const users = result.rows.length ? new User(result.rows[0].id, result.rows[0].name, result.rows[0].email, result.rows[0].phone) : null;
                resolve(users);
            }
        });
    });
};

const createUser = async (data) => {
    return new Promise((resolve, reject) => {
        connect.query('INSERT INTO hrm.user (id , name) Values( )')

    })
}


module.exports = {
    getUSers,
    getUserById
};
