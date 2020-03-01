import DateTools from '../utils/DateTools';
import RegraTipo from '../utils/RegraTipo';

export default class RegraDiario {
    public tipo: RegraTipo = RegraTipo.DIARIO;
    public horario: {
        inicio: string,
        termino: string,
    } = {
        inicio: DateTools.now(),
        termino: DateTools.now(),
    };

    constructor (horarioInicio: string, horarioFim: string) {
        this.horario.inicio = horarioInicio;
        this.horario.termino = horarioFim;
    }
};
