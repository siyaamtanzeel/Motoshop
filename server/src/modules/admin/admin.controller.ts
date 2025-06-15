import { Request, Response } from 'express';
import User from '../users/user.model';
import Bike from '../bikes/bike.model';
import Order from '../orders/order.model';

export const getDashboardStats = async (req: Request, res: Response) => {
  const users = await User.countDocuments();
  const bikes = await Bike.countDocuments();
  const orders = await Order.countDocuments();
  res.json({ users, bikes, orders });
};

export const manageUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const manageBikes = async (req: Request, res: Response) => {
  const bikes = await Bike.find();
  res.json(bikes);
};

export const manageOrders = async (req: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
};

// Block/Unblock User
export const toggleUserBlock = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user block status' });
  }
};

// Change User Role
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-role change
    if (req.user && req.user._id.toString() === user._id.toString()) {
      return res.status(403).json({ message: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({ message: 'Error changing user role' });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Update Homepage Content
export const updateHomepageContent = async (req: Request, res: Response) => {
  try {
    // You can store homepage content in a separate collection or as a JSON file
    // For this example, we'll use environment variables or a config file
    const { heroTitle, heroDescription, stats } = req.body;

    // Update your content storage method here
    // For example, you could use a HomepageContent model

    res.json({ message: 'Homepage content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating homepage content' });
  }
};
