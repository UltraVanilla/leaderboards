import { stat, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

async function tsvToJson(path) {
    if ((await stat(path)).isDirectory()) {
        await Promise.all((await readdir(path)).map((subdir) => tsvToJson(join(path, subdir))));
    } else if (path.endsWith(".tsv")) {
        const out = {
            name: path.replace(/\.tsv$/, "").replace("/", "."),
            scores: {},
            ranks: {}
        };
        for (const row of (await readFile(path)).toString().trim().split(/\r?\n/).slice(1)) {
            const [rank, username, score] = row.split(/\t|,|;/);
            out.scores[username] = +score;
            out.ranks[username] = +rank;
        }
        await writeFile(path.replace(/\.tsv$/, ".json"), JSON.stringify(out, null, 4));
    }
}

tsvToJson(".");
