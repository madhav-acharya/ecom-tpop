import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  const { user, name, rating, comment, productId } = req.body;
  try {
    const review = new Review({ user, name, rating, comment, productId });
    await review.save();
    res.status(201).json(review);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'firstName lastName');
    res.status(200).json(reviews);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );
    if (!updatedReview) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(updatedReview);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getReviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findById(id).populate('user', 'firstName lastName');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
export const getReviewsByProductId = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ productId }).populate('user', 'firstName lastName');
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}