import fs from 'fs';
import path from 'path';

const attorneysFilePath = path.resolve('data', 'attorneys.json');

const readAttorneysFromFile = () => {
  const fileData = fs.readFileSync(attorneysFilePath, 'utf-8');
  return JSON.parse(fileData);
};

const writeAttorneysToFile = (data) => {
  fs.writeFileSync(attorneysFilePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  let attorneys = readAttorneysFromFile();

  if (req.method === 'GET') {
    res.status(200).json(attorneys);
  } else if (req.method === 'POST') {
    const { firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases } = req.body;

    if (!firstName || !lastName || !specialty || !phoneNumber || !email || !indicator || !countryPhone || !description || !totalCases || !wonCases) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    attorneys.push(newAttorney);
    writeAttorneysToFile(attorneys);
    res.status(201).json(newAttorney);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const attorneyId = Number(id);
    if (!attorneys.some((attorney) => attorney.id === attorneyId)) {
      return res.status(404).json({ message: 'Attorney not found' });
    }

    attorneys = attorneys.filter((attorney) => attorney.id !== attorneyId);
    writeAttorneysToFile(attorneys);

    res.status(200).json({ message: `Attorney with id ${id} deleted successfully` });
  } else if (req.method === 'PUT') {
    const { id, firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases } = req.body;
    const index = attorneys.findIndex((attorney) => attorney.id === id);
    if (index !== -1) {
      attorneys[index] = { id, firstName, lastName, specialty, phoneNumber, email, indicator, countryPhone, description, totalCases, wonCases };
      writeAttorneysToFile(attorneys);
      res.status(200).json(attorneys[index]);
    } else {
      res.status(404).json({ message: 'Attorney not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
