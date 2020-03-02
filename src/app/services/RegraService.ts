import RegraStore from '../../data/RegraStore';
import RegraDiario from '../models/RegraDiario';
import RegraDia from '../models/RegraDia';
import RegraSemanal from '../models/RegraSemanal';

import RegraInterface from '../../utils/RegraInterface';
import { RegraObj } from '../../utils/RegraObj';

import getDia from '../../utils/getDia';

import RegraTipo, { Tipos } from '../../utils/RegraTipo';
import { dias } from '../../utils/Dia';

import DateTools from '../../utils/DateTools';

import { hasConflictDia, hasConflictDiario, hasConflictSemanal } from '../../utils/intervalConflict';

import CustomError from '../../utils/CustomError';
import regra from '../../middlewares/validators/regra';

interface RegraResponse {
    id?: number;
    tipo?: string;
    horario?: {
        inicio: string,
        termino: string,
    };
    dia?: string;
    dias?: string[];
}

interface RegraIntervalResponse {
    day: string;
    intervals: { start: string, end: string }[];
}

class RegraService {
    public async store (data: RegraObj): Promise<RegraInterface | null> {
        if (data.horario.inicio > data.horario.termino) {
            throw new CustomError(400, 'O horario inicial não pode ser maior que o final', true);
        }

        if (data.tipo === 'DIA') {
            // const dia = new Date(data.dia!.split('-').reverse());
            const diaArray = data.dia?.split('-').reverse().map(e => parseInt(e));

            if (diaArray === undefined) {
                throw new CustomError(400, 'Formato do body para dia inválido', true);
            }

            const dia = new Date(diaArray[0], diaArray[1] - 1, diaArray[2]);

            if (dia.getTime() < new Date().setHours(0, 0, 0, 0)) {
                throw new CustomError(400, 'A data não pode ser menor do que a data de hoje', true);
            }

            const regra = new RegraDia(dia, data.horario.inicio, data.horario.termino);

            const conflito = await hasConflictDia(regra);
            if (conflito !== undefined) {
                throw new CustomError(
                    400,
                    `A regra não pode fazer conflito com outra existente: ${JSON.stringify(conflito)}`,
                    true,
                );
            }
            return RegraStore.create(regra);
        } else if (data.tipo === 'DIARIO') {
            const regra = new RegraDiario(data.horario.inicio, data.horario.termino);

            const conflito = await hasConflictDiario(regra);
            if (conflito !== undefined) {
                throw new CustomError(
                    400,
                    `A regra não pode fazer conflito com outra existente: ${JSON.stringify(conflito)}`,
                    true,
                );
            }

            return RegraStore.create(regra);
        } else if (data.tipo === 'SEMANAL') {
            const dias = data.dias?.map(e => getDia(e));

            if (dias === undefined) {
                throw new CustomError(400, 'Formato do body para dia inválido', true);
            }

            if (!dias.find(e => e === -1) && dias?.length > 0) {
                const regra = new RegraSemanal(dias, data.horario.inicio, data.horario.termino);
                
                const conflito = await hasConflictSemanal(regra);

                if (conflito !== undefined) {
                    throw new CustomError(
                        400,
                        `A regra não pode fazer conflito com outra existente: ${JSON.stringify(conflito)}`,
                        true,
                    );
                }

                return RegraStore.create(regra);
            } else {
                throw new CustomError(400, 'Dia inválido', true);
            }
        }
        return null;
    }

    public async find (id: number): Promise<RegraResponse> {
        const regra = await RegraStore.getById(id);
        if (regra) {
            return ({
                id: regra.id,
                tipo: Tipos[regra.tipo],
                horario: regra.horario,
                dia: regra.dia && DateTools.convert(new Date(regra.dia)),
                dias: regra.dias && regra.dias.map(e => dias[e]),
            });
        }
        return {};
    }

    public async findByInterval (dataInicio: string, dataFim: string): Promise<RegraIntervalResponse[]> {
        if (dataInicio.split('-').reverse().join('') > dataFim.split('-').reverse().join('')) {
            throw new CustomError(400, 'A data inicial não pode ser maior que a final', true);
        }
        
        const regras = await RegraStore.getAll();
        if (regras.length > 0) {
            return regras.reduce((horarios: RegraIntervalResponse[], regra) => {
                const dataInicioA = dataInicio.split('-').reverse().map(e => parseInt(e));
                const dataFimA = dataFim.split('-').reverse().map(e => parseInt(e));

                const inicioDate = new Date(dataInicioA[0], dataInicioA[1] - 1, dataInicioA[2]);
                const fimDate = new Date(dataFimA[0], dataFimA[1] - 1, dataFimA[2]);

                if (regra.tipo === RegraTipo.DIA) {
                    const regraDate = new Date(regra.dia!);

                    if (inicioDate.getTime() <= regraDate.getTime() && regraDate.getTime() <= fimDate.getTime()) {
                        const horario = horarios.find((value) => (
                            value.day === DateTools.convert(regraDate)
                        ));
                        if (horario) {
                            horario.intervals.push({
                                start: regra.horario.inicio,
                                end: regra.horario.termino,
                            });
                            horario.intervals.sort((hA, hB) => {
                                if (hA.start < hB.start) return -1;
                                if (hA.start > hB.start) return 1;
                                return 0;
                            });
                        } else {
                            horarios.push({
                                day: DateTools.convert(regraDate),
                                intervals: [{
                                    start: regra.horario.inicio,
                                    end: regra.horario.termino,
                                }],
                            });
                        }
                    }
                } else if (regra.tipo === RegraTipo.DIARIO) {
                    const day = inicioDate;
                    while (day.getTime() <= fimDate.getTime()) {
                        const horario = horarios.find((value) => (
                            value.day === DateTools.convert(day))
                        );
                        if (horario) {
                            horario.intervals.push({
                                start: regra.horario.inicio,
                                end: regra.horario.termino,
                            });
                            horario.intervals.sort((hA, hB) => {
                                if (hA.start < hB.start) return -1;
                                if (hA.start > hB.start) return 1;
                                return 0;
                            });
                        } else {
                            horarios.push({
                                day: DateTools.convert(day),
                                intervals: [{
                                    start: regra.horario.inicio,
                                    end: regra.horario.termino,
                                }],
                            });
                        }
                        day.setDate(day.getDate() + 1);
                    }
                } else if (regra.tipo === RegraTipo.SEMANAL) {
                    const day = inicioDate;
                    while (day.getTime() <= fimDate.getTime()) {
                        if (regra.dias?.includes(day.getDay())) {
                            const horario = horarios.find((value) => (
                                value.day === DateTools.convert(day))
                            );
                            if (horario) {
                                horario.intervals.push({
                                    start: regra.horario.inicio,
                                    end: regra.horario.termino,
                                });
                                horario.intervals.sort((hA, hB) => {
                                    if (hA.start < hB.start) return -1;
                                    if (hA.start > hB.start) return 1;
                                    return 0;
                                });
                            } else {
                                horarios.push({
                                    day: DateTools.convert(day),
                                    intervals: [{
                                        start: regra.horario.inicio,
                                        end: regra.horario.termino,
                                    }],
                                });
                            }
                        }
                        day.setDate(day.getDate() + 1);
                    }
                }
                return horarios;
            }, []);
        }
        return [];
    }

    public async findAll (): Promise<RegraResponse[]> {
        const regras = await RegraStore.getAll();
        if (regras.length > 0) {
            return regras.map((regra) => ({
                id: regra.id,
                tipo: Tipos[regra.tipo],
                horario: regra.horario,
                dia: regra.dia && DateTools.convert(new Date(regra.dia)),
                dias: regra.dias && regra.dias.map(e => dias[e]),
            }));
        }
        return [];
    }

    public destroy (id: number): Promise<RegraInterface | Object> {
        return RegraStore.delete(id);
    }
};

export default new RegraService();
