import { Stream } from "node:stream";

export interface Upload {

    filename: String;

    mimetype: string;

    encoding: String;

    createReadStream :() => Stream;

}

