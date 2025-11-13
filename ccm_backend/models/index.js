// index.js

const fs = require('fs');
const path = require('path');

// Get the current directory path
const modelsFolder = __dirname;

// Read the contents of the models folder
fs.readdir(modelsFolder, (err, files) => {
    if (err) {
        console.error('Error reading models folder:', err);
        return;
    }

    // Filter only the model files (assuming they have a .js extension)
    const modelFiles = files.filter(file => path.extname(file) === '.js');

    // Import and run each model file
    modelFiles.forEach((modelFile, index) => {
        try {
            const model = require(path.join(modelsFolder, modelFile));
            // console.log(`Running Model ${index + 1}: ${modelFile}`);
            // model.run(); // Assuming each model file has a run() function
        } catch (error) {
            console.error(`Error running Model ${index + 1}:`, error);
        }
    });
});
