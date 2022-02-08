const path = require("path");
const fs = require("fs");

const TYPES = [
    "broken", "crafted", "custom", "dropped", "killed",
    "killed_by", "mined", "picked_up", "used"
];

async function main() {
    let files = (await Promise.all(TYPES.map(subdir => getFiles(subdir)))).flat();

    const tasks = files
        .filter(originalPath => originalPath.endsWith(".tsv"))
        .map(originalPath => ({
            originalPath,
            newPath: originalPath.replace(/\.tsv|\.csv|\.ssv$/, ".json"),
            name: originalPath.replace(/\.tsv|\.csv|.ssv$/, "").replaceAll(/\//g, ".")
        }));

    for (const task of tasks) {
        const tsv = await fs.promises.readFile(task.originalPath, "utf-8");

        const out = {
            name: task.name,
            scores: {},
            ranks: {},
        }

        for (const row of tsv.trim().split(/\r?\n/).slice(1)) {
            const columns = row.split(/\t|,|;/);

            out.scores[columns[1]] = parseInt(columns[2]);
            out.ranks[columns[1]] = parseInt(columns[0]);
        }
        await fs.promises.writeFile(task.newPath, JSON.stringify(out, null, 4));
    }

}


async function getFiles(dir) {
    let subdirs = await fs.promises.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = dir + "/" + subdir;
        return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

main();
