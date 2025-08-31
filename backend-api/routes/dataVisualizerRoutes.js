import express from "express";
import { uploadCSV } from "../middlewares/uploadMiddleware.js";
import { validateCSVUpload, handleMulterError } from "../middlewares/validateMiddleware.js";
import { handleCSVUpload } from "../controllers/dataVisualizer.js";
import { PrismaClient } from "./../generated/prisma/index.js";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware order: validate → upload → error handler → controller
router.post("/upload-csv", validateCSVUpload, uploadCSV, handleMulterError, handleCSVUpload);

// Get latest CSV data endpoint
router.get("/latest-csv-data", async (req, res) => {
  try {
    const latestData = await prisma.CSVFile.findFirst({
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    if (!latestData) {
      return res.status(404).json({ 
        success: false,
        message: 'No CSV data found',
        data: null 
      });
    }

    res.json({
      success: true,
      message: 'Latest CSV data retrieved successfully',
      data: {
        id: latestData.id,
        headers: latestData.columns,
        data: latestData.rawData,
        fileName: latestData.fileName,
        uploadedAt: latestData.uploadedAt
      }
    });
  } catch (error) {
    console.error('Error fetching latest CSV data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching CSV data',
      data: null 
    });
  }
});

export default router;
