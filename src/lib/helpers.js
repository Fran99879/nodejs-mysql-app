const helpers = {};
const bcrypt = require('bcryptjs');

//metodo para cifrar contraseña en el registro
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//metodo para comprar contraseñas en el signup
helpers.mathPassword = async (passport, savedPassword) => {
    try{
        return await bcrypt.compare(passport, savedPassword);
    } catch (e) {
        console.log()
    }
    
};

module.exports = helpers;