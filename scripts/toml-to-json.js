import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseToml } from '@iarna/toml';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTomlFilesFromDirectory = (dirPath) => {
  const fileNames = fs.readdirSync(dirPath);
  const data = {};
  fileNames.forEach(fileName => {
    if (fileName.endsWith('.toml')) {
      const filePath = path.join(dirPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsedData = parseToml(fileContent);
      data[fileName.replace('.toml', '')] = parsedData;
    }
  });
  return data;
};

const convertAndMergeToml = () => {
  // Use absolute paths
  const structsDir = path.join(__dirname, '../openje-bs/structs');
  const functionsDir = path.join(__dirname, '../openje-bs/functions');
  const outputFilePath = path.join(__dirname, '../src/assets/openje-bs.json');

  try {
    const structsData = loadTomlFilesFromDirectory(structsDir);
    const functionsData = loadTomlFilesFromDirectory(functionsDir);
    const combinedData = {
      structs: structsData,
      functions: functionsData
    };
    fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2));
    console.log(`Combined JSON file created at ${outputFilePath}`);
  } catch (error) {
    console.error('Error converting and merging TOML files:', error);
  }
};

convertAndMergeToml();
