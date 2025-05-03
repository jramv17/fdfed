const mongoose = require('mongoose');

const selectedUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    selectedUsers:{
        type:[String],
        default:['groupchat'],
    },
    aptId:{
        type:String,
        required: true,
    },
    
});

const SelectedUsers=mongoose.model('SelectedUsers',selectedUserSchema);

module.exports=SelectedUsers;