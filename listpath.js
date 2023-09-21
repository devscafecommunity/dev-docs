const fs = require('fs');
const path = require('path');

const rootDirectory = './root'; // Replace with the root directory path of your repository
const jsonFilePath = 'paths.json';

function generatePathData(directoryPath) {
    const items = fs.readdirSync(directoryPath);

    const pathData = {
        directories: [],
        files: [],
    };

    for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            pathData.directories.push({
                name: item,
                path: itemPath,
                content: generatePathData(itemPath),
            });
        } else {
            pathData.files.push({
                name: item,
                path: itemPath,
            });
        }
    }

    return pathData;
}

const repositoryPathData = generatePathData(rootDirectory);

fs.writeFileSync(jsonFilePath, JSON.stringify(repositoryPathData, null, 2));

console.log(`JSON structure written to ${jsonFilePath}`);
