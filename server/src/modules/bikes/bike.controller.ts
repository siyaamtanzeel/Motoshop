import { Request, Response } from 'express';
import Bike from './bike.model';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

const bikeSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  category: z.string().optional(),
});

export const createBike = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can add bikes' });
    }
    const { title, description, price, images, specifications, category } = bikeSchema.parse(
      req.body,
    );
    const seller = req.user._id; // always admin
    // Optionally handle image upload to Cloudinary here
    const bike = await Bike.create({
      title,
      description,
      price,
      images,
      specifications,
      category,
      seller,
    });
    res.status(201).json(bike);
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid data' });
  }
};

export const getBikes = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sortBy, sortOrder, ...specs } = req.query;
    let filter: any = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    // Flexible specs filtering
    Object.keys(specs).forEach((key) => {
      filter[`specifications.${key}`] = specs[key];
    });
    let query = Bike.find(filter);
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      query = query.sort({ [sortBy as string]: order });
    }
    const bikes = await query.exec();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bikes' });
  }
};

export const getBikeById = async (req: Request, res: Response) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bike' });
  }
};

export const updateBike = async (req: Request, res: Response) => {
  try {
    const update = req.body;
    const bike = await Bike.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bike' });
  }
};

export const deleteBike = async (req: Request, res: Response) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json({ message: 'Bike deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete bike' });
  }
};

// Add user property to Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
