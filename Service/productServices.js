const connection = require('../config/dbconnect');
const User = require('../Model/userModel');
const UserRoles = require('../Model/userRoleModel');
const MongoUser = require('../Model/usermongoSchema');
const Designation = require('../Model/designationmodel')
const Joi = require('joi')


const productService = {

    createNewCatagory: async (data) => {
        try {
            const { category, description, masterid, status } = data;

            const result = await connection.query(
                'INSERT INTO public.category ( category_description, category_name,master_category_id, status ) VALUES ($1, $2, $3,$4 ) RETURNING *',
                [description, category, masterid, status]
            );
            return result.rows

        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    },

    getAllCatagory: async () => {
        try {
            const result = await connection.query(
                `SELECT c.id, c.category_description, c.category_name, c.status,
                mc.id AS master_category_id, mc.master_category_name
                FROM public.category c
                LEFT JOIN public.master_category mc
                ON c.master_category_id = mc.id;`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    },
    createNewMasterCatagory: async (data) => {
        try {
            const { category, description, status } = data;

            const result = await connection.query(
                'INSERT INTO public.master_category ( master_category_description, master_category_name, status ) VALUES ($1, $2, $3 ) RETURNING *',
                [description, category, status]
            );
            return result.rows

        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    },

    getAllMasterCatagory: async () => {
        try {
            const result = await connection.query(
                'SELECT id, master_category_description,master_category_name,status From public.master_category');
            return result.rows

        } catch (error) {
            throw new Error(`Error getting Master category: ${error.message}`);
        }
    }
}



module.exports = productService