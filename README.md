# Clinica API
Uma API gerenciamento de horários de uma clínica.

## Compilação

Para compilar é necessário possuir o gerenciador de pacotes [**npm**](https://www.npmjs.com) ou [**yarn**](https://yarnpkg.com) 
e executará os seguintes comandos.
- npm i
- npm run build 
- npm start

## Rotas da API

* **POST** /regra
* **GET** /regra/:id
* **GET** /regra
* **GET** /regra/horarios
* **DELETE** /regra/:id

## Descrição das rotas

### ***Criação de regra***

**POST** /api/regra

```
body {
  tipo - uma string que pode ser "DIA", "DIARIO" ou "SEMANAL"
  dia - uma string no formato dd-mm-aaaa ou d-mm-aaa ou dd-m-aaaa ou d-m-aaaa
  dias - um array com strings podendo ser "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"
  horario: {
    inicio - uma string no formato  hh:mm ou h:mm
    termino - uma string no formato  hh:mm ou h:mm
  }
}
```

### ***Pegar todas as regras***

**GET** /api/regra


### ***Pegar uma regra***

**GET** /api/regra/:id

*id - inteiro*

### ***Pegar Horários disponíveis***

**GET** /api/regra/horarios

```
query {
  dataInicio - uma string no formato dd-mm-aaaa ou d-mm-aaa ou dd-m-aaaa ou d-m-aaaa
  dataFim - uma string no formato dd-mm-aaaa ou d-mm-aaa ou dd-m-aaaa ou d-m-aaaa
}
```

### ***Deletar uma regra***

**DELETE** /api/regra/:id

*id - inteiro*

## Exemplos de Request

### ***Criação de regra para um dia especifico***

**POST** /api/regra

***Body***

```
{
  "tipo": "DIA",
    "dia": "01-03-2020",
    "horario": {
      "inicio": "17:00",
      "termino": "20:00"
    }
}
```
***Retorno***

```
{
  "ok": true,
  "data": {
    "id": 1,
    "tipo": 0,
    "horario": {
      "inicio": "17:00",
      "termino": "20:00"
    },
    "dia": "2020-03-02T03:00:00.000Z"
  }
}
```
### ***Criação de regra para todos os dias***

**POST** /api/regra

***Body***

```
{
  "tipo": "DIARIO",
  "horario": {
    "inicio": "22:00",
    "termino": "23:00"
  }
}
```

***Retorno***

```
{
  "ok": true,
  "data": {
    "tipo": 1,
    "horario": {
      "inicio": "22:00",
      "termino": "23:00"
    },
    "id": 2
  }
}
```

### ***Criação de regra alguns dias da semana***

**POST** /api/regra

Body:

```
{
  "tipo": "SEMANAL",
  "dias": [
    "SEGUNDA",
    "TERCA"
  ],
  "horario": {
    "inicio": "15:00",
    "termino": "16:00"
  }
}
```

***Retorno***

```
{
  "ok": true,
  "data": {
    "tipo": 2,
    "horario": {
      "inicio": "15:00",
      "termino": "16:00"
    },
    "dias": [
      1,
      2
    ],
    "id": 3
  }
}
```

### ***Buscar todas as regras cadastradas***

**GET** /api/regra

Retorno:

```
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "tipo": "DIA",
      "horario": {
        "inicio": "17:00",
        "termino": "20:00"
      },
      "dia": "02-03-2020"
    },
    {
      "id": 2,
      "tipo": "DIARIO",
      "horario": {
        "inicio": "22:00",
        "termino": "23:00"
      }
    },
    {
      "id": 3,
      "tipo": "SEMANAL",
      "horario": {
        "inicio": "15:00",
        "termino": "16:00"
      },
      "dias": [
        "SEGUNDA",
        "TERCA"
      ]
    }
  ]
}
```

### ***Buscar uma regra cadastrada***

**GET** /api/regra/:id

*id = 3*

***Retorno***

```
{
  "ok": true,
  "data": {
    "id": 3,
    "tipo": "SEMANAL",
    "horario": {
      "inicio": "15:00",
      "termino": "16:00"
    },
    "dias": [
      "SEGUNDA",
      "TERCA"
    ]
  }
}
```

### ***Buscar Horários disponíveis***

**GET** /api/regra/horarios

***Query***

```
{
  "dataInicio": "01-03-2020",
  "dataFim": "01-03-2020"
}
```

***Retorno***

```
{
  "ok": true,
  "data": [
    {
      "day": "01-03-2020",
      "intervals": [
        {
          "start": "22:00",
          "end": "23:00"
        }
      ]
    }
  ]
}
```

### ***Deletar uma regra cadastrada***

**DELETE** /api/regra/

*id = 1*

***Retorno: regra deletada***

```
{
  "ok": true,
  "data": {
    "id": 1,
    "tipo": 0,
    "horario": {
      "inicio": "17:00",
      "termino": "20:00"
    },
    "dia": "2020-03-02T03:00:00.000Z"
  }
}
```
