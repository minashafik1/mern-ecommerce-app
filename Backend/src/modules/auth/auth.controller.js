import jwt from 'jsonwebtoken';
import catchError from '../../Middleware/catchError.js';
import User from '../../../database/models/user.model.js';
import { AppError } from '../../../utils/appErorr.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../../utils/sendEmail.js';

export const signup = catchError(async (req, res, next) => {
    const { name, username, password, email, age } = req.body;

    // Check if email already exists
    const userCheck = await User.findOne({ email }).select('-_id email');
    if (userCheck) {
        return next(new AppError("Email is Already Exist", 409));
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user with isConfirmed = false
    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        email,
        age,
        isConfirmed: false
    });
    await newUser.save();

    // Generate confirmation token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, { expiresIn: '1d' });

    // Build confirmation link
    const confirmationLink = `${req.protocol}://${req.headers.host}/api/confirm/${token}`;
    const message = `<a href="${confirmationLink}">Click to Confirm</a>`;

    // Send confirmation email
    try {
        await sendEmail({
            to: email,
            message: message,
            subject: "Email Confirmation"
        });
        res.status(201).json({ message: "Sign Up Done, Please Confirm your mail" });
    } catch (error) {
        return next(new AppError("Sending Email Fail", 500));
    }
});

// ================================================ Confirmation Email ==================================================

export const confirmEmail = catchError(async (req, res, next) => {
    const { token } = req.params;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        
        user.isConfirmed = true;
        await user.save();
        
        res.status(200).json({ message: "Email confirmed successfully" });
    } catch (error) {
        return next(new AppError("Invalid or expired token", 400));
    }
});

// ================================================ Login ==================================================

export const login = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    
    const userCheck = await User.findOne({ email, isConfirmed: true });
    if (!userCheck) {
        return next(new AppError("Please Confrim your mail", 404));
    }
    
    // Check if email is confirmed
    if (!userCheck.isConfirmed) {
        return next(new AppError("Please confirm your email before logging in", 403));
    }
    
    // Check password
    const passwordCheck = bcrypt.compareSync(password, userCheck.password);
    if (!passwordCheck) {
        return next(new AppError("Invalid Login Info", 404));
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { 
            userId: userCheck._id, 
            email: userCheck.email, 
            role:userCheck.role,
            isLoggedIn: true 
        }, 
        process.env.JWT_KEY, 
        { expiresIn: '7d' }
    );
    
    // Update user login status
    await User.findByIdAndUpdate(userCheck._id, { isLoggedIn: true });
    
    res.status(200).json({ 
        message: "Login successful", 
        token,
        user: {
            id: userCheck._id,
            name: userCheck.name,
            email: userCheck.email,
            username: userCheck.username,
            role: userCheck.role
        }
    });
});

// ================================================ authorization ==================================================

export const protectedRoutes = catchError(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next(new AppError('Authorization header not provided', 400));
    }
    if (!authorization.startsWith('Bearer ')) {
        return next(new AppError('Invalid bearer key', 400));
    }

    const token = authorization.split('Bearer ')[1];
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        return next(new AppError('Invalid token', 401));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
        return next(new AppError('User not found', 401));
    }

    if (user.passwordChangedAt) {
        let time = parseInt(user.passwordChangedAt.getTime() / 1000);
        if (time > payload.iat) {
            return next(new AppError('Invalid token ... login again', 401));
        }
    }

    req.user = user;
    next();
});
// ================================================ Allowed To ==================================================

export const allowedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next();
        }
        return next(new AppError("You are not authorized to access this endpoint", 401));
    });
};

// ================================================ Logout ==================================================

export const logout = catchError(async (req, res, next) => {
    if (req.user) {
        await User.findByIdAndUpdate(req.user._id, { isLoggedIn: false });
    }
    res.status(200).json({ message: "Logged out successfully" });
});

// ================================================ Get Current User ==================================================

export const getCurrentUser = catchError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "success", user });
});


export const getAllusers = catchError(async (req, res, next) => {
    const users = await User.find().select('-password');
    res.status(200).json({ message: "success", users });
});