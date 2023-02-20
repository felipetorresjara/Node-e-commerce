const {model, Schema} = require('mongoose');

const RoleSchema = Schema({
    role:{
        type: String,
        required: [true, 'Role is required']
    }
});

module.exports = model('Role', RoleSchema);