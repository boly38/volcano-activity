import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';

function isSet(variable) {
    return (variable !== undefined && variable !== null);
}

function isNotEmpty(variable) {
    return isSet(variable) && variable !== '';
}
function loadJsonFile(filePath) {
    try {
        // Read the JSON file synchronously
        const rawData = readFileSync(filePath, 'utf8');

        // Parse the JSON data and return it
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
        return null;
    }
}

function readJsonFilesFromDirectory(directoryPath) {
    try {
        // Read the list of files in the directory
        const files = readdirSync(directoryPath);

        // Initialize the resulting array
        const resultArray = [];

        // Iterate through each file
        files.forEach(file => {
            // Check if the file has the ".json" extension
            if (file.endsWith('.json')) {
                // Build the full path of the file
                const filePath = join(directoryPath, file);

                try {
                    // Read the content of the file
                    const rawData = readFileSync(filePath, 'utf8');

                    // Parse the JSON and add each object to the result with the "file" attribute
                    const jsonObjects = JSON.parse(rawData);
                    jsonObjects.forEach(obj => {
                        obj.file = file;
                        resultArray.push(obj);
                    });
                } catch (error) {
                    console.error(`Error reading file ${file}: ${error.message}`);
                }
            }
        });

        return resultArray;
    } catch (error) {
        console.error(`Error reading directory ${directoryPath}: ${error.message}`);
        return [];
    }
}

// Export the function to be used in other modules
export {isSet, isNotEmpty, loadJsonFile, readJsonFilesFromDirectory};