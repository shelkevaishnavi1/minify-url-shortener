import { Router } from "express";
import { createUrl, redirectToUrl } from "../controllers/urlController.js";

const router = Router();

// Endpoint: POST /api/url/shorten
router.post("/url", createUrl);
router.get("/:hashValue", redirectToUrl);
export default router;
