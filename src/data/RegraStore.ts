import path from 'path';
import JsonStore from '../utils/JsonStore';
import RegraInterface from '../utils/RegraInterface';
import config from '../config';

class RegraStore {
    path: string;

    constructor (path: string) {
        this.path = path;
    }

    create = async (regra: Object): Promise<RegraInterface> => {
        const data = JSON.parse(await JsonStore.getJson(this.path) || '[]');

        if (data.length > 0) {
            const id = data[data.length - 1].id + 1;
            return JSON.parse(
                await JsonStore.insertJson(this.path, JSON.stringify([...data, { ...regra, id }]))
            )[data.length];
        }

        return JSON.parse(
            await JsonStore.insertJson(this.path, JSON.stringify([{ id: 1, ...regra }])),
        )[0];
    };

    getById = async (id: number): Promise<RegraInterface> => {
        const data = JSON.parse(await JsonStore.getJson(this.path));
        return data.find((regra: RegraInterface) => regra.id === id);
    }

    getAll = async (): Promise<RegraInterface[]> => {
        return JSON.parse(await JsonStore.getJson(this.path));
    }

    delete = async (id: number): Promise<RegraInterface | Object> => {
        const data = JSON.parse(await JsonStore.getJson(this.path));
        const index = data.findIndex((regra: RegraInterface) => regra.id === id);
        if (index !== -1) {
            const regraRemovida = data.splice(data.findIndex((regra: RegraInterface) => regra.id === id), 1);
            await JsonStore.insertJson(this.path, JSON.stringify(data));
            return regraRemovida[0];
        }
        return {};
    }
};

export default new RegraStore(path.join(__dirname, config.env === 'test' ? '/store/data_test.json' : '/store/data.json'));
