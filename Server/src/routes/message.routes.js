import express from "express"
import {protectRoute} from "../middlewares/auth.middleware.js"

import {sendMessage,getUserForSidebar , getMessage} from "../controllers/message.controller.js"

const router = express.Router();

router.post("/sendmessage/:id",protectRoute , sendMessage );
router.get("/sidebarUsers",protectRoute , getUserForSidebar );
router.get("/:id",protectRoute , getMessage );


export default router;