-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pickleball
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `envent_id` int NOT NULL AUTO_INCREMENT,
  `content_name` varchar(100) NOT NULL,
  `age_max` int DEFAULT NULL,
  `age_min` int DEFAULT NULL,
  `gender` enum('Nu','Nam') DEFAULT NULL,
  PRIMARY KEY (`envent_id`),
  UNIQUE KEY `content_name` (`content_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'7.5 t? do',NULL,NULL,NULL),(2,'6.5 t? do',NULL,NULL,NULL),(3,'5.5 trên 45 tu?i',NULL,45,NULL),(4,'5.5 d??i 45 tu?i',45,NULL,NULL),(5,'4.5 t? do',NULL,NULL,NULL),(6,'?ôi n? 4.5',NULL,NULL,'Nu');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `nick_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(15) NOT NULL,
  `gender` enum('Nam','Nu') DEFAULT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `avatar_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registration` (`registration_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (68,42,'4.5-tu-do','nuuu','nuu','0999999999','Nu','2025-07-10 00:00:00','1753909173178-58853875.png'),(69,42,'4.5-tu-do','nuuu','nuu','0999999999','Nam','2025-07-20 00:00:00','1753909173205-601325446.jpg'),(70,43,'7.5-tu-do','llllppp','jjj','0999999999','Nam','2025-07-17 00:00:00','1753910670117-972648195.png'),(71,44,'6.5-tu-do','llllppp','nuu','0999999999','Nu','2025-07-10 00:00:00','1753910791376-938397774.jpg'),(72,44,'6.5-tu-do','nuuu','nuu','0999999999','Nu','2025-07-04 00:00:00','1753910791376-524979707.jpg'),(73,45,'6.5-tu-do','llllppp','nuu','0999999999','Nu','2025-07-10 00:00:00','1753910791380-663072094.jpg'),(74,45,'6.5-tu-do','nuuu','nuu','0999999999','Nu','2025-07-04 00:00:00','1753910791381-276620437.jpg'),(75,46,'5.5-duoi-45','llllppp','nuu','0999999999','Nu','1977-07-29 00:00:00','1753911455715-670685987.png'),(76,47,'5.5-duoi-45','ll','jjj','0999999999','Nu','1981-11-01 00:00:00','1753912208386-204465547.png'),(79,49,'5.5-tren-45','yyyyyyyy','yyyyyyyyyy','0999999999','Nam','1975-06-19 00:00:00','1753928410851-976709877.jpg'),(80,50,'doi-nu-4.5','llllppp','111','0999999999','Nu','2025-07-12 00:00:00','1753928504470-746185914.jpg'),(81,51,'6.5-tu-do','llllppp','nuu','0999999999','Nam','2025-07-11 00:00:00','1753930216793-550350045.jpg'),(82,51,'6.5-tu-do','llllppp','jjj222','0999999999','Nu','2025-07-17 00:00:00','1753930216794-941191645.jpg'),(85,53,'7.5-tu-do','test coi loi','nuu','0999999999','Nam','2025-07-11 00:00:00','1753930692208-762426509.jpg'),(86,54,'6.5-tu-do','ll','nuu','0999999999',NULL,'2025-07-25 00:00:00','1753930801245-5528461.png'),(87,54,'6.5-tu-do','nuuu','jjj','0999999999','Nu','2025-07-19 00:00:00','1753930801267-482197967.jpg'),(88,54,'6.5-tu-do','ll','nuu','0999999999','Nam','2025-07-03 00:00:00','1753930801267-677523594.jpg'),(89,54,'6.5-tu-do','nuuu','nuu','0999999999','Nu','2025-07-11 00:00:00','1753930801268-783290758.png'),(90,55,'7.5-tu-do','nuuu','nuu','09999999999','Nu','2025-07-16 00:00:00','1753930866941-481208458.png'),(91,55,'7.5-tu-do','nuuu','jjj','0999999999','Nu','2025-07-03 00:00:00','1753930866949-204343025.jpg'),(92,55,'7.5-tu-do','llllppp','nuu','0999999999','Nu','2025-07-05 00:00:00','1753930866951-985565388.jpg'),(93,56,'6.5-tu-do','ll','nuu','0999999999','Nam','2025-07-26 00:00:00','1753934018525-990904462.png'),(94,56,'6.5-tu-do','llllppp','nuu','09999999999','Nam','2025-07-05 00:00:00','1753934018546-496724637.png'),(95,56,'6.5-tu-do','nuuu','nuu','0999999999','Nam','2025-07-04 00:00:00','1753934018553-274172278.png'),(97,58,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934208530-842005628.jpg'),(98,59,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934215348-934205718.jpg'),(99,60,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934222013-349160240.jpg'),(100,61,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934227215-820231248.jpg'),(101,62,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934230903-30242271.jpg'),(102,63,'6.5-tu-do','tétttttt','nuu','0999999999','Nu','1972-06-27 00:00:00','1753934235867-189769852.jpg'),(103,64,'6.5-tu-do','nuuu h','nuu','0999999999','Nu',NULL,'1753935375812-962030163.jpg'),(104,57,'5.5-tren-45','tétttttt nènnn','nuu','0999999999','Nam','1971-05-04 00:00:00','1753935653453-916187629.jpg'),(105,40,'7.5-tu-do','aa hhhhhhhhh','111','0999999999','Nu',NULL,'1753938390509-549278630.jpg'),(106,41,'7.5-tu-do','kk hahaha','nuu hahaha','09999999999','Nam',NULL,'1753938524507-220244977.jpg'),(107,48,'5.5-duoi-45','nuuu test bỏ bảy','nuu','0999999999',NULL,'2025-07-29 00:00:00','1753938609630-463255274.jpg'),(108,52,'5.5-tren-45','test lại nguyên nguyễn thị thế bỏ sáu','nuu bỏ sáu','0999999999','Nam','1976-07-30 00:00:00','1753938707023-121335664.jpg'),(109,52,'5.5-tren-45','tétttttt','nuu','0999999999','Nu','1977-02-04 00:00:00','1753938707025-803011851.jpg');
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `envent_id` int NOT NULL,
  `leader_name` varchar(100) NOT NULL,
  `leader_phone` varchar(15) NOT NULL,
  PRIMARY KEY (`registration_id`),
  KEY `envent_id` (`envent_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `registration_ibfk_1` FOREIGN KEY (`envent_id`) REFERENCES `event` (`envent_id`),
  CONSTRAINT `registration_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES (40,13,1,'Nguyên','0987654321'),(41,13,1,'Nguyên','0123456789'),(42,13,5,'Nguyên','0123456789'),(43,13,1,'hoho','0987654321'),(44,13,2,'jjjjj','0987654321'),(45,13,2,'jjjjj','0987654321'),(46,13,1,'Nguyên','0123456789'),(47,13,1,'Nguyên','0987654321'),(48,18,2,'Nguyên test','0987654321'),(49,13,1,'hoho','0123456789'),(50,16,1,'Nguyên','09876543212'),(51,19,2,'admin','0987654321'),(52,18,2,'Nguyên','0987654321'),(53,19,1,'Nguyên test','0987654321'),(54,19,2,'Nguyên','0987654321'),(55,19,1,'Nguyên','0123456789'),(56,18,1,'Nguyên','0987654321'),(57,18,1,'Nguyên','0987654321'),(58,18,1,'Nguyên','0987654321'),(59,18,1,'Nguyên','0987654321'),(60,18,1,'Nguyên','0987654321'),(61,18,1,'Nguyên','0987654321'),(62,18,1,'Nguyên','0987654321'),(63,18,1,'Nguyên','0987654321'),(64,18,2,'Nguyên test','0987654321');
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','BTC') COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (13,'09999999999','ssssss@2','Lý Thế Nguyên','USER'),(14,'0999999988','ssssss@2','Lý Thế Nguyên','USER'),(15,'02222222222','ssssss@1','hihi','USER'),(16,'0999999999','ssssss3@','Một con vịt','USER'),(17,'0111111111','llllll0.','hịijih','USER'),(18,'0123456788','password','Test User','USER'),(19,'0123456789','Acc@0pickleball','Admin','BTC');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-31 12:14:01
