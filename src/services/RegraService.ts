import RegraStore from '../data/RegraStore';
import RegraDiario from '../models/RegraDiario';
import RegraDia from '../models/RegraDia';
import RegraSemanal from '../models/RegraSemanal';

import RegraInterface from '../utils/RegraInterface';
import { RegraObj } from '../utils/RegraObj';

import getDia from '../utils/getDia';

import CustomError from '../utils/CustomError';

class RegraService {
    public async store (data: RegraObj): Promise<RegraInterface | null> {
        if (data.tipo === 'DIA') {
            // const dia = new Date(data.dia!.split('-').reverse());
            const diaArray = data.dia!.split('-').reverse();
            const dia = new Date(parseInt(diaArray[0]), parseInt(diaArray[1]), parseInt(diaArray[2]));
            return RegraStore.create(
                new RegraDia(dia, data.horario.inicio, data.horario.termino)
            );
        } else if (data.tipo === 'DIARIO') {
            return RegraStore.create(
                new RegraDiario(data.horario.inicio, data.horario.termino)
            );
        } else if (data.tipo === 'SEMANAL') {
            const dias = data.dias ? data.dias.map(e => getDia(e)) : [];
            if (!dias.find(e => e === -1) && dias?.length > 0) {
                return RegraStore.create(
                    new RegraSemanal(dias, data.horario.inicio, data.horario.termino)
                );
            } else {
                throw new CustomError(400, 'Dia inválido', true);
            }
        }
        return null;
    }

    public find (id: number): Promise<RegraInterface> {
        return RegraStore.getById(id);
    }

    public findAll (): Promise<RegraInterface[]> {
        return RegraStore.getAll();
    }

    public destroy (id: number): Promise<RegraInterface> {
        return RegraStore.delete(id);
    }
};

export default new RegraService();
