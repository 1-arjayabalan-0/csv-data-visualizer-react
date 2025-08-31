
import morgan from "morgan";
import path from "path";
import fs from "fs"

const logDirectory = path.join(process.cwd(), "logs")
if(!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), {flags: "a"});

export const logger = morgan("combined", {stream: accessLogStream})