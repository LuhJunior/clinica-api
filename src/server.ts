import config from './config';
import app from './app';

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});
