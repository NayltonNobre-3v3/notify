const DIR = "/mnt/fcir/sns";
const fs = require('fs-extra')
let sensors_monit = [];


const loop = () => {
  setTimeout(() => {
    listDirFiles(DIR)
      .then((arr) =>
        Promise.all(arr.map((item) => readFile(`${DIR}/${item}`)))
      )
      .then((arr) => (sensors_monit = arr))
      .catch((err) => console.log(err))
      .then(() => loop());
  }, 5000);
};

loop();

function listDirFiles (url)  {
  return new Promise((fullfill, reject) => {
    fs.readdir(url, (err, data) => (err ? reject(err) : fullfill(data)));
  });
};

function readFile (dir)  {
  return new Promise((fullfill, reject) => {
    fs.readFile(dir, "latin1", (err, data) =>
      err ? reject(err) : fullfill(data)
    );
  });
};
