import fs from 'fs';
import path from 'path';

// Define the path to the JSON file where attorneys' data is stored
const attorneysFilePath = path.resolve('data', 'attorneys.json');

// Function to read attorneys' data from the JSON file
const readAttorneysFromFile = () => {
  const fileData = fs.readFileSync(attorneysFilePath, 'utf-8');
  return JSON.parse(fileData);
};

// Function to write the updated attorneys' data back to the JSON file
const writeAttorneysToFile = (data) => {
  fs.writeFileSync(attorneysFilePath, JSON.stringify(data, null, 2));
};

// Main handler function for handling HTTP requests (GET, POST, DELETE, PUT)
export default function handler(req, res) {
  let attorneys = readAttorneysFromFile();

  // Handling the GET request: Fetch and return the list of attorneys
  if (req.method === 'GET') {
    res.status(200).json(attorneys);

    // Handling the POST request: Add a new attorney to the list
  } else if (req.method === 'POST') {
    const { firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases } = req.body;

    if (!firstName || !lastName || !specialty || !phoneNumber || !email || !indicator || !countryPhone || !description || !totalCases || !wonCases) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new attorney object
    const newAttorney = {
      id: Date.now(),
      firstName,
      lastName,
      specialty,
      phoneNumber,
      email,
      indicator,
      countryPhone,
      description,
      totalCases,
      wonCases
    };

    // Add the new attorney to the list and write the updated list to the file
    attorneys.push(newAttorney);
    writeAttorneysToFile(attorneys);

    // Return the new attorney object with a 201 status code indicating successful creation
    res.status(201).json(newAttorney);

    // Handling the DELETE request: Remove an attorney from the list by their ID
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const attorneyId = Number(id);
    if (!attorneys.some((attorney) => attorney.id === attorneyId)) {
      return res.status(404).json({ message: 'Attorney not found' });
    }


    // Filter out the attorney with the matching ID and write the updated list to the file
    attorneys = attorneys.filter((attorney) => attorney.id !== attorneyId);
    writeAttorneysToFile(attorneys);

    // Return a success message with the deleted attorney's ID
    res.status(200).json({ message: `Attorney with id ${id} deleted successfully` });

    // Handling the PUT request: Update the details of an existing attorney
  } else if (req.method === 'PUT') {
    const { id, firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases } = req.body;
    const index = attorneys.findIndex((attorney) => attorney.id === id);
    if (index !== -1) {
      // Update the attorney's details at the found index
      attorneys[index] = { id, firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases };
      writeAttorneysToFile(attorneys);
      res.status(200).json(attorneys[index]);
    } else {
      res.status(404).json({ message: 'Attorney not found' });
    }

    // Handling unsupported HTTP methods
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
