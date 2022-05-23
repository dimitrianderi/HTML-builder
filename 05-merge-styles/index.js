const fs = require('fs');
const path = require('path');
const { stdout } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
  if (error !== null) {
    stdout.write('Ошибка! Директория styles не найдена.');
    process.exit();
  }
  files.forEach(el => {
    if (el.isFile() && path.extname(el.name) === '.css') {
      const readStream = fs.createReadStream(path.join(__dirname, 'styles', el.name), 'utf-8');
      readStream.pipe(writeStream);
    }
  });
  stdout.write('Сборка файла bundle.css прошла успешно!');
});