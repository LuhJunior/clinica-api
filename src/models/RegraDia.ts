import RegraDiario from './RegraDiario';
import RegraTipo from '../utils/RegraTipo';

export default class RegraDia extends RegraDiario {
    dia: Date;
    
    constructor (dia: Date, horarioInicio: string, horarioTermino: string) {
        super(horarioInicio, horarioTermino);
        this.tipo = RegraTipo.DIA;
        this.dia = dia;
    }
};
