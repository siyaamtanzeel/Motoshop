import { Request, Response } from 'express';
import News from './news.model';
import { uploadToCloudinary } from '../../utils/cloudinary';

// Get all news
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find({ isPublished: true })
      .sort({ publishDate: -1 })
      .populate('author', 'name');
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
};

// Get single news by id
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
};

// Create news (admin only)
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, description, content, publishDate } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      description,
      content,
      image: imageUrl,
      publishDate: publishDate || new Date(),
      author: req.user._id,
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
};

// Update news (admin only)
export const updateNews = async (req: Request, res: Response) => {
  try {
    const { title, description, content, publishDate, isPublished } = req.body;
    const updateData: any = { title, description, content, publishDate, isPublished };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      updateData.image = result.secure_url;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
};

// Delete news (admin only)
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
};
