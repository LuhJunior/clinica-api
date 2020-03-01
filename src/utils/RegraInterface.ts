import RegraTipo from './RegraTipo';
import Dia from './Dia';

export default interface RegraInterface {
    id: number;
    tipo: RegraTipo;
    horario: {
        inicio: string,
        termino: string,
    };
    dia?: Date;
    dias?: Dia[];
};
