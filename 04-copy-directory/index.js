const fs = require('fs');
const path = require('path');
const { stdout } = process;


fs.rmdir(path.join(__dirname, 'files-copy'), { recursive: true }, () => {
  createFolder();
});

const createFolder = () => {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, () => {
    copyFiles();
  });
};

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (error, files) => {
    if (error !== null) {
      stdout.write('Ошибка! Директория files не найдена.');
      process.exit();
    }
    files.forEach(el => {
      if (el.isFile()) {
        fs.copyFile(path.join(__dirname, 'files', el.name), path.join(__dirname, 'files-copy', el.name), err => {
          if (err) stdout.write('При сборке проекта возникла ошибка!');
        });
      }
    });
    stdout.write('Копирование файлов успешно завершено!');
  });
};