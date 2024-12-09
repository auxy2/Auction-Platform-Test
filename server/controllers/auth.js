// server/controllers/auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    // Extract user data from request body
    const { username, email, password, role } = req.body;

    console.log('Signup data:', { username, email, role });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.role === role) {
      // Email exists with the same role
      return res
        .status(400)
        .json({
          error: `User with this email already exists for role ${role}`,
        });
    } else if (existingUser && existingUser.role !== role) {
      // Email exists with a different role - log this scenario
      console.log(
        `Email ${email} already exists for a different role: ${existingUser.role}`
      );
      return res
        .status(400)
        .json({
          error: `Email  already exists for a different role: ${existingUser.role}`,
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', role });
    console.log('getting the role', role);
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract user data from request body
    const { email, password, role } = req.body;

    console.log('user role is:', role);
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (req.body.role && user.role !== role) {
      return res
        .status(401)
        .json({ error: 'Invalid credentials for the selected role' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    console.log(user.role);

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.protect = async (req, res, next) => {
  try {
    let jwtToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('AUCTIONS_PLATFORMS')
    )
      jwtToken = req.headers.authorization.split(' ')[1];
    res.cookei = jwtToken;

    if (!jwtToken) throw new UnauthenticatedError('You are not login yet');
    const decoded = await promisify(jwt.verify)(
      jwtToken,
      'thi you si sth esimp made lep for m  are  secrete eterces'
    );


      const currentUser = await User.findById(decoded.Id);

    console.log(currentUser);

    if (!currentUser){
      return res.status(401).json({error: 'Authentication Error: Please loging again'})
    }


    req.user = currentUser;

    req.locals = {
      ...req.locals,
      user: currentUser,
    };
    return next();
  } catch (e) {
    return error(res, e?.statusCode || 500, e);
  }
};



