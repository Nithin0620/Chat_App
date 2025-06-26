import cloudinary from "../configuration/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js"

export const getUserForSidebar = async(req,res)=>{
   try{
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({_id:{$ne:loggedInUserId}});

      res.status(200).json({
         success:true,
         message:"User for sidebar fetched successfully in the controller",
         data:filteredUsers,
      })
   }
   catch(e){
      console.log(e);
      res.status(500).json({
         success:false,
         message:"Error in the controller of getuserforsidebar"
      })
   }
}

export const getMessage=async(req,res)=>{
   try{
      const {id:userToChatId} = req.params;
      const myId = req.user._id;

      const message = await Message.find({
         $or:[
            {senderId:myId , receiverId:userToChatId},
            {senderId:userToChatId , receiverId:myId},
         ],
      })

      res.status(200).json({
         success:true,
         message:"MEssage retrived successfully",
         data:message
      })
   }
   catch(e){
      console.log(e);
      res.status(500).json({
         success:false,
         message:"Error in the controller of getMessage"
      })
   }
}

export const sendMessage = async(req,res)=>{
   try{
      const {text,image} = req.body;
      const {id:receiverId} = req.params;
      const senderId = req.user && req.user._id;

      if (!senderId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized: senderId not found",
         });
      }

      let imageUrl;

      if(image){
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
      }

      const newMessage = await Message.create({senderId , receiverId , text, image:imageUrl});

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
         io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      return res.status(201).json({
         success:true,
         message:"message sent successfully",
         data:newMessage,
      });
      
   }
   catch(e){
      console.log(e);
      return res.status(500).json({
         success:false,
         message:"Error in the send Message Controller"
      })
   }
}