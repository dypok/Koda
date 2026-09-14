import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

// Generado desde content/languages/lua/manifest.json — no editar a mano.
const NODES: GraphNode[] = [
  {
    "id": "lua-m01",
    "code": "01",
    "label": "FUNDAMENTOS DE LUA",
    "subtitle": "90 LECCIONES ATÓMICAS DISEÑADAS PARA PERS…",
    "x": 90,
    "y": 310,
    "variant": "active",
    "iconType": "brackets",
    "stars": 0,
    "maxStars": 27,
    "xp": 540,
    "statusText": "ACTIVO • EN PROGRESO",
    "targetCourseId": "lua-fundamentos-de-lua",
    "isUnlocked": true
  },
  {
    "id": "lua-m02",
    "code": "02",
    "label": "VARIABLES Y TIPOS DE DATOS",
    "subtitle": "100 LECCIONES ATÓMICAS QUE CUBREN MEMORIA…",
    "x": 178,
    "y": 443,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 30,
    "xp": 600,
    "statusText": "DISPONIBLE • SIN EMPEZAR",
    "targetCourseId": "lua-variables-y-tipos-de-datos",
    "isUnlocked": false
  },
  {
    "id": "lua-m03",
    "code": "03",
    "label": "OPERADORES",
    "subtitle": "ARITMÉTICOS, RELACIONALES, LÓGICOS (AND/O…",
    "x": 266,
    "y": 476,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_02",
    "targetCourseId": "lua-operadores",
    "isUnlocked": false
  },
  {
    "id": "lua-m04",
    "code": "04",
    "label": "CONDICIONALES",
    "subtitle": "IF/ELSEIF/ELSE, AND/OR COMO TERNARIO Y FA…",
    "x": 354,
    "y": 383,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_03",
    "targetCourseId": "lua-condicionales",
    "isUnlocked": false
  },
  {
    "id": "lua-m05",
    "code": "05",
    "label": "BUCLES",
    "subtitle": "WHILE, REPEAT-UNTIL, FOR NUMÉRICO Y FOR G…",
    "x": 442,
    "y": 235,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_04",
    "targetCourseId": "lua-bucles",
    "isUnlocked": false
  },
  {
    "id": "lua-m06",
    "code": "06",
    "label": "FUNCIONES",
    "subtitle": "DEFINICIÓN, PARÁMETROS, RETORNO MÚLTIPLE,…",
    "x": 530,
    "y": 144,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_05",
    "targetCourseId": "lua-funciones",
    "isUnlocked": false
  },
  {
    "id": "lua-m07",
    "code": "07",
    "label": "TABLAS COMO ARREGLOS",
    "subtitle": "TABLE ARRAY 1-BASED, OPERADOR #, TABLE.IN…",
    "x": 618,
    "y": 179,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_06",
    "targetCourseId": "lua-tablas-como-arreglos",
    "isUnlocked": false
  },
  {
    "id": "lua-m08",
    "code": "08",
    "label": "TABLAS COMO MAPAS",
    "subtitle": "TABLE MAPA, PAIRS, CLAVES, TABLAS ANIDADA…",
    "x": 706,
    "y": 313,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_07",
    "targetCourseId": "lua-tablas-como-mapas",
    "isUnlocked": false
  },
  {
    "id": "lua-m09",
    "code": "09",
    "label": "CADENAS Y LIBRERÍA ESTÁNDAR",
    "subtitle": "STRING.* (SUB, GSUB, FIND, FORMAT, PATRON…",
    "x": 794,
    "y": 445,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_08",
    "targetCourseId": "lua-cadenas-y-estandar",
    "isUnlocked": false
  },
  {
    "id": "lua-m10",
    "code": "10",
    "label": "MANEJO DE ERRORES Y MÓDULOS",
    "subtitle": "PCALL/XPCALL/ERROR/ASSERT, REQUIRE, PACKA…",
    "x": 882,
    "y": 475,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_09",
    "targetCourseId": "lua-errores-y-modulos",
    "isUnlocked": false
  },
  {
    "id": "lua-m11",
    "code": "11",
    "label": "METATABLAS Y POO",
    "subtitle": "SETMETATABLE, __INDEX/__NEWINDEX/__TOSTRI…",
    "x": 970,
    "y": 380,
    "variant": "locked",
    "iconType": "lock",
    "stars": 0,
    "maxStars": 24,
    "xp": 480,
    "statusText": "RQ LUA_MOD_10",
    "targetCourseId": "lua-metatablas-y-poo",
    "isUnlocked": false
  },
  {
    "id": "lua-m12",
    "code": "Ω",
    "label": "ARCHIVOS, CORRUTINAS Y PROYECTO FINAL",
    "subtitle": "IO.OPEN/READ/WRITE, OS, COROUTINE.CREATE/…",
    "x": 1058,
    "y": 232,
    "variant": "boss",
    "iconType": "skull",
    "stars": 0,
    "xp": 480,
    "statusText": "DESAFÍO FINAL • PROYECTO",
    "targetCourseId": "lua-archivos-corrutinas-proyecto",
    "isUnlocked": false
  }
];

const CONNECTIONS: GraphConnection[] = [
  {
    "id": "c-lua-lua-m01-lua-m02",
    "fromId": "lua-m01",
    "toId": "lua-m02",
    "color": "#8FA8FF",
    "path": "M 90 310 C 134 310, 134 443, 178 443"
  },
  {
    "id": "c-lua-lua-m02-lua-m03",
    "fromId": "lua-m02",
    "toId": "lua-m03",
    "color": "#38BDF8",
    "path": "M 178 443 C 222 443, 222 476, 266 476",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m03-lua-m04",
    "fromId": "lua-m03",
    "toId": "lua-m04",
    "color": "#F59E0B",
    "path": "M 266 476 C 310 476, 310 383, 354 383",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m04-lua-m05",
    "fromId": "lua-m04",
    "toId": "lua-m05",
    "color": "#10B981",
    "path": "M 354 383 C 398 383, 398 235, 442 235",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m05-lua-m06",
    "fromId": "lua-m05",
    "toId": "lua-m06",
    "color": "#A855F7",
    "path": "M 442 235 C 486 235, 486 144, 530 144",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m06-lua-m07",
    "fromId": "lua-m06",
    "toId": "lua-m07",
    "color": "#F472B6",
    "path": "M 530 144 C 574 144, 574 179, 618 179",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m07-lua-m08",
    "fromId": "lua-m07",
    "toId": "lua-m08",
    "color": "#8FA8FF",
    "path": "M 618 179 C 662 179, 662 313, 706 313",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m08-lua-m09",
    "fromId": "lua-m08",
    "toId": "lua-m09",
    "color": "#38BDF8",
    "path": "M 706 313 C 750 313, 750 445, 794 445",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m09-lua-m10",
    "fromId": "lua-m09",
    "toId": "lua-m10",
    "color": "#F59E0B",
    "path": "M 794 445 C 838 445, 838 475, 882 475",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m10-lua-m11",
    "fromId": "lua-m10",
    "toId": "lua-m11",
    "color": "#10B981",
    "path": "M 882 475 C 926 475, 926 380, 970 380",
    "isDashed": true
  },
  {
    "id": "c-lua-lua-m11-lua-m12",
    "fromId": "lua-m11",
    "toId": "lua-m12",
    "color": "#A855F7",
    "path": "M 970 380 C 1014 380, 1014 232, 1058 232",
    "isDashed": true
  }
];

export const LUA_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'LUA · DE FUNDAMENTOS A METATABLAS',
  progressPercent: 8,
  nodes: NODES,
  connections: CONNECTIONS,
};

export const LUA_TRACK_TOTALS = { totalStars: 273, totalCourses: 12 };
