import { Sequelize } from 'sequelize';

const conexion = new Sequelize(
  'bad7nkcdovetz0xcd7tt',    // reemplaza con MYSQL_ADDON_DB
  'uj3nqin9zmxkkhr4',                 // reemplaza con MYSQL_ADDON_USER
  '51GsplIbrfLHDFhNd29',              // reemplaza con MYSQL_ADDON_PASSWORD
  {
    host: 'bad7nkcdovetz0xcd7tt-mysql.services.clever-cloud.com',            // reemplaza con MYSQL_ADDON_HOST
    port: 20695,              // verifica si es diferente
    dialect: 'mysql',
    logging: false,          // o true si quieres ver logs
  }
);

export default conexion;