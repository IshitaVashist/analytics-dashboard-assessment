import Papa from 'papaparse';

/**
 * Fetches and parses a CSV file from a given URL.
 * @param {string} fileUrl - The URL of the CSV file to parse.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects representing the CSV rows.
 */
export const parseData = (fileUrl) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileUrl, {
      download: true, // We are fetching the file from a URL
      header: true, // Treat the first row as headers
      dynamicTyping: true, // Automatically convert numbers and booleans
      skipEmptyLines: true, // Ignore empty lines
      complete: (results) => {
        // Clean up data: remove rows with null or undefined essential fields
        const cleanedData = results.data.filter(row => 
            row['Model Year'] && row['Make'] && row['Electric Vehicle Type']
        );
        resolve(cleanedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};