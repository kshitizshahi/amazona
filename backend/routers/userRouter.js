import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { generateToken, isAuth } from "../utils.js";
import User_Profile from "../models/userProfileModel.js";


const userRouter = express.Router();

userRouter.get('/userprofileimg/', isAuth, expressAsyncHandler(async (req, res) => {
    const userImageProfile = await User_Profile.findOne({user: req.user._id});
    if (userImageProfile) {
        const user = await User.findById(userImageProfile.user)
        res.send({
            _id: userImageProfile._id,
            image: userImageProfile.image,
            user: userImageProfile.user,
            name: user.name,
        });
    } else {
        res.status(404).send({ message: 'User Profile Not Found' });
    }
}))

userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users)
    res.send({ createdUsers });
}));

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).send({ message: 'Invalid email or password' });

}))

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const dup_email = await User.findOne({ email: req.body.email });
    if (req.body.password !== req.body.confirmPassword) {
        res.status(401).send({ message: 'Password not matching' });
    } else if (dup_email) {
        res.status(401).send({ message: 'Email already in use' });
    } else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        })
        const createdUser = await user.save();
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        })

    }

}))

userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}))


userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const email = user.email

    if (req.body.password !== req.body.confirmPassword) {
        res.status(401).send({ message: 'Password not matching' });
    } else if (user && email !== req.body.email) {
        const newEmail = req.body.email
        const checkEmail = await User.findOne({ email: newEmail })
        if (checkEmail) {
            res.status(401).send({ message: `Email already in use!!!` });
        }
    }

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),

        })

    }

}))

userRouter.post('/createprofile', isAuth, expressAsyncHandler(async (req, res) => {
    const userProfile = new User_Profile({
        user: req.user._id,
    })
    const createdUserProfile = await userProfile.save();
    res.send({
        _id: createdUserProfile.user,
        image: createdUserProfile.image,
    })
}))


export default userRouter;


