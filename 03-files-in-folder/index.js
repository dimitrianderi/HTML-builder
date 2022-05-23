const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (error, files) => {
  if (error !== null) {
    stdout.write('Ошибка! Директория secret-folder не найдена.');
    process.exit();
  }
  files.forEach(el => {
    if (el.isFile()) {
      outputFile(el, path.join(__dirname, 'secret-folder', el.name));
    }
  });
});

function outputFile(el, put) {
  fs.stat(put, (err, stats) => {
    stdout.write(`${path.basename(el.name, path.extname(el.name))} - ${path.extname(el.name).slice(1)} - ${(stats.size / 1024).toFixed(3)} kb` + '\n');
  });
}