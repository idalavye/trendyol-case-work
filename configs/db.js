const fs = require("fs");
const path = require("path");

const p = pathName => {
  let environment;
  if (process.env.NODE_ENV === "test") {
    environment = "test";
  } else {
    environment = "dev";
  }

  return path.join(
    path.dirname(process.mainModule.filename),
    "data",
    environment,
    `${pathName}.json`
  );
};

exports.readFile = path => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.readFile(p(path), (err, fileContent) => {
        if (err) {
          reject(err);
        }
        try {
          resolve(JSON.parse(fileContent));
        } catch (error) {
          resolve([]);
        }
      });
    }, 50);
  });
  return promise;
};

exports.writeFile = (path, payload) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(p(path), JSON.stringify(payload), err => {});
    resolve();
  });
  return promise;
};
