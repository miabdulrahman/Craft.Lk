import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'craftlk_academic_jwt_secret_key_2026_seusl_handicrafts',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sendTokenResponse = (user, shop, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('token', token, cookieOptions);

  // Exclude password from response
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj,
    shop: shop || null
  });
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'customer',
      phone,
      shopName,
      shopDescription,
      district,
      city
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Role cannot be directly set to admin via registration
    const userRole = role === 'seller' ? 'seller' : 'customer';

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: userRole,
      phone: phone || ''
    });

    let shop = null;
    // If registering as a seller, create pending shop application
    if (userRole === 'seller') {
      const finalShopName = shopName?.trim() || `${name}'s Artisan Crafts`;
      const existingShop = await Shop.findOne({ shopName: finalShopName });

      if (existingShop) {
        // Rollback user creation to maintain consistency
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'A shop with this name already exists. Please choose a different shop name.'
        });
      }

      shop = await Shop.create({
        owner: user._id,
        shopName: finalShopName,
        description:
          shopDescription ||
          `Handcrafted Sri Lankan traditional artisan goods by ${name}.`,
        phone: phone || '0712345678',
        district: district || 'Colombo',
        city: city || 'Colombo',
        approvalStatus: 'pending'
      });
    }

    sendTokenResponse(
      user,
      shop,
      201,
      res,
      userRole === 'seller'
        ? 'Seller registration submitted successfully! Your shop application is pending administrator review.'
        : 'Customer registration successful!'
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administrator support.'
      });
    }

    let shop = null;
    if (user.role === 'seller') {
      shop = await Shop.findOne({ owner: user._id });
    }

    sendTokenResponse(user, shop, 200, res, 'Logged in successfully!');
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let shop = null;
    if (user.role === 'seller') {
      shop = await Shop.findOne({ owner: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      shop
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address) updates.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
