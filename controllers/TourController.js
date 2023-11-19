const Notification = require("../models/Notification");
const Tour = require("../models/Tour");
const { validateBody } = require("../utils/utilityFunctions");



// Create a new tour
const createTour = async (req, res) => {
  const {user_id} = req.user
  const {day, time, propertyId, period} =req.body
  try {
      const newTour = await Tour.create({
        userId : user_id, 
        day, time, propertyId, period
      });

      const currentDate = new Date();

      // Get the year, month, and day
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const day1 = currentDate.getDate();

      // Create formatted strings for the date
      const formattedDate = `${day1}-${month < 10 ? '0' : ''}${month}-${year}`;

      const notificationContent = {
        heading : "Tour Scheduled Sucesss",
        content : `You have successfully schdule a tour to ${day} ${time} ${period}`,
        user_id : user_id,
        attachment : newTour._id,
        Date : formattedDate
      }
      const newNotification = await Notification.create(notificationContent)
      res.status(201).json({ message: "tourCreated successfully", data: newTour });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: "Error creating the tour",  message : error.message });
  }
};

// Update an existing tour
const updateTour = async (req, res) => {
  try {
      const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
      });
      if (!updatedTour) {
          return res.status(404).json({ success: false, error: 'Tour not found' });
      }
      res.status(200).json({ success: true, data: updatedTour });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single tour by ID
const getTour = async (req, res) => {
  try {
      const tour = await Tour.findById(req.params.id);
      if (!tour) {
          return res.status(404).json({ success: false, error: 'Tour not found' });
      }
      res.status(200).json({ success: true, data: tour });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a tour by ID
const deleteTour = async (req, res) => {
  try {
      const deletedTour = await Tour.findByIdAndDelete(req.params.id);
      if (!deletedTour) {
          return res.status(404).json({ success: false, error: 'Tour not found' });
      }
      res.status(200).json({ success: true, data: {} });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTour,
  updateTour,
  getTour,
  deleteTour,
}