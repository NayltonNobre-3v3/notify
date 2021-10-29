import fs from 'fs-extra'
async function organizeRoute(rootDir, folder) {
    const files = await fs.readdir(`${rootDir}/${folder}`)
    return {
        [folder]: files
    }
}

function readAllFiles(rootDir, folders) {
    return Promise.all(folders.map(async folder => {
        let [path] = Object.keys(folder)
        let [files] = Object.values(folder)
        let formatFiles = await Promise.all(files.map(file => readFile(`${rootDir}/${path}/${file}`)))

        return {
            [path]: formatFiles
        }
    }))
}
function organizeFiles(array) {
    let format = {}
    for (let obj of array) {
        for (let [key, value] of Object.entries(obj)) {
            Object.assign(format, { [key]: value })
        }
    }
    return format
}
function readFile(dir) {
    return new Promise((fullfill, reject) => {
        fs.readFile(dir, "latin1", (err, data) =>
            err ? reject(err) : fullfill(JSON.parse(data))
        );
    });
}
function readAllDirs(rootDir, folders) {
    return Promise.all(folders.map(folder => organizeRoute(rootDir, folder)))
        .then(files => readAllFiles(rootDir, files))
        .then(array => organizeFiles(array))
}
export {
    readAllDirs
}