import path from 'path';
import RegraService from '../../services/RegraService';
import JsonStore from '../../../utils/JsonStore';

import DateTools from '../../../utils/DateTools';


describe('regraService.test.ts', () => {
    beforeAll(async () => {
        try {
            JsonStore.insertJson(path.join(__dirname, '../../../data/store/data_test.json'), JSON.stringify([
                {
                    id: 1,
                    tipo: 0,
                    dia: '2020-03-01T03:00:00.000Z',
                    horario: {
                        inicio: '13:00',
                        termino: '14:00',
                    },
                },
                {
                    id: 2,
                    tipo: 1,
                    horario: {
                        inicio: '9:00',
                        termino: '10:00',
                    },
                },
                {
                    id: 3,
                    tipo: 2,
                    dias: [1, 2],
                    horario: {
                        inicio: '11:00',
                        termino: '12:00',
                    },
                }
            ]));
        } catch (e) {
            console.log('Ocorreu um erro ao tentar limpar o arquivo de armazenamento');
        }
    });

    afterAll(async () => {
        try {
            JsonStore.insertJson(path.join(__dirname, '../../../data/store/data_test.json'), '[]');
        } catch (e) {
            console.log('Ocorreu um erro ao tentar limpar o arquivo de armazenamento');
        }
    });

    describe('Função store', () => {
        it('Passando os dados corretos da regra DIA, deve a regra criada', async () => {
            const dia = new Date();
            const data = await RegraService.store({
                tipo: 'DIA',
                dia: DateTools.convert(dia),
                horario: {
                    inicio: '17:00',
                    termino: '20:00',
                },
            })
            expect(data!.horario.inicio).toEqual('17:00');
            expect(data!.horario.termino).toEqual('20:00');
        });

        it('Passando os dados corretos da regra DIARIO, deve a regra criada', async () => {
            const data = await RegraService.store({
                tipo: 'DIARIO',
                horario: {
                    inicio: '22:00',
                    termino: '23:00',
                },
            });
            expect(data!.horario.inicio).toEqual('22:00');
            expect(data!.horario.termino).toEqual('23:00');
        });

        it('Passando os dados corretos da regra DIARIO, deve a regra criada', async () => {
            const data = await RegraService.store({
                tipo: 'SEMANAL',
                dias: [
                    'SEGUNDA',
                    'TERCA',
                ],
                horario: {
                    inicio: '15:00',
                    termino: '16:00',
                },
            });
            expect(data!.horario.inicio).toEqual('15:00');
            expect(data!.horario.termino).toEqual('16:00');
        });

        it('Passando horarios que dão conflito, lançar um erro', async () => {
            await expect(RegraService.store({
                tipo: 'SEMANAL',
                dias: [
                    'SEGUNDA',
                    'TERCA',
                ],
                horario: {
                    inicio: '22:00',
                    termino: '23:00',
                },
            })).rejects.toThrow();
        });

        it('Passando horario termino menor que horario de inicio, lançar um erro', async () => {
            await expect(RegraService.store({
                tipo: 'SEMANAL',
                dias: [
                    'SEGUNDA',
                    'TERCA',
                ],
                horario: {
                    inicio: '23:00',
                    termino: '22:00',
                },
            })).rejects.toThrow();
        });

        it('Passando dia inexistente, lançar um erro', async () => {
            await expect(RegraService.store({
                tipo: 'SEMANAL',
                dias: [
                    'SEGUNDA',
                    'TERCA',
                    'SUNDAY',
                ],
                horario: {
                    inicio: '23:00',
                    termino: '22:00',
                },
            })).rejects.toThrow();
        });

        it('Passando uma data menor que a do dia atual, lançar um erro', async () => {
            const data = new Date();
            await expect(RegraService.store({
                tipo: 'DIA',
                    dia: DateTools.convert(data),
                    horario: {
                        inicio: '17:00',
                        termino: '20:00',
                    },
            })).rejects.toThrow();
        });

        it('Passando nao passando os dia em regra dia, lançar um erro', async () => {
            await expect(RegraService.store({
                tipo: 'DIA',
                horario: {
                    inicio: '17:00',
                    termino: '20:00',
                },
            })).rejects.toThrow();
        });

        it('Passando nao passando os dias em regra semanal, lançar um erro', async () => {
            await expect(RegraService.store({
                tipo: 'SEMANAL',
                horario: {
                    inicio: '22:00',
                    termino: '23:00',
                },
            })).rejects.toThrow();
        });
    });

    describe('Function findAll', () => {
        it('Deve retornar todas as regras', async () => {
            const data = await RegraService.findAll();
            expect(data.length).toBeGreaterThan(2);
        });
    });

    describe('Function find', () => {
        it('Passando id: 1 deve retornar a regra de id igual a 1', async () => {
            const data = await RegraService.find(1);
            expect(data.dia).toEqual('01-03-2020');
            expect(data.horario).toEqual({
                inicio: '13:00',
                termino: '14:00',
            });
        });

        it('Passando id inexistente deve retornar objeto vazio', async () => {
            const data = await RegraService.find(100);
            expect(data).toEqual({});
        });
    });

    describe('GET /api/regra/horarios', () => {
        it('Passando intervalo correto deve retornar os horarios disponiveis', async () => {
            const data = await RegraService.findByInterval('01-03-2020', '01-04-2020');
            expect(data.length).toBeGreaterThan(5);
        });

        it('Passando intervalo com a data final maior que a inicial, deve lançar um erro', async () => {
            await expect(RegraService.findByInterval('02-03-2020', '01-03-2020')).rejects.toThrow();
        });
    });

    describe('DELETE /api/regra/:id', () => {
        it('Com id igual 1 deve deletar a regra com id igual a 1 e retornar a regra', async () => {
            const data = await RegraService.destroy(1);
            expect(data).toEqual(expect.any(Object));
        });

        it('Passando id inexistente deve retornar objeto vazio, deve retornar status 200', async () => {
            const data = await RegraService.destroy(100);
            expect(data).toEqual({});
        });
    });
});
