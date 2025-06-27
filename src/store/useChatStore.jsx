import { create } from "zustand";
import { apiConnector } from "../lib/apiConnector";
import toast from "react-hot-toast";

export const useChatStore = create((get,set)=>({

   message : [],
   users:[],
   selectedUser :null,
   isUsersLoading:false,
   isMessageLoading :false,

   getUsers : async()=>{
      set({isUsersLoading:true})
      try{
         const res = await apiConnector("GET","/messages/users");

         set({users:res.data});

      }
      catch(e){
         console.log(e)
         toast.error(e.response.data.message);
      }
      finally{
         set({isUsersLoading:false})
      }
   },

   getMessage : async(userId)=>{
      set({isMessageLoading:true})
      try{
         const res = await apiConnector("GET" ,`message/${userId}` );

         set({message:res.data});
      }
      catch(e){
         console.log(e);
         toast.error(e.response.data.message);
      }
      finally{
         set({isMessageLoading:false})
      }
   },

   sendMessage : async(messageData)=>{
      const {selectedUser , message} = get();

      try{
         const res = await apiConnector("POST" , `/message/sendmessage/${selectedUser._id}`,messageData);

         set({message:[...message , res.data]});
      }
      catch(e){
         console.log(e);
         toast.error(e.response.data.message);
      }
   },
   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;

      socket.on("newMessage", (newMessage) => {
         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
         if (!isMessageSentFromSelectedUser) return;

         set({
         messages: [...get().messages, newMessage],
         });
      });
   },

   unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
   },

   setSelectedUser: (selectedUser) => set({ selectedUser }),
}));