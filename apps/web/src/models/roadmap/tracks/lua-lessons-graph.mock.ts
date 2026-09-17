import { GraphDataset } from '../roadmap-graph.types';

// Generado desde content/languages/lua/modules/*/module.json — no editar a mano.
export const LUA_LESSONS: Record<string, GraphDataset> = {
  "lua-fundamentos-de-lua": {
    "sectorTitle": "LUA · FUNDAMENTOS DE LUA",
    "progressPercent": 0,
    "nodes": [
      {
        "id": "lua-fundamentos-de-lua-s1",
        "code": "S1",
        "label": "¿QUÉ ES LUA Y DÓNDE SE USA?",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 100,
        "y": 310,
        "variant": "active",
        "iconType": "brackets",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "ACTIVO • EN PROGRESO",
        "isUnlocked": true
      },
      {
        "id": "lua-fundamentos-de-lua-s2",
        "code": "S2",
        "label": "CÓMO SE ORGANIZA Y PRUEBA TU CÓDIG",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 219,
        "y": 444,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S1",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s3",
        "code": "S3",
        "label": "TU PRIMER PRINT",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 338,
        "y": 431,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S2",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s4",
        "code": "S4",
        "label": "COMENTARIOS",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 456,
        "y": 286,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S3",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s5",
        "code": "S5",
        "label": "ARCHIVOS .LUA",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 575,
        "y": 167,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S4",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s6",
        "code": "S6",
        "label": "EJECUTAR CÓDIGO",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 694,
        "y": 204,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S5",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s7",
        "code": "S7",
        "label": "PALABRAS QUE LUA YA USA Y CÓMO ESC",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 813,
        "y": 357,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S6",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s8",
        "code": "S8",
        "label": "KIT PARA ENTENDER ERRORES",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 931,
        "y": 458,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S7",
        "isUnlocked": false
      },
      {
        "id": "lua-fundamentos-de-lua-s9",
        "code": "S9",
        "label": "CHECKPOINT Y PROYECTO INTEGRADOR",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 1050,
        "y": 398,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S8",
        "isUnlocked": false
      }
    ],
    "connections": [
      {
        "id": "c-lua-fundamentos-de-lua-s1-s2",
        "fromId": "lua-fundamentos-de-lua-s1",
        "toId": "lua-fundamentos-de-lua-s2",
        "color": "#8FA8FF",
        "path": "M 100 310 C 159.5 310, 159.5 444, 219 444"
      },
      {
        "id": "c-lua-fundamentos-de-lua-s2-s3",
        "fromId": "lua-fundamentos-de-lua-s2",
        "toId": "lua-fundamentos-de-lua-s3",
        "color": "#8FA8FF",
        "path": "M 219 444 C 278.5 444, 278.5 431, 338 431",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s3-s4",
        "fromId": "lua-fundamentos-de-lua-s3",
        "toId": "lua-fundamentos-de-lua-s4",
        "color": "#8FA8FF",
        "path": "M 338 431 C 397 431, 397 286, 456 286",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s4-s5",
        "fromId": "lua-fundamentos-de-lua-s4",
        "toId": "lua-fundamentos-de-lua-s5",
        "color": "#8FA8FF",
        "path": "M 456 286 C 515.5 286, 515.5 167, 575 167",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s5-s6",
        "fromId": "lua-fundamentos-de-lua-s5",
        "toId": "lua-fundamentos-de-lua-s6",
        "color": "#8FA8FF",
        "path": "M 575 167 C 634.5 167, 634.5 204, 694 204",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s6-s7",
        "fromId": "lua-fundamentos-de-lua-s6",
        "toId": "lua-fundamentos-de-lua-s7",
        "color": "#8FA8FF",
        "path": "M 694 204 C 753.5 204, 753.5 357, 813 357",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s7-s8",
        "fromId": "lua-fundamentos-de-lua-s7",
        "toId": "lua-fundamentos-de-lua-s8",
        "color": "#8FA8FF",
        "path": "M 813 357 C 872 357, 872 458, 931 458",
        "isDashed": true
      },
      {
        "id": "c-lua-fundamentos-de-lua-s8-s9",
        "fromId": "lua-fundamentos-de-lua-s8",
        "toId": "lua-fundamentos-de-lua-s9",
        "color": "#8FA8FF",
        "path": "M 931 458 C 990.5 458, 990.5 398, 1050 398",
        "isDashed": true
      }
    ]
  },
  "lua-variables-y-tipos-de-datos": {
    "sectorTitle": "LUA · VARIABLES Y TIPOS DE DATOS",
    "progressPercent": 0,
    "nodes": [
      {
        "id": "lua-variables-y-tipos-de-datos-s1",
        "code": "S1",
        "label": "¿QUÉ ES UNA VARIABLE Y CÓMO GUARDA",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 100,
        "y": 310,
        "variant": "active",
        "iconType": "brackets",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "ACTIVO • EN PROGRESO",
        "isUnlocked": true
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s2",
        "code": "S2",
        "label": "REASIGNACIÓN Y CAMBIO DE VALORES",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 206,
        "y": 444,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S1",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s3",
        "code": "S3",
        "label": "EL SISTEMA DE TIPOS Y LA FUNCIÓN T",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 311,
        "y": 431,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S2",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s4",
        "code": "S4",
        "label": "EL TIPO NUMBER: ENTEROS Y DECIMALE",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 417,
        "y": 286,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S3",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s5",
        "code": "S5",
        "label": "EL TIPO STRING: TEXTOS Y BLOQUES",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 522,
        "y": 167,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S4",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s6",
        "code": "S6",
        "label": "EL TIPO BOOLEAN: LA LÓGICA DE LA V",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 628,
        "y": 204,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S5",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s7",
        "code": "S7",
        "label": "EL TIPO NIL Y LA LLEGADA DE LOCAL",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 733,
        "y": 357,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S6",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s8",
        "code": "S8",
        "label": "CONVERSIÓN DE TIPOS Y COERCIÓN",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 839,
        "y": 458,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S7",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s9",
        "code": "S9",
        "label": "VISTAZO A LOS 4 TIPOS AVANZADOS",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 944,
        "y": 398,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S8",
        "isUnlocked": false
      },
      {
        "id": "lua-variables-y-tipos-de-datos-s10",
        "code": "S10",
        "label": "CHECKPOINT, PROYECTO RPG Y GRADUAC",
        "subtitle": "10 LECCIONES · ~15 MIN",
        "x": 1050,
        "y": 241,
        "variant": "locked",
        "iconType": "lock",
        "stars": 0,
        "maxStars": 3,
        "xp": 60,
        "statusText": "RQ S9",
        "isUnlocked": false
      }
    ],
    "connections": [
      {
        "id": "c-lua-variables-y-tipos-de-datos-s1-s2",
        "fromId": "lua-variables-y-tipos-de-datos-s1",
        "toId": "lua-variables-y-tipos-de-datos-s2",
        "color": "#8FA8FF",
        "path": "M 100 310 C 153 310, 153 444, 206 444"
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s2-s3",
        "fromId": "lua-variables-y-tipos-de-datos-s2",
        "toId": "lua-variables-y-tipos-de-datos-s3",
        "color": "#8FA8FF",
        "path": "M 206 444 C 258.5 444, 258.5 431, 311 431",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s3-s4",
        "fromId": "lua-variables-y-tipos-de-datos-s3",
        "toId": "lua-variables-y-tipos-de-datos-s4",
        "color": "#8FA8FF",
        "path": "M 311 431 C 364 431, 364 286, 417 286",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s4-s5",
        "fromId": "lua-variables-y-tipos-de-datos-s4",
        "toId": "lua-variables-y-tipos-de-datos-s5",
        "color": "#8FA8FF",
        "path": "M 417 286 C 469.5 286, 469.5 167, 522 167",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s5-s6",
        "fromId": "lua-variables-y-tipos-de-datos-s5",
        "toId": "lua-variables-y-tipos-de-datos-s6",
        "color": "#8FA8FF",
        "path": "M 522 167 C 575 167, 575 204, 628 204",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s6-s7",
        "fromId": "lua-variables-y-tipos-de-datos-s6",
        "toId": "lua-variables-y-tipos-de-datos-s7",
        "color": "#8FA8FF",
        "path": "M 628 204 C 680.5 204, 680.5 357, 733 357",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s7-s8",
        "fromId": "lua-variables-y-tipos-de-datos-s7",
        "toId": "lua-variables-y-tipos-de-datos-s8",
        "color": "#8FA8FF",
        "path": "M 733 357 C 786 357, 786 458, 839 458",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s8-s9",
        "fromId": "lua-variables-y-tipos-de-datos-s8",
        "toId": "lua-variables-y-tipos-de-datos-s9",
        "color": "#8FA8FF",
        "path": "M 839 458 C 891.5 458, 891.5 398, 944 398",
        "isDashed": true
      },
      {
        "id": "c-lua-variables-y-tipos-de-datos-s9-s10",
        "fromId": "lua-variables-y-tipos-de-datos-s9",
        "toId": "lua-variables-y-tipos-de-datos-s10",
        "color": "#8FA8FF",
        "path": "M 944 398 C 997 398, 997 241, 1050 241",
        "isDashed": true
      }
    ]
  }
};
