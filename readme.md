# Spread-API

Spread-API es una API para obtener los spread de un mercado en buda.com a partir de su API pública, también permite la creación de alarmas, su consulta y comparación con un valor spread de referencia opcional.

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Documentación API](#documentacion)

## Requisitos

- Necesitas tener npm instalado, o
- Necesitas tener docker instalado si prefieres utilizar el ambiente dockerizado

## Instalación

- npm
    - Ejecuta **npm install** en la carpeta raíz
    - (Opcional) Executa **npm test** para confirmar que todo esta ok
    - Ejecuta **npm start** para iniciar la aplicación en tu localhost

- Docker
    - Descarga la imagen disponible en https://drive.google.com/file/d/1jtGcKqMUbE7Tsg8v-mZjn_QufWsmM8yt/view?usp=sharing
    - En el directorio donde está la imagen ejecuta **docker load -i spread-api.tar**
    - Ejecuta docker run -p 3000:3000 spread-api

## Uso

Hay 4 endpoints disponibles

GET  /spread

Devuelve los spread de todos los mercados disponibles en buda.com

**Respuesta**
```
[
    {
        "marketId": "btc-clp",
        "value": 231654
    } ... 
] 
```

GET  /spread/:marketId

Devuelve los spread de un mercado específico

**Respuesta**
```
{
    "marketId": "btc-clp",
    "value": 231654
} 
```

POST /alert

Crea una alarma a partir de un marketId y un value

**Parámetros**
|Name|Required|Type|                                                                                                                                                      
| :----------|:--------|:-------|
|`marketId` | required | string  |
|`value` | required | number  | 

**Respuesta**
```
{
    "createdAt": "2024-05-30T23:30:48.614Z",
    "value": 2000000,
    "marketId": "btc-clp"
}
```

GET  /alert/:marketId

Devuelve la alerta actual del mercado indicado

**Respuesta**
```
{
    "createdAt": "2024-05-30T23:30:48.614Z",
    "value": 2000000,
    "marketId": "btc-clp"
}
```

permite un argumento adicional (ex: http://localhost:3000/alert/btc-clp?spread=1000000)

**Argumentos**
|Name|Required|Type|                                                                                                                                                      
| :----------|:--------|:-------|
|`spread` | optional | string  |

**Respuesta**
```
{
    "createdAt": "2024-05-30T23:30:48.614Z",
    "value": 2000000,
    "marketId": "btc-clp",
    "observation": "Spread 1000000 is lower than the current alert value"
}
```

Cada dato recibido es validado y manejado con errores descriptivos. 
Más información sobre cada endpoint disponible en http://localhost:3000/api-docs.

## Documentación

La API está documentada con swagger, una vez es levantado el servidor local es posible acceder a ella en http://localhost:3000/api-docs.
