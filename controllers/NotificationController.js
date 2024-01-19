const Notification = require("../models/Notification")








const getMyNotification = async (req, res) => {
 const user = req.user

 try {
    const  notifications = await  Notification.find({user_id : user.user_id})
    if(!notifications){
        return res.status(404).json({message:"notification  not found"})
    }
    notifications.reverse();
    res.status(200).json( notifications )
 } catch (error) {
    return res.status(500).json({ message: "Error creating the notification",  error : error.message });
 }

}

const getNotification = async (req, res) => {
    const notificationiId = req.params.id;
   
    try {
       const  notification = await  Notification.findById(notificationiId)
       if(!notification){
           return res.status(404).json({message:"notification  not found"})
       }
       res.status(200).json(  )
    } catch (error) {
       return res.status(500).json({ message: "Error creating the notification",  error : error.message });
    }
   
   }
   
   



const deleteNotification = async (req, res) => {
    const notificationiId = req.params.id;
    try {
         const deletedNotification = await  Notification.findByIdAndDelete(notificationiId)
         if(!deletedNotification) {
           return res.status(404).json({message :"Notification not found"})
         }
         res.status(200).json({message : "Notification deleted successfully"})
    } catch (error) {
       return res.status(500).json({ message: "Fail to delete",  error : error.message });
    }
}





module.exports ={getMyNotification, deleteNotification, getNotification}