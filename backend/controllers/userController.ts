import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { Prisma } from '@prisma/client';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
if (!jwtSecret) throw new Error('JWT_SECRET not set');




export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, profileImage } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, profileImage },
      select: { name: true, lastLogin: true, profileImage: true },
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Update Profile Error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Name already in use' });
    }
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify user exists before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
    }
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

export const getNotificationSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailNotifications: true, pushNotifications: true, smsAlerts: true, theme: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get Notification Settings Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateNotificationSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { emailNotifications, pushNotifications, smsAlerts, theme } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { emailNotifications, pushNotifications, smsAlerts, theme },
      select: { emailNotifications: true, pushNotifications: true, smsAlerts: true, theme: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update Notification Settings Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, selectedTools: true, subscriptionStatus: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      plan: user.plan,
      selectedTools: user.selectedTools,
      status: user.subscriptionStatus || 'active',
    });
  } catch (error) {
    console.error('Get Subscription Error:', error);
    res.status(500).json({ message: 'Could not fetch subscription' });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { plan, selectedTools } = req.body;
    if (!plan || !Array.isArray(selectedTools)) {
      return res.status(400).json({ message: 'Plan and selectedTools are required' });
    }

    const validPlans = ['starter', 'pro', 'enterprise'];
    if (!validPlans.includes(plan.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const validTools = [
      'Artisan AI',
      'VoiceCraft',
      'LingoSync',
      'NeuroChat',
      'CodeForge',
      'VisionX',
      'DataMiner',
      'QuantumCore',
      'TextGenix',
      'ImageSynth',
    ];
    const invalidTools = selectedTools.filter((tool: string) => !validTools.includes(tool));
    if (invalidTools.length > 0) {
      return res.status(400).json({ message: `Invalid tools: ${invalidTools.join(', ')}` });
    }

    const toolLimits: { [key: string]: number } = {
      starter: 3,
      pro: 8,
      enterprise: Infinity,
    };
    const maxTools = toolLimits[plan.toLowerCase()];
    if (maxTools !== Infinity && selectedTools.length > maxTools) {
      return res.status(400).json({ message: `Cannot select more than ${maxTools} tools for ${plan} plan` });
    }

    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    // Update the user subscription information.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan.toLowerCase(),
        selectedTools,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionEndDate,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        plan: true,
        selectedTools: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      },
    });

    // Create an invoice record if the plan is a paid plan.
    if (plan.toLowerCase() !== 'starter') {
      // Set amount based on plan. (Adjust these values as necessary.)
      const amount = plan.toLowerCase() === 'pro' ? 49 : 149;
      const createdInvoice = await prisma.invoice.create({
        data: {
          userId: userId,
          date: new Date(),
          description: `Subscription Payment for ${plan} Plan`,
          amount,
          status: 'Paid',
        },
      });
      console.log('Invoice created:', createdInvoice);
    }

    res.status(200).json({
      status: updatedUser.subscriptionStatus,
      plan: updatedUser.plan,
      selectedTools: updatedUser.selectedTools,
      startDate: updatedUser.subscriptionStartDate?.toISOString(),
      endDate: updatedUser.subscriptionEndDate?.toISOString(),
    });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    res.status(500).json({ message: 'Could not update subscription' });
  }
};


export const getInvoices = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: Number(userId) },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        description: true,
        amount: true,
        status: true,
      },
    });

    const formattedInvoices = invoices.map((invoice) => ({
      date: invoice.date.toISOString().split('T')[0],
      desc: invoice.description,
      amount: `$${invoice.amount.toFixed(2)}`,
      status: invoice.status,
    }));

    res.status(200).json(formattedInvoices);
  } catch (error) {
    console.error('Get Invoices Error:', error);
    res.status(500).json({ message: 'Could not fetch invoices' });
  }
};



export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    console.log('Signup request:', { email, name });
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plan: 'starter',
        subscriptionStatus: 'inactive',
        selectedTools: [],
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' },
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: {
          plan: user.plan,
          selectedTools: user.selectedTools,
          status: user.subscriptionStatus,
          startDate: user.subscriptionStartDate?.toISOString(),
          endDate: user.subscriptionEndDate?.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email });
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: {
          plan: user.plan || 'starter',
          selectedTools: user.selectedTools || [],
          status: user.subscriptionStatus || 'inactive',
          startDate: user.subscriptionStartDate?.toISOString(),
          endDate: user.subscriptionEndDate?.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        selectedTools: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan || 'starter',
      selectedTools: user.selectedTools || [],
      subscriptionStatus: user.subscriptionStatus || 'inactive',
      subscriptionStartDate: user.subscriptionStartDate?.toISOString(),
      subscriptionEndDate: user.subscriptionEndDate?.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

