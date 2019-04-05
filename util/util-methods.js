const readln = require("readline");

const cl = readln.createInterface(process.stdin, process.stdout);

exports.question = function(q) {
  return new Promise((res, rej) => {
    cl.question(q, answer => {
      res(answer);
    });
  });
};

exports.asyncForEach = async (array,callback) => {
  for(let index = 0; index < array.length; index ++){
    await callback(array[index],index,array);
  }
}

