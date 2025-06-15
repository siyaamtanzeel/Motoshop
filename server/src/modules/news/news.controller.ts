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
    console.error('Error fetching news:', error);
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
    console.error('Error fetching news by id:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
};

// Create news (admin only)
export const createNews = async (req: Request, res: Response) => {
  try {
    // Check authentication
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Log request data for debugging
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Validate required fields
    const { title, content, description } = req.body;
    if (!title?.trim() || !content?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: 'Missing required fields',
        received: { title, content, description },
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    let imageUrl: string;
    try {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
      console.log('Cloudinary upload successful:', imageUrl);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // Create news entry
    const news = await News.create({
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      image: imageUrl,
      author: req.user._id,
      publishDate: new Date(),
      isPublished: true,
    });

    // Populate author details
    const populatedNews = await news.populate('author', 'name email');

    console.log('News created successfully:', populatedNews);
    res.status(201).json(populatedNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      message: 'Error creating news',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update news (admin only)
export const updateNews = async (req: Request, res: Response) => {
  try {
    const { title, content, description, isPublished } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    let imageUrl = news.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.description = description || news.description;
    news.image = imageUrl;
    news.isPublished = isPublished ?? news.isPublished;

    await news.save();
    await news.populate('author', 'name');

    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
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
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news' });
  }
};
