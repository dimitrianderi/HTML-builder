const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const templates = [];
let i = 0;

fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (error, files) => {
  if (error !== null) {
    stdout.write('Ошибка! Директория components не найдена.');
    process.exit();
  }
  files.forEach(el => {
    if (el.isFile() && path.extname(el.name) === '.html') {
      templates.push(path.basename(el.name, path.extname(el.name)));
    }
  });
});

fs.mkdir(path.join(__dirname, 'project-dist'), () => { });

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (error, data) => {
  if (error !== null) {
    stdout.write('Ошибка! Файл template.html не найден!');
    process.exit();
  }
  changeTemplate(data);
});

const writeTemplate = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

const changeTemplate = (data, el = templates[0]) => {
  fs.readFile(path.join(__dirname, 'components', `${el}.html`), 'utf-8', (error, fragment) => {
    if (error !== null) {
      stdout.write('Ошибка! Директория components не найдена.');
      process.exit();
    }
    const fr = `{{${el}}`;
    data = data.replace(fr, fragment);
    i++;
    (i === templates.length) ? writeTemplate.write(data) : changeTemplate(data, templates[i]);
  });
};

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => { });

const enumeration = (folder, destination) => {
  fs.readdir(path.join(__dirname, folder), { withFileTypes: true }, (error, files) => {
    if (error !== null) {
      stdout.write('Ошибка! Директория assets не найдена.');
      process.exit();
    }
    files.forEach(el => {

      if (el.isFile()) {
        fs.copyFile(path.join(__dirname, folder, el.name), path.join(__dirname, destination, el.name), err => {
          if (err) stdout.write('При сборке проекта возникла ошибка!');
        });
      } else {
        fs.mkdir(path.join(__dirname, destination, el.name), () => { });
        enumeration(`${folder}/${el.name}`, `${destination}/${el.name}`);
      }

    });
  });
};
enumeration('assets', 'project-dist/assets');

const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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
  stdout.write('Проект успешно собран!');
});