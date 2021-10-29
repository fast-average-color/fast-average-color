import process from 'process';
import fs from 'fs';

function addCopyright(file) {
    const text = `/*! Fast Average Color | © ${new Date().getFullYear()} Denis Seleznev | MIT License | https://github.com/fast-average-color/fast-average-color */\n`;

    fs.writeFileSync(file, text + fs.readFileSync(file, 'utf-8'), 'utf-8');
}

for (let i = 2; i < process.argv.length; i++) {
    addCopyright(process.argv[i]);
}
