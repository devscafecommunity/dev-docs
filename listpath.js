const fs = require('fs');
const path = require('path');

const rootDirectory = './root'; // Replace with the root directory path of your repository
const jsonFilePath = 'paths.json';

/*
{
  "directories": [
    {
      "name": "history",
      "path": "root\\history",
      "content": {
        "directories": [],
        "files": [
          {
            "name": "test.txt",
            "path": "root\\history\\test.txt",
            "lastModified": "2021-03-02T14:00:00.000Z", // This is made by the system when the script is run
            "emmiter": "John Doe" // <- This is the author of the commit
            "revision": "1" // <- This is the revision number of the commit
            "description": "This is the description for the file" // <- This is the description written for metadata
            "tags": ["tag1", "tag2"] // <- These are the tags written for metadata
          }
        ]
      }
    }
  ],
  "files": []
}
*/ 
function getLocalRepoData(){
    let data = require('./package.json');
    return data;
}

function makeFile( name, path ){
    let file = {
        name: name,
        path: path,
        lastModified: new Date(),
        emmiter: getLocalRepoData().author,
        revision: 0,
        description: "",
        tags: [],
    }
    return file;
}

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
                ...makeFile(item, itemPath),
            });
        }
    }

    return pathData;
}

const repositoryPathData = generatePathData(rootDirectory);

fs.writeFileSync(jsonFilePath, JSON.stringify(repositoryPathData, null, 2));

console.log(`JSON structure written to ${jsonFilePath}`);
