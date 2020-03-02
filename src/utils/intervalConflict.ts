import RegraStore from '../data/RegraStore';
import RegraDia from '../app/models/RegraDia';
import RegraDiario from '../app/models/RegraDiario';
import RegraSemanal from '../app/models/RegraSemanal';
import RegraTipo from '../utils/RegraTipo';
import RegraInterface from '../utils/RegraInterface';

const hasConflict = (regra1: RegraDiario, regra2: RegraDiario): boolean => (
    (regra2.horario.inicio <= regra1.horario.inicio
        && regra1.horario.inicio < regra2.horario.termino)
    || (regra2.horario.inicio < regra1.horario.termino
        && regra1.horario.termino <= regra2.horario.termino)
);

export const hasConflictDia = async (regra: RegraDia): Promise<RegraInterface | undefined> => {
    const data = await RegraStore.getAll();
    return (data.find((value) => {
        if (value.tipo === RegraTipo.DIA) {
            if (new Date(value.dia!).getTime() === regra.dia.getTime()) {
                return hasConflict(regra, value);
            }
            return false;
        } else if (value.tipo === RegraTipo.DIARIO) {
            return hasConflict(regra, value);
        } else if (value.tipo === RegraTipo.SEMANAL) {
            const conflict = value.dias?.find((dia) => {
                if (dia === regra.dia.getDay()) {
                    return hasConflict(regra, value);
                }
                return false;
            });
            return (conflict !== undefined);
        }
        return false;
    }));
};

export const hasConflictDiario = async (regra: RegraDiario): Promise<RegraInterface | undefined> => {
    const data = await RegraStore.getAll();
    return (data.find((value) => hasConflict(regra, value)));
};

export const hasConflictSemanal = async (regra: RegraSemanal): Promise<RegraInterface | undefined> => {
    const data = await RegraStore.getAll();
    return (data.find((value) => {
        if (value.tipo === RegraTipo.DIA) {
            const conflict = regra.dias.find((dia) => {
                if (dia === new Date(value.dia!).getDay()) {
                    return hasConflict(regra, value);
                }
                return false;
            });
            return (conflict !== undefined);
        } else if (value.tipo === RegraTipo.DIARIO) {
            return hasConflict(regra, value);
        } else if (value.tipo === 2) {
            const conflict = value.dias?.find((dia) => {
                if (regra.dias.includes(dia)) {
                    return hasConflict(regra, value);
                }
                return false;
            });
            return (conflict !== undefined);
        }
    }));
};
