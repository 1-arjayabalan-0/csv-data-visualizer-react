import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '../generated/prisma/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const prisma = new PrismaClient();

export const handleCSVUpload = async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'No file uploaded', null, 400);
  }

  const results = [];
  const headers = [];

  try {
    console.log('Processing file:', req.file.path);
    
    // Process CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .on('error', (err) => {
          console.error('Error reading file:', err);
          reject(err);
        })
        .pipe(csv())
        .on('headers', (headerList) => {
          console.log('Headers found:', headerList);
          headers.push(...headerList);
        })
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log('CSV processing complete, rows:', results.length);
          resolve();
        })
        .on('error', (err) => {
          console.error('CSV parsing error:', err);
          reject(err);
        });
    });

    try {
      console.log('Saving to database, rows:', results.length);
      
      // Check if we need to create a test user first
      let userId;
      try {
        // Try to find or create a test user
        const testUser = await prisma.user.upsert({
          where: { email: 'test@example.com' },
          update: {},
          create: {
            email: 'test@example.com',
            password: 'password123' // In a real app, this would be hashed
          }
        });
        userId = testUser.id;
      } catch (userError) {
        console.error('Error creating test user:', userError);
        throw new Error('Failed to create test user: ' + userError.message);
      }
      
      // Store CSV data in database
      const csvData = await prisma.CSVFile.create({
        data: {
          fileName: req.file.originalname,
          rawData: results,
          columns: headers,
          userId: userId
        }
      });
      
      console.log('Data saved to database with ID:', csvData.id);

      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
        else console.log('File deleted successfully:', req.file.path);
      });

      return successResponse(res, 'File processed successfully', {
        id: csvData.id,
        headers: csvData.columns,
        rowCount: results.length,
        fileName: csvData.fileName
      }, 200);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return errorResponse(res, 'Error saving data to database', dbError.message, 500);
    }
  } catch (error) {
    console.error('Error processing CSV:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }
    
    // Send detailed error response
    return errorResponse(
      res, 
      'Error processing CSV file', 
      {
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  }
};
