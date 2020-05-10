
import path from "path";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";


const adapter = new FileSync(path.join(__dirname, "../../db.json"));
const db = lowdb(adapter);

export {db}
