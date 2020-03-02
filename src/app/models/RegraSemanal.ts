import RegraDiario from './RegraDiario';
import Dia from '../../utils/Dia';
import RegraTipo from '../../utils/RegraTipo';

export default class RegraSemanal extends RegraDiario {
    public dias: Dia[];
    
    constructor (dias: Dia[], horarioInicio: string, horarioTermino: string) {
        super(horarioInicio, horarioTermino);
        this.dias = dias;
        this.tipo = RegraTipo.SEMANAL;
    }
};
