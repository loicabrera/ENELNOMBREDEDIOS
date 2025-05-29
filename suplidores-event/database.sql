-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: bad7nkcdovetz0xcd7tt-mysql.services.clever-cloud.com    Database: bad7nkcdovetz0xcd7tt
-- ------------------------------------------------------
-- Server version	8.4.4-4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `IMAGENES_productos`
--

DROP TABLE IF EXISTS `IMAGENES_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IMAGENES_productos` (
  `id_imagenes` int NOT NULL AUTO_INCREMENT,
  `url_imagen` varchar(150) NOT NULL,
  `cantidad` char(10) NOT NULL,
  `productos_id_productos` int NOT NULL,
  PRIMARY KEY (`id_imagenes`),
  KEY `productos_id_productos` (`productos_id_productos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IMAGENES_productos`
--

LOCK TABLES `IMAGENES_productos` WRITE;
/*!40000 ALTER TABLE `IMAGENES_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `IMAGENES_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IMAGENES_servicio`
--

DROP TABLE IF EXISTS `IMAGENES_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IMAGENES_servicio` (
  `id_imagenes` int NOT NULL AUTO_INCREMENT,
  `url_imagen` varchar(150) NOT NULL,
  `cantidad` char(10) NOT NULL,
  `SERVICIO_id_servicio` int NOT NULL,
  PRIMARY KEY (`id_imagenes`),
  KEY `SERVICIO_id_servicio` (`SERVICIO_id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IMAGENES_servicio`
--

LOCK TABLES `IMAGENES_servicio` WRITE;
/*!40000 ALTER TABLE `IMAGENES_servicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `IMAGENES_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MEMBRESIA`
--

DROP TABLE IF EXISTS `MEMBRESIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MEMBRESIA` (
  `id_memebresia` int NOT NULL,
  `nombre_pla` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `duracion_dias` char(2) NOT NULL,
  `max_publicaciones` char(1) NOT NULL,
  `beneficios` text NOT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_memebresia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MEMBRESIA`
--

LOCK TABLES `MEMBRESIA` WRITE;
/*!40000 ALTER TABLE `MEMBRESIA` DISABLE KEYS */;
INSERT INTO `MEMBRESIA` VALUES (1,'Plan Básico','Puedes publicar hasta 3 servicios y 3 productos con descripción detallada durante 30 días.',2000,'30','3','3 publicaciones de servicios, 3 publicaciones de productos, hasta 8 fotos por servicio y producto',1),(2,'Plan Destacado','Anuncio con hasta 6 servicios y 7 productos con descripción detallada durante 60 días.',4000,'60','6','6 publicaciones de servicios, 7 publicaciones de productos, hasta 15 fotos por servicio y producto, posición destacada en resultados de búsqueda por 7 días, 25% más de visibilidad que el plan básico',1),(3,'Plan Premium','Máxima visibilidad para tu negocio, incluye portada en página principal y destacado permanente durante 90 días.',8000,'90','I','Publicaciones ilimitadas de servicios y productos, hasta 25 fotos por servicio y producto, aparición en portada por 15 días + destacado permanente, posición premium en resultados de búsqueda, badge verificado en el perfil, estadísticas avanzadas de visitas y contactos',1);
/*!40000 ALTER TABLE `MEMBRESIA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MENSAJE`
--

DROP TABLE IF EXISTS `MENSAJE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MENSAJE` (
  `id_mensaje` int NOT NULL AUTO_INCREMENT,
  `fecha_envio` datetime NOT NULL,
  `estado` enum('recivido','en proceso') NOT NULL,
  PRIMARY KEY (`id_mensaje`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MENSAJE`
--

LOCK TABLES `MENSAJE` WRITE;
/*!40000 ALTER TABLE `MENSAJE` DISABLE KEYS */;
/*!40000 ALTER TABLE `MENSAJE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PERSONA`
--

DROP TABLE IF EXISTS `PERSONA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PERSONA` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cedula` varchar(255) NOT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PERSONA`
--

LOCK TABLES `PERSONA` WRITE;
/*!40000 ALTER TABLE `PERSONA` DISABLE KEYS */;
INSERT INTO `PERSONA` VALUES (1,'Ana','Perez','829-214-1366','anacasilda1987@hotmail.com','031-7854142-9'),(2,'Loida','Cabrera','809-751-9925','loidacabrera5@gmail.com','123-8524978-8'),(3,'Loida','Cabrera','859-652-7824','loidacabrera5@gmail.com','037-2453456-9'),(4,'raimy','Raimy','829-975-8937','peterray2007@disassrsmail.ru','123-3453455-5'),(5,'raimy','Raimy','829-975-8937','raimyguzman0066ceges@gmail.com','123-1231323-5'),(6,'pablooo','joseeee','829-123-8937','2210013@ipisa.edu.do','123-2123423-5'),(7,'joseeee','martess','829-123-2332','raimyguzman0066ceges@gmail.com','123-3534554-5'),(8,'Ana Marcela','Tavarez','829-784-8521','anamarcerla1111@gmail.com','031-8547920-9'),(9,'CARLOS','Rafael','829-875-5245','carlosrafaelguzman10@hotmail.com','031-9856745-8'),(10,'Delmin','Vargas','809-985-3262','delminvargas@gmail.com','031-8523006-9'),(11,'raimy','Raimy','829-975-8937','2210013@ipisa.edu.do','402-3234243-8'),(12,'raimy','Raimy','829-975-8937','raimyguzman0066ceges@gmail.com','402-7986575-8'),(13,'asdasd','asdadsad','829-975-8937','raimyguzman0066ceges@gmail.com','402-6784565-8'),(14,'adasdad','asdasdasd','829-975-8937','2210013@ipisa.edu.do','402-6774353-8'),(15,'raimy','Raimy','829-975-8937','pejemplo693@gmail.com','402-2342423-8'),(16,'Adania','jiminian','809-859-5262','AdaniaJiminian12@gmail.com','042-2453294-9'),(17,'raimy','ejemplo','829-975-8937','raimyguzman0066ceges@gmail.com','402-6345645-8'),(18,'Delmin','Raimy','829-975-8937','raimyguzman0066ceges@gmail.com','402-2342546-8'),(19,'raimy','Raimy','829-975-8937','raimyguzman0066ceges@gmail.com','402-5463246-8'),(20,'raimy','Raimy','829-975-8937','pejemplo693@gmail.com','402-0293409-8'),(21,'Eduardo','Rodriguez','849-822-2222','EduardoRodriguez12@gmail.com','031-8596223-8'),(22,'Cristina','Almanzar','809-325-8752','CristinitaaaAlmanzar@gmail.com','031-8521475-5'),(23,'Estefania','Grullon','849-213-8541','EstefaniaGrullon23@gmail.com','031-8596620-9'),(24,'Juana','Perez','809-532-5551','loidacabrera5@gmail.com','031-5489752-5');
/*!40000 ALTER TABLE `PERSONA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROVEDOR_MEMBRESIA`
--

DROP TABLE IF EXISTS `PROVEDOR_MEMBRESIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROVEDOR_MEMBRESIA` (
  `id_prov_membresia` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `fecha_pago` datetime NOT NULL,
  `MEMBRESIA_id_memebresia` int NOT NULL,
  PRIMARY KEY (`id_prov_membresia`),
  KEY `MEMBRESIA_id_memebresia` (`MEMBRESIA_id_memebresia`),
  CONSTRAINT `provedor_membresia_membresia_membresia_id_memebresia` FOREIGN KEY (`MEMBRESIA_id_memebresia`) REFERENCES `MEMBRESIA` (`id_memebresia`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROVEDOR_MEMBRESIA`
--

LOCK TABLES `PROVEDOR_MEMBRESIA` WRITE;
/*!40000 ALTER TABLE `PROVEDOR_MEMBRESIA` DISABLE KEYS */;
/*!40000 ALTER TABLE `PROVEDOR_MEMBRESIA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROVEEDOR`
--

DROP TABLE IF EXISTS `PROVEEDOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROVEEDOR` (
  `id_provedor` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(255) NOT NULL,
  `email_empresa` varchar(255) NOT NULL,
  `telefono_empresa` varchar(255) NOT NULL,
  `tipo_servicio` varchar(255) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `descripcion` text,
  `redes_sociales` varchar(255) DEFAULT NULL,
  `p_e_r_s_o_n_a_id_persona` int NOT NULL,
  PRIMARY KEY (`id_provedor`),
  KEY `p_e_r_s_o_n_a_id_persona` (`p_e_r_s_o_n_a_id_persona`),
  CONSTRAINT `PROVEEDOR_ibfk_1` FOREIGN KEY (`p_e_r_s_o_n_a_id_persona`) REFERENCES `PERSONA` (`id_persona`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROVEEDOR`
--

LOCK TABLES `PROVEEDOR` WRITE;
/*!40000 ALTER TABLE `PROVEEDOR` DISABLE KEYS */;
/*!40000 ALTER TABLE `PROVEEDOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SERVICIO`
--

DROP TABLE IF EXISTS `SERVICIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SERVICIO` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo_servicio` varchar(50) NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `provedor_negocio_id_provedor` int NOT NULL,
  PRIMARY KEY (`id_servicio`),
  KEY `provedor_negocio_id_provedor` (`provedor_negocio_id_provedor`),
  CONSTRAINT `servicio_provedor_negocio_provedor_negocio_id_provedor` FOREIGN KEY (`provedor_negocio_id_provedor`) REFERENCES `provedor_negocio` (`id_provedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SERVICIO`
--

LOCK TABLES `SERVICIO` WRITE;
/*!40000 ALTER TABLE `SERVICIO` DISABLE KEYS */;
/*!40000 ALTER TABLE `SERVICIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefono` char(12) NOT NULL,
  `comentario` text NOT NULL,
  `provedor_negocio_id_provedor` int NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `provedor_negocio_id_provedor` (`provedor_negocio_id_provedor`),
  CONSTRAINT `usuario_provedor_negocio_provedor_negocio_id_provedor` FOREIGN KEY (`provedor_negocio_id_provedor`) REFERENCES `provedor_negocio` (`id_provedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inicio_seccion`
--

DROP TABLE IF EXISTS `inicio_seccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inicio_seccion` (
  `id_login` int NOT NULL AUTO_INCREMENT,
  `password` varchar(7) NOT NULL,
  `user_name` varchar(15) NOT NULL,
  `PERSONA_id_persona` int NOT NULL,
  PRIMARY KEY (`id_login`),
  KEY `PERSONA_id_persona` (`PERSONA_id_persona`),
  CONSTRAINT `fk_inicio_seccion_persona` FOREIGN KEY (`PERSONA_id_persona`) REFERENCES `PERSONA` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inicio_seccion`
--

LOCK TABLES `inicio_seccion` WRITE;
/*!40000 ALTER TABLE `inicio_seccion` DISABLE KEYS */;
INSERT INTO `inicio_seccion` VALUES (1,'vECqx8t','jmartess865',7),(2,'yb4P5gf','rraimy123',11),(3,'8iGdbIn','rraimy391',12),(4,'yNwMJ4f','aasdadsad517',13),(5,'A0EQLP6','aasdasdasd867',14),(6,'axmIt3l','rraimy250',15),(7,'qlXtzFP','rejemplo183',17),(8,'1jV3pLV','draimy449',18),(9,'Xra0tCM','rraimy847',19),(10,'azGCoMB','rraimy279',20);
/*!40000 ALTER TABLE `inicio_seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,0) NOT NULL,
  `fecha_pago` datetime NOT NULL,
  `monto_pago` decimal(10,0) NOT NULL,
  `m_e_m_b_r_e_s_i_a_id_membresia` int NOT NULL,
  `provedor_negocio_id_provedor` int NOT NULL,
  PRIMARY KEY (`id_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,1000,'2024-06-01 12:00:00',1000,1,2),(2,1000,'2024-06-01 12:00:00',1000,1,2),(3,2000,'2025-05-21 00:43:21',2000,1,7),(4,4000,'2025-05-21 02:52:32',4000,2,8);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_productos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `tipo_producto` varchar(50) NOT NULL,
  `provedor_negocio_id_provedor` int NOT NULL,
  PRIMARY KEY (`id_productos`),
  KEY `provedor_negocio_id_provedor` (`provedor_negocio_id_provedor`),
  CONSTRAINT `productos_provedor_negocio_provedor_negocio_id_provedor` FOREIGN KEY (`provedor_negocio_id_provedor`) REFERENCES `provedor_negocio` (`id_provedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provedor_negocio`
--

DROP TABLE IF EXISTS `provedor_negocio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provedor_negocio` (
  `id_provedor` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(50) NOT NULL,
  `email_empresa` varchar(50) NOT NULL,
  `telefono_empresa` char(13) NOT NULL,
  `tipo_servicio` TEXT NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `redes_sociales` varchar(50) NOT NULL,
  `PERSONA_id_persona` int NOT NULL,
  PRIMARY KEY (`id_provedor`),
  KEY `PERSONA_id_persona` (`PERSONA_id_persona`),
  CONSTRAINT `fk_provedor_negocio_persona` FOREIGN KEY (`PERSONA_id_persona`) REFERENCES `PERSONA` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provedor_negocio`
--

LOCK TABLES `provedor_negocio` WRITE;
/*!40000 ALTER TABLE `provedor_negocio` DISABLE KEYS */;
INSERT INTO `provedor_negocio` VALUES (1,'loidix','loidacabfhfrera5@gmail.com','859-452-8542','FHDFHDG','2002-04-02 00:00:00','calle10','afgsthsxdtghxd','XMCHMDH',3),(2,'Wg Studio','CarlosStudio@gmail.com','809-857-2626','fotografía','1990-02-20 00:00:00','Los diaz , puñal','esta es una empresa de fotografia','WgStudio12',9),(3,'DelminDecor','Delmindecoraciones03@hotmail.com','809-214-7854','Decoraciones','2000-09-18 00:00:00','La barranquita','Aqui te hacemos todas las decoraciones que usted desee','DecorDL',10),(4,'MusicStar','MusicStar12@gmail.com','809-895-7542','Musica','2000-11-08 00:00:00','La barranquita','Aqui te damos la oportunidad de brindarte todo el equipo de sonido.','Musicstart_02',16),(5,'EventSalon','MargaritaEvent@hotmail.com','849-333-7821','Salon de eventos','1997-05-06 00:00:00','La barranquita','Este es un espacio para poder alquilar y hacer cualquier tipo de eventos.','SalonEvents',21),(6,'AnimaConmigo','Animateconnosotros@hotmail.com','809-857-2510','Animacion','1995-08-08 00:00:00','Los coco, puñal','Anima con nosotros tu fiesta','AnimaRD',22),(7,'FloresEstef','EstefaniaGrullon23@gmail.com','809-612-1366','Floristeria','1880-02-22 00:00:00','Av. Juan pablo duarte','Aqui vendemos flores','EstefFlores',23),(8,'Evocaflowers','loidacabrera5@gmail.com','809-253-5154','Floristeria','2000-01-04 00:00:00','Calle 10','Va a funcionar','ig_123',24);
/*!40000 ALTER TABLE `provedor_negocio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-20 23:52:32
