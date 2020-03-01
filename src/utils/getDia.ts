import Dia, { dias } from './Dia';

export default (dia: string): Dia => {
    return dias.indexOf(dia);
};
