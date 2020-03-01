export type RegraObj = {
    tipo: string,
    horario: {
        inicio: string,
        termino: string,
    };
    dia?: string;
    dias?: string[];
};
