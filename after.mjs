import * as fs from 'fs'

import glob from "tiny-glob";

import path from "path";
import {parse} from "node-html-parser";

if (fs.existsSync('./dist/index.html')) {
    fs.writeFileSync(
        './dist/index.html',
        new Buffer(fs.readFileSync('./dist/index.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}

if (fs.existsSync('./dist/mobile.html')) {
    fs.writeFileSync(
        './dist/mobile.html',
        new Buffer(fs.readFileSync('./dist/mobile.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}
if (fs.existsSync('./dist/panel.html')) {
    fs.writeFileSync(
        './dist/panel.html',
        new Buffer(fs.readFileSync('./dist/panel.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}

if (fs.existsSync('./dist/overlay.html')) {
    fs.writeFileSync(
        './dist/overlay.html',
        new Buffer(fs.readFileSync('./dist/overlay.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}

if (fs.existsSync('./dist/config.html')) {
    fs.writeFileSync(
        './dist/config.html',
        new Buffer(fs.readFileSync('./dist/config.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}

if (fs.existsSync('./dist/overlay-config.html')) {
    fs.writeFileSync(
        './dist/overlay-config.html',
        new Buffer(fs.readFileSync('./dist/overlay-config.html').toString()
            .replaceAll('/assets/', './assets/')
            .replaceAll('component-url="./assets/', 'component-url="./')
            .replaceAll('renderer-url="./assets/', 'renderer-url="./')
        ),
    )
}

// fs.writeFileSync('./dist/mobile.html', new Buffer(content.replace('DESKTOP', 'MOBILE')))


function hash(value) {
    let hash = 5381;
    let i = value.length;
    while (i) hash = (hash * 33) ^ value.charCodeAt(--i);
    return (hash >>> 0).toString(36);
}

async function removeInlineScriptAndStyle(directory) {
    console.log('Removing Inline Scripts and Styles');
    const scriptRegx = /<script[^>]*>([\s\S]+?)<\/script>/g;
    const styleRegx = /<style[^>]*>([\s\S]+?)<\/style>/g;
    const files = await glob('**/*.html', {
        cwd: directory,
        dot: true,
        aboslute: true,
        filesOnly: true,
    });

    console.log(`Found ${files.length} files`);

    for (const file of files.map((f) => path.join(directory, f))) {
        if (file.includes('test')) {
            continue
        }
        const name = path.basename(file).replaceAll('.html', '');
        console.log(`Edit file: ${file}, ${name}`);
        let f = fs.readFileSync(file, {encoding: 'utf-8'});
        const root = parse(f)
        const scripts = root.querySelectorAll('script')
        const styles = root.querySelectorAll('style')

        // console.log(scripts)
        for (const script of scripts) {
            if (script.parentNode.rawTagName !== 'body') {
                continue
            }
            const content = script.innerHTML
            const h = hash(content)
            const newScriptFileName = `${name}-main-script-${h}.js`
            const scriptTag = `<script type="module" crossorigin src="./assets/${newScriptFileName}"></script>`
            f = f.replaceAll(script.toString(), scriptTag)
            fs.writeFileSync(`./dist/assets/${newScriptFileName}`, content)
        }

        for (const style of styles) {
            if (style.parentNode.rawTagName !== 'body') {
                continue
            }
            const content = style.innerHTML
            const h = hash(content)
            const newStyleFileName = `${name}-main-style-${h}.css`
            const styleTag = `<link rel="stylesheet" src="./assets/${newStyleFileName}">`
            f = f.replaceAll(style.toString(), styleTag)
            fs.writeFileSync(`./dist/assets/${newStyleFileName}`, content)
        }


        fs.writeFileSync(file, f);
    }
}

// recursively replace all instances of "/assets/JingleJam with "./assets/JingleJam in all files
function replaceAssetPath(directory) {
    const files = fs.readdirSync(directory)
    for (const file of files) {
        const filePath = path.join(directory, file)
        if (fs.statSync(filePath).isDirectory()) {
            replaceAssetPath(filePath)
        } else {
            const content = fs.readFileSync(filePath, {encoding: 'utf-8'})
            if (content.includes('/assets/JingleJam')) {
                console.log(`Replacing Asset Path in ${filePath}`)
            }
            fs.writeFileSync(filePath, content.replaceAll('/assets/JingleJam', './assets/JingleJam'))
        }
    }
}

async function findJingleJamPng(directory) {
    // find all png files that names contain "JingleJam"
    const files = await glob('**/*.png', {
        cwd: directory,
        dot: true,
        aboslute: true,
        filesOnly: true,
    });
    const blackPath = files.filter(f => f.includes('Black')).at(0)
    const bluePath = files.filter(f => f.includes('Blue')).at(0)
    const redPath = files.filter(f => f.includes('Red')).at(0)
    const redFileName = path.basename(redPath)
    const blueFileName = path.basename(bluePath)
    const blackFileName = path.basename(blackPath)
    // delete files
    fs.unlinkSync('./dist/' + blackPath)
    fs.unlinkSync('./dist/' + bluePath)
    fs.unlinkSync('./dist/' + redPath)
    // copy the JingleJam files from ./src/assets to ./dist/assets and rename them
    const newRed = './src/assets/JingleJam_Red.png'
    const newBlue = './src/assets/JingleJam_Blue.png'
    const newBlack = './src/assets/JingleJam_Black.png'
    fs.copyFileSync(newRed, `./dist/assets/${redFileName}`)
    fs.copyFileSync(newBlue, `./dist/assets/${blueFileName}`)
    fs.copyFileSync(newBlack, `./dist/assets/${blackFileName}`)
}

removeInlineScriptAndStyle('./dist')
replaceAssetPath('./dist')
findJingleJamPng('./dist')
