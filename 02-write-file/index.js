const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const readline = require('readline').createInterface({
  input: stdin,
  output: stdout
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'blacklist.txt'));

stdout.write('Введите свое имя! \n');

stdin.on('data', data => {
  writeStream.write(data);
});

readline.on('line', (input) => {
  if (input === 'exit') process.exit();
});

readline.on('error', () => {
  stdout.write('Ошибка!');
});

process.on('exit', () => {
  stdout.write('Поздравляю! Ваше имя записано в черный список!');
});