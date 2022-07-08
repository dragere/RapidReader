import * as fs from "fs/promises";
import path from "path";

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
    }
}

async function run() {
    await fs.rm('./docs', { recursive: true, force: true })
    console.log("delete './docs'");

    await copyDir('./dist', './docs');
    console.log("copied './dist' to './docs'");

    const file = 'docs/index.html';
    const data = await fs.readFile(file, 'utf8');
    const result = data.replace(/(?<=<.*?(href|src)=")\/(.*)(?="\s?\/?>)/gm, '$2');

    await fs.writeFile('docs/index.html', result, 'utf8');

    console.log("processed " + file);
}



await run()