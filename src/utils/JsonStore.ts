import fs from 'fs';

abstract class JsonStore {
    static insertJson = (path: string, data: string): Promise<string> => new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });

    static getJson = (path: string): Promise<string> => new Promise((resolve, reject) => {
        fs.exists(path, (exists) => {
            if (exists) {
                fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
                    if (err) return reject(err);
                    if (data.length > 0) return resolve(data.toString());
                    return resolve("[]");
                });
            } else {
                return resolve("[]");
            }
        });
    });
};

export default JsonStore;
