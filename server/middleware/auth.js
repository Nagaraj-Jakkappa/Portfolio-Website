const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Adjust this path to your Admin model

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Auth Failed: No Bearer token in header");
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the admin in DB and attach to req (excluding password)
    // Most controllers expect req.admin to be the database user object
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      console.log("Auth Failed: Token valid but Admin not found in DB");
      return res.status(401).json({ error: 'Unauthorized — user does not exist' });
    }

    next();
  } catch (err) {
    console.log("Auth Failed: JWT Verification Error ->", err.message);
    return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
  }
};

module.exports = { protect };