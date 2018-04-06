const fs = require('fs');
const Color = require('color');
const testColors = require('./colors.json');
const template = fs.readFileSync('./template.html', 'utf8');

function getSquare(color, isLong) {
    return `<div class="color" style="width: ${isLong ? 200 : 100}px; background: rgb(${color})"></div>`;
}

function getSimpleAverageColor(color1, color2) {
    function getItem(num) {
        return Math.round((color1[num] + color2[num]) / 2);
    }

    return [
        getItem(0),
        getItem(1),
        getItem(2)
    ];
}

function getSqrtAverageColor(color1, color2) {
    function getItem(num) {
        return Math.round(Math.sqrt((color1[num] * color1[num] + color2[num] * color2[num]) / 2));
    }

    return [
        getItem(0),
        getItem(1),
        getItem(2)
    ];
}

function getLabAverageColor(lab1, lab2) {
    function getItem(num) {
        return (lab1[num] + lab2[num]) / 2;
    }

    const rgb = Color.lab(
        getItem(0),
        getItem(1),
        getItem(2)
    ).rgb().array();

    return [
        Math.round(rgb[0]),
        Math.round(rgb[1]),
        Math.round(rgb[2])
    ];
}

function printColor(rgb, lab) {
    let text = '';

    text += 'rgb: ' + rgb + '<br/>';
    if (lab) {
        text += 'lab: ' + lab.map(item => item.toFixed(1));
    }

    return text;
}

const content = testColors.map(function(item, i) {
    const color1 = Color(item[0]);
    const color2 = Color(item[1]);
    const rgb1 = color1.rgb().array();
    const rgb2 = color2.rgb().array();
    const lab1 = color1.lab().array();
    const lab2 = color2.lab().array();
    const simpleAverage = getSimpleAverageColor(rgb1, rgb2);
    const sqrtAverage = getSqrtAverageColor(rgb1, rgb2);
    const labAverage = getLabAverageColor(lab1, lab2);
    return `\n<tr><td class="num">${i + 1}.</td>
    <td>${getSquare(rgb1, true)}${printColor(rgb1, lab1)}</td>
    <td>${getSquare(simpleAverage)}${printColor(simpleAverage)}</td>
    <td>${getSquare(sqrtAverage)}${printColor(sqrtAverage)}</td>
    <td>${getSquare(labAverage)}${printColor(labAverage)}</td>
    <td>${getSquare(rgb2, true)}${printColor(rgb2, lab2)}</td>
    </tr>`;
}).join('');

fs.writeFileSync('index.html', template.replace(/\{\{content\}\}/, content));
