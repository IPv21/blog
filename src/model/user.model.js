const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({

    username : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        // enum: ["user", "admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//hash password before saving to DB
userSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) return;
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    next();
}
);

//compare password
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
}



const User = model('User', userSchema);
module.exports = User;

