CREATE DATABASE  IF NOT EXISTS `banco_is2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `banco_is2`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: banco_is2
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'11222333','Mariano','Laola','3794123456','2000-01-01'),(2,'20111222','Matias','Gonzalez','3794678533','1995-01-01'),(3,'70888999','Juan','García','3731204658','1985-09-10'),(4,'1234578','Jose','Perez','3794123456','1985-09-09');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concepto_movimiento`
--

DROP TABLE IF EXISTS `concepto_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `concepto_movimiento` (
  `id_concepto_movimiento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_concepto_movimiento`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concepto_movimiento`
--

LOCK TABLES `concepto_movimiento` WRITE;
/*!40000 ALTER TABLE `concepto_movimiento` DISABLE KEYS */;
INSERT INTO `concepto_movimiento` VALUES (1,'Alquiler'),(4,'Compra'),(5,'Devolución'),(2,'Expensas'),(7,'Honorarios'),(6,'Préstamo'),(3,'Servicios'),(8,'Varios');
/*!40000 ALTER TABLE `concepto_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id_contactos` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `cbu_destinatario` varchar(22) NOT NULL,
  `alias_destinatario` varchar(50) DEFAULT NULL,
  `nombre_contacto` varchar(50) NOT NULL,
  PRIMARY KEY (`id_contactos`),
  KEY `agenda_destinatario_ibfk_1` (`id_cliente`),
  CONSTRAINT `agenda_destinatario_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactos`
--

LOCK TABLES `contactos` WRITE;
/*!40000 ALTER TABLE `contactos` DISABLE KEYS */;
INSERT INTO `contactos` VALUES (1,1,'098765432109876543218','matiasgon','Matias Gonzalez'),(2,1,'321654987123456789000','juanGar','Juan García'),(5,1,'321654987123456789001','joseper','Jose Perez'),(6,2,'1234567891234567891234','marianolaola','Mariano Laola'),(7,2,'321654987123456789001','joseper','Jose Perez');
/*!40000 ALTER TABLE `contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuenta`
--

DROP TABLE IF EXISTS `cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuenta` (
  `id_cuenta` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_tipo_cuenta` int NOT NULL,
  `id_estado_cuenta` int NOT NULL,
  `cbu` varchar(22) NOT NULL,
  `alias` varchar(50) NOT NULL,
  `saldo` decimal(15,2) NOT NULL DEFAULT '0.00',
  `saldo_inmovilizado` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_cuenta`),
  UNIQUE KEY `cbu` (`cbu`),
  UNIQUE KEY `alias` (`alias`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_tipo_cuenta` (`id_tipo_cuenta`),
  KEY `id_estado_cuenta` (`id_estado_cuenta`),
  CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `cuenta_ibfk_2` FOREIGN KEY (`id_tipo_cuenta`) REFERENCES `tipo_cuenta` (`id_tipo_cuenta`),
  CONSTRAINT `cuenta_ibfk_3` FOREIGN KEY (`id_estado_cuenta`) REFERENCES `estado_cuenta` (`id_estado_cuenta`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuenta`
--

LOCK TABLES `cuenta` WRITE;
/*!40000 ALTER TABLE `cuenta` DISABLE KEYS */;
INSERT INTO `cuenta` VALUES (1,1,1,1,'1234567891234567891234','marianolaola',31676.00,320000.00),(2,2,1,1,'098765432109876543218','matiasgon',113324.00,0.00),(3,3,1,1,'321654987123456789000','juanGar',135000.00,0.00),(4,4,1,1,'321654987123456789001','joseper',540000.00,0.00);
/*!40000 ALTER TABLE `cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_cuenta`
--

DROP TABLE IF EXISTS `estado_cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_cuenta` (
  `id_estado_cuenta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_cuenta`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_cuenta`
--

LOCK TABLES `estado_cuenta` WRITE;
/*!40000 ALTER TABLE `estado_cuenta` DISABLE KEYS */;
INSERT INTO `estado_cuenta` VALUES (1,'Activa');
/*!40000 ALTER TABLE `estado_cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_orden`
--

DROP TABLE IF EXISTS `estado_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_orden` (
  `id_estado_orden` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_orden`
--

LOCK TABLES `estado_orden` WRITE;
/*!40000 ALTER TABLE `estado_orden` DISABLE KEYS */;
INSERT INTO `estado_orden` VALUES (1,'Pendiente'),(2,'Completada'),(3,'Vencida'),(4,'Cancelada');
/*!40000 ALTER TABLE `estado_orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento`
--

DROP TABLE IF EXISTS `movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_cuenta_origen` int NOT NULL,
  `id_cuenta_destino` int NOT NULL,
  `id_tipo_movimiento` int NOT NULL,
  `monto` decimal(15,2) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `id_concepto_movimiento` int NOT NULL,
  PRIMARY KEY (`id_movimiento`),
  KEY `id_cuenta_origen` (`id_cuenta_origen`),
  KEY `id_cuenta_destino` (`id_cuenta_destino`),
  KEY `id_tipo_movimiento` (`id_tipo_movimiento`),
  KEY `fk_movimiento_concepto` (`id_concepto_movimiento`),
  CONSTRAINT `fk_movimiento_concepto` FOREIGN KEY (`id_concepto_movimiento`) REFERENCES `concepto_movimiento` (`id_concepto_movimiento`),
  CONSTRAINT `movimiento_ibfk_1` FOREIGN KEY (`id_cuenta_origen`) REFERENCES `cuenta` (`id_cuenta`),
  CONSTRAINT `movimiento_ibfk_2` FOREIGN KEY (`id_cuenta_destino`) REFERENCES `cuenta` (`id_cuenta`),
  CONSTRAINT `movimiento_ibfk_3` FOREIGN KEY (`id_tipo_movimiento`) REFERENCES `tipo_movimiento` (`id_tipo_movimiento`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento`
--

LOCK TABLES `movimiento` WRITE;
/*!40000 ALTER TABLE `movimiento` DISABLE KEYS */;
INSERT INTO `movimiento` VALUES (1,1,2,1,10000.00,'2026-05-25 19:55:24',8),(2,1,2,1,30000.00,'2026-05-25 20:05:02',6),(3,1,3,1,20000.00,'2026-05-25 20:21:51',4),(4,1,2,1,10000.00,'2026-05-25 20:22:44',7),(5,1,3,1,10000.00,'2026-05-25 20:23:23',6),(6,1,3,1,10000.00,'2026-05-25 20:35:48',6),(7,1,2,1,10000.00,'2026-05-30 21:59:35',8),(8,1,2,1,20000.00,'2026-05-30 22:01:22',1),(9,1,2,1,1324.00,'2026-05-30 22:10:26',8),(10,1,3,1,10000.00,'2026-05-30 22:43:31',6),(11,1,4,1,10000.00,'2026-05-30 22:51:24',3),(12,1,2,1,1000.00,'2026-05-31 20:34:25',8),(13,1,4,1,3000.00,'2026-05-31 21:04:57',8),(14,1,4,1,3000.00,'2026-05-31 21:06:04',8),(15,1,4,1,2000.00,'2026-05-31 21:07:22',3),(16,1,2,1,1000.00,'2026-06-04 13:03:57',8),(17,1,4,1,1000.00,'2026-06-04 13:10:48',8),(18,2,1,1,10000.00,'2026-06-04 13:14:44',8),(19,1,4,1,10000.00,'2026-06-07 13:42:36',8),(20,2,4,1,10000.00,'2026-06-07 13:53:47',8),(21,1,4,1,1000.00,'2026-06-08 21:20:04',8),(22,1,3,1,5000.00,'2026-06-08 21:30:09',7);
/*!40000 ALTER TABLE `movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_extraccion`
--

DROP TABLE IF EXISTS `orden_extraccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden_extraccion` (
  `id_orden` int NOT NULL AUTO_INCREMENT,
  `id_cuenta` int NOT NULL,
  `id_estado_orden` int NOT NULL,
  `token` varchar(6) NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `fecha_generacion` datetime NOT NULL,
  `fecha_vencimiento` datetime NOT NULL,
  PRIMARY KEY (`id_orden`),
  KEY `id_cuenta` (`id_cuenta`),
  KEY `id_estado_orden` (`id_estado_orden`),
  CONSTRAINT `orden_extraccion_ibfk_1` FOREIGN KEY (`id_cuenta`) REFERENCES `cuenta` (`id_cuenta`),
  CONSTRAINT `orden_extraccion_ibfk_2` FOREIGN KEY (`id_estado_orden`) REFERENCES `estado_orden` (`id_estado_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_extraccion`
--

LOCK TABLES `orden_extraccion` WRITE;
/*!40000 ALTER TABLE `orden_extraccion` DISABLE KEYS */;
INSERT INTO `orden_extraccion` VALUES (2,1,1,'879011',20000.00,'2026-04-19 21:18:21','2026-04-20 21:18:21'),(3,1,1,'140994',10000.00,'2026-04-19 22:14:04','2026-04-20 22:14:04'),(4,1,4,'407677',10000.00,'2026-04-19 22:16:23','2026-04-20 22:16:23'),(5,1,4,'788198',10000.00,'2026-04-19 22:17:49','2026-04-20 22:17:49'),(6,1,1,'157080',10000.00,'2026-04-19 22:19:08','2026-04-20 22:19:08'),(7,1,1,'734990',20000.00,'2026-04-19 22:28:55','2026-04-20 22:28:55'),(8,1,4,'422688',20000.00,'2026-04-19 23:13:21','2026-04-20 23:13:21'),(9,1,1,'527119',10000.00,'2026-04-19 23:14:13','2026-04-20 23:14:13'),(10,1,1,'501233',200000.00,'2026-04-19 23:14:48','2026-04-20 23:14:48'),(11,1,4,'783793',10000.00,'2026-04-19 23:56:37','2026-04-20 23:56:37'),(12,1,4,'429204',10000.00,'2026-04-20 00:10:54','2026-04-21 00:10:54'),(13,1,4,'916583',20000.00,'2026-04-21 22:24:29','2026-04-22 22:24:29'),(14,1,4,'441423',10000.00,'2026-04-23 15:38:50','2026-04-24 15:38:50'),(15,1,4,'358845',10000.00,'2026-04-23 15:40:28','2026-04-24 15:40:28'),(16,1,4,'100904',20000.00,'2026-04-26 23:03:14','2026-04-27 23:03:14'),(17,1,4,'314822',10000.00,'2026-05-15 18:04:56','2026-05-16 18:04:56'),(18,1,4,'231141',210000.00,'2026-05-15 18:07:37','2026-05-16 18:07:37'),(19,1,4,'919802',10000.00,'2026-05-15 18:24:06','2026-05-16 18:24:06'),(20,1,4,'338542',10000.00,'2026-05-19 15:20:37','2026-05-20 15:20:37'),(21,1,4,'287059',10000.00,'2026-05-19 15:20:59','2026-05-20 15:20:59'),(22,1,1,'139679',20000.00,'2026-05-30 23:10:19','2026-05-31 23:10:19'),(23,1,2,'847924',20000.00,'2026-05-30 23:23:10','2026-05-31 23:23:10'),(24,1,1,'727766',10000.00,'2026-06-04 11:35:38','2026-06-05 11:35:38'),(25,1,4,'230539',10000.00,'2026-06-04 11:45:01','2026-06-05 11:45:01');
/*!40000 ALTER TABLE `orden_extraccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_cuenta`
--

DROP TABLE IF EXISTS `tipo_cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_cuenta` (
  `id_tipo_cuenta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_cuenta`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_cuenta`
--

LOCK TABLES `tipo_cuenta` WRITE;
/*!40000 ALTER TABLE `tipo_cuenta` DISABLE KEYS */;
INSERT INTO `tipo_cuenta` VALUES (1,'Caja de Ahorros Pesos');
/*!40000 ALTER TABLE `tipo_cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_movimiento`
--

DROP TABLE IF EXISTS `tipo_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_movimiento` (
  `id_tipo_movimiento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_movimiento`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_movimiento`
--

LOCK TABLES `tipo_movimiento` WRITE;
/*!40000 ALTER TABLE `tipo_movimiento` DISABLE KEYS */;
INSERT INTO `tipo_movimiento` VALUES (1,'Transferencia'),(2,'Extracción');
/*!40000 ALTER TABLE `tipo_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_rol`
--

DROP TABLE IF EXISTS `tipo_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_rol` (
  `id_tipo_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tipo_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_rol`
--

LOCK TABLES `tipo_rol` WRITE;
/*!40000 ALTER TABLE `tipo_rol` DISABLE KEYS */;
INSERT INTO `tipo_rol` VALUES (2,'Cliente');
/*!40000 ALTER TABLE `tipo_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_tipo_rol` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id_cliente_UNIQUE` (`id_cliente`),
  KEY `id_tipo_rol` (`id_tipo_rol`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_tipo_rol`) REFERENCES `tipo_rol` (`id_tipo_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'mariano@gmail.com','$2b$10$8gVCem2HxnQ1uBZFO98WUOJ029Lztt1wMNCN/eyOjFKMiQ8/vQcJy',2),(2,2,'matias@gmail.com','$2b$10$8gVCem2HxnQ1uBZFO98WUOJ029Lztt1wMNCN/eyOjFKMiQ8/vQcJy',2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'banco_is2'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_acreditar_saldo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_acreditar_saldo`(IN p_monto DECIMAL(15,2), IN p_id_cuenta INT)
BEGIN
    UPDATE cuenta
    SET saldo = saldo + p_monto
    WHERE id_cuenta = p_id_cuenta;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_debitar_saldo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_debitar_saldo`(IN p_monto DECIMAL(15,2), IN p_id_cuenta INT)
BEGIN
    UPDATE cuenta
    SET saldo = saldo - p_monto
    WHERE id_cuenta = p_id_cuenta;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_verificar_cuenta_destino` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verificar_cuenta_destino`(IN p_cbu_alias VARCHAR(255))
BEGIN
    SELECT
        cu.id_cuenta,
        cu.id_cliente,
        cu.cbu,
        cu.alias,
        cu.saldo,
        cu.saldo_inmovilizado,
        cl.nombre,
        cl.apellido
    FROM cuenta cu
    JOIN cliente cl ON cu.id_cliente = cl.id_cliente
    WHERE cu.cbu = p_cbu_alias OR cu.alias = p_cbu_alias;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 22:28:52
