// Padhu - Auth routes (login, register)
import express,{Request,Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

//POST /api/auth/register
router.post('/register',async(req:Request, res:Response)=>{
    try{
        const {name, email, password, role, userType} = req.body;

        //Checking if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(400).json({message: 'User already exists'});
            return;
        }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create and save the user
    const user = new User({
        name,
        email,
        password:hashedPassword,
        role,
        userType,
    });

    await user.save();

    //Sign and return JWT token
    const token = jwt.sign(
        {userId:user._id,role: user.role},
        process.env.JWT_SECRET as string,
        {expiresIn: '7d'}
    );

    res.status(201).json({ token });

    }catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Sign and return JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, role: user.role, userType: user.userType });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;