import path from 'path';
import request from 'supertest';
import app from '../../../app';
import JsonStore from '../../../utils/JsonStore';
import DateTools from '../../../utils/DateTools';


describe('regraController.test.ts', () => {
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

    describe('POST /api/regra', () => {
        it('Passando os dados corretos da regra DIA, deve retornar status 200', async () => {
            const data = new Date();
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    dia: DateTools.convert(data),
                    horario: {
                        inicio: '17:00',
                        termino: '20:00',
                    },
                });
            expect(res.status).toBe(200);
            expect(res.body.ok).toEqual(true);
        });

        it('Passando os dados corretos da regra DIARIO, deve retornar status 200', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIARIO',
                    horario: {
                        inicio: '22:00',
                        termino: '23:00',
                    },
                });
            expect(res.status).toBe(200);
            expect(res.body.ok).toEqual(true);
        });

        it('Passando os dados corretos da regra DIARIO, deve retornar status 200', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
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
            expect(res.status).toBe(200);
            expect(res.body.ok).toEqual(true);
        });

        it('Passando horarios que dão conflito, deve retornar status 400', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'SEMANAL',
                    dias: [
                        'SEGUNDA',
                        'TERCA',
                    ],
                    horario: {
                        inicio: '22:00',
                        termino: '23:00',
                    },
                });
            expect(res.status).toBe(400);
        });

        it('Passando horario termino menor que horario de inicio, deve retornar status 400', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'SEMANAL',
                    dias: [
                        'SEGUNDA',
                        'TERCA',
                    ],
                    horario: {
                        inicio: '23:00',
                        termino: '22:00',
                    },
                });
            expect(res.status).toBe(400);
        });

        it('Passando dia inexistente, deve retornar status 400', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
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
                });
            expect(res.status).toBe(400);
        });

        it('Passando uma data menor que a do dia atual, deve retornar status 400', async () => {
            const data = new Date();
            data.setDate(data.getDate() - 2);
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    dia: DateTools.convert(data),
                    horario: {
                        inicio: '17:00',
                        termino: '20:00',
                    },
                });
            expect(res.status).toBe(400);
        });

        it('Passando nao passando os dia em regra dia, deve retornar status 400', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    horario: {
                        inicio: '17:00',
                        termino: '20:00',
                    },
                });
            expect(res.status).toBe(400);
        });

        it('Passando nao passando os dias em regra semanal, deve retornar status 400', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'SEMANAL',
                    horario: {
                        inicio: '22:00',
                        termino: '23:00',
                    },
                });
            expect(res.status).toBe(400);
        });

        it('Passando tipo inexistente, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'SEMANA',
                    dias: [
                        'SEGUNDA',
                        'TERCA',
                    ],
                    horario: {
                        inicio: '22:00',
                        termino: '23:00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando formato de hora invalido, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'SEMANA',
                    dias: [
                        'SEGUNDA',
                        'TERCA',
                    ],
                    horario: {
                        inicio: '22:0',
                        termino: ':00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando nao passando tipo, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    horario: {
                        inicio: '22:00',
                        termino: '23:00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando nao passando termino de horario, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    horario: {
                        inicio: '22:00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando nao passando inicio de horario, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    horario: {
                        termino: '22:00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando formato de data inválido, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: 'DIA',
                    dia: '2019-02-20',
                    horario: {
                        inicio: '17:00',
                        termino: '20:00',
                    },
                });
            expect(res.status).toBe(422);
        });

        it('Passando campos vazios, deve retornar status 422', async () => {
            const res = await request(app)
                .post('/api/regra')
                .send({
                    tipo: '',
                    dia: '',
                    dias: [],
                    horario: {
                        inicio: '',
                        termino: '',
                    },
                });
            expect(res.status).toBe(422);
        });
    });

    describe('GET /api/regra', () => {
        it('Deve retornar as regras criadas, deve retornar status 200', async () => {
            const res = await request(app).get('/api/regra');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(2);
        });
    });

    describe('GET /api/regra/:id', () => {
        it('Passando id: 1 deve retornar a regra de id igual a 1, deve retornar status 200', async () => {
            const res = await request(app).get('/api/regra/1');
            expect(res.status).toBe(200);
            expect(res.body.data.dia).toEqual('01-03-2020');
            expect(res.body.data.horario).toEqual({
                inicio: '13:00',
                termino: '14:00',
            });
        });

        it('Passando id inexistente deve retornar objeto vazio, deve retornar status 200', async () => {
            const res = await request(app).get('/api/regra/100');
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({});
        });
    });

    describe('GET /api/regra/horarios', () => {
        it('Passando intervalo correto deve retornar os horarios disponiveis, deve retornar status 200', async () => {
            const res = await request(app).get('/api/regra/horarios').query({
                dataInicio: '01-03-2020',
                dataFim: '01-04-2020',
            });
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(5);
        });

        it('Passando intervalo com a data final maior que a inicial, deve retornar status 400', async () => {
            const res = await request(app).get('/api/regra/horarios').query({
                dataInicio: '02-03-2020',
                dataFim: '01-03-2020',
            });
            expect(res.status).toBe(400);
        });

        it('Passando intervalo com a data com formato inválido, deve retornar status 422', async () => {
            const res = await request(app).get('/api/regra/horarios').query({
                dataInicio: '2010-03-20',
                dataFim: '2015-03-02',
            });
            expect(res.status).toBe(422);
        });

        it('Passando campos vazios, deve retornar status 422', async () => {
            const res = await request(app).get('/api/regra/horarios').query({
                dataInicio: '',
                dataFim: '',
            });
            expect(res.status).toBe(422);
        });
    });

    describe('DELETE /api/regra/:id', () => {
        it('Com id igual 1 deve deletar a regra com id igual a 1 e retornar a regra, deve retornar status 200', async () => {
            const res = await request(app).delete('/api/regra/1');
            expect(res.status).toBe(200);
            expect(res.body.data.dia).toEqual('2020-03-01T03:00:00.000Z');
            expect(res.body.data.horario).toEqual({
                inicio: '13:00',
                termino: '14:00',
            });
        });

        it('Passando id inexistente deve retornar objeto vazio, deve retornar status 200', async () => {
            const res = await request(app).delete('/api/regra/100');
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({});
        });
    });

});
