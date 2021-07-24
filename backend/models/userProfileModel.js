import mongoose from 'mongoose'

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,         
        },
        image: {type: String, default: '/userProfile/default.png'}
    },
    {
        timestamps: true,
    }
)

const User_Profile = mongoose.model('User_Profile', userProfileSchema);

export default User_Profile;