import { nanoid } from "nanoid";
import { UniqueConstraintError } from "sequelize";
import Url from "../models/url.js";
import { Op } from "sequelize";

async function createUrl(req, res) {
  try {
    const { longUrl } = req.body;

    // 1. Basic input validation
    if (!longUrl || typeof longUrl !== "string") {
      return res
        .status(400)
        .json({ error: "Valid longUrl   string is required" });
    }

    // Optional: basic protocol check
    if (!/^https?:\/\//i.test(longUrl)) {
      return res
        .status(400)
        .json({ error: "URL must begin with http:// or https://" });
    }

    // 2. Set expiration date (now + 15 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 15);

    const MAX_RETRIES = 5;
    let attempts = 0;
    let newRecord = null;

    // 3. Collision-resistant generation loop
    while (attempts < MAX_RETRIES) {
      const generatedHash = nanoid(7);

      // Check if hash already exists in database
      const existingUrl = await Url.findOne({
        where: { hashValue: generatedHash },
        attributes: ["id"], // Lightweight query: only check primary key
      });

      if (!existingUrl) {
        try {
          // Attempt insert
          newRecord = await Url.create({
            longUrl,
            hashValue: generatedHash,
            expiresAt,
          });
          break; // Successfully created, exit loop
        } catch (dbError) {
          // Handle concurrent race condition (if another request inserted the same hash simultaneously)
          if (dbError instanceof UniqueConstraintError) {
            attempts++;
            continue;
          }
          throw dbError;
        }
      }

      attempts++;
    }

    // If max retries exhausted without finding a unique hash
    if (!newRecord) {
      return res.status(500).json({
        error:
          "High collision rate detected. Unable to generate short URL at this time.",
      });
    }

    // 4. Construct response
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const shortUrl = `${baseUrl}/${newRecord.hashValue}`;

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        id: newRecord.id,
        longUrl: newRecord.longUrl,
        shortUrl,
        hashValue: newRecord.hashValue,
        expiresAt: newRecord.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error in createUrl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function redirectToUrl(req, res) {
  try {
    const { hashValue } = req.params;

    // 1. Validate parameter
    if (!hashValue) {
      return res
        .status(400)
        .json({ error: "Hash value parameter is required" });
    }

    // 2. Find active, non-expired URL record
    const urlRecord = await Url.findOne({
      where: {
        hashValue,
        [Op.or]: [
          { expiresAt: null }, // Never expires
          { expiresAt: { [Op.gt]: new Date() } }, // Expiration is still in the future
        ],
      },
      attributes: ["longUrl"], // Optimization: only fetch longUrl   from the DB
    });

    // 3. If record does not exist or has expired
    if (!urlRecord) {
      return res.status(404).json({
        error: "URL not found or has expired",
      });
    }

    // 4. Redirect browser to the original destination
    return res.redirect(urlRecord.longUrl);
  } catch (error) {
    console.error("Error in redirectToUrl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export { createUrl, redirectToUrl };
