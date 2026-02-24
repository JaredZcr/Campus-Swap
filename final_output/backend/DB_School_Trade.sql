-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_school_trade
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `sh_address`
--

DROP TABLE IF EXISTS `sh_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_address` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `consignee_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'consignee name',
  `consignee_phone` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'consignee phone',
  `province_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'province',
  `city_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'city',
  `region_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'district',
  `detail_address` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'detailed address',
  `default_flag` tinyint NOT NULL COMMENT 'is default',
  `user_id` bigint NOT NULL COMMENT 'user id',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id_index` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_address`
--

LOCK TABLES `sh_address` WRITE;
/*!40000 ALTER TABLE `sh_address` DISABLE KEYS */;
INSERT INTO `sh_address` VALUES (32,'HENRY','2062272312','Michigan','Auburn hills','HHB','4036',1,14);
/*!40000 ALTER TABLE `sh_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_admin`
--

DROP TABLE IF EXISTS `sh_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_admin` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `account_number` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'admin account',
  `admin_password` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'password',
  `admin_name` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'admin name',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `account_number` (`account_number`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_admin`
--

LOCK TABLES `sh_admin` WRITE;
/*!40000 ALTER TABLE `sh_admin` DISABLE KEYS */;
INSERT INTO `sh_admin` VALUES (1,'11','123123','Admin');
/*!40000 ALTER TABLE `sh_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_favorite`
--

DROP TABLE IF EXISTS `sh_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `create_time` datetime NOT NULL COMMENT 'time added to favorites',
  `user_id` bigint NOT NULL COMMENT 'user id',
  `idle_id` bigint NOT NULL COMMENT 'item id',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `user_id` (`user_id`,`idle_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_favorite`
--

LOCK TABLES `sh_favorite` WRITE;
/*!40000 ALTER TABLE `sh_favorite` DISABLE KEYS */;
INSERT INTO `sh_favorite` VALUES (49,'2026-02-23 08:22:54',14,113);
/*!40000 ALTER TABLE `sh_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_idle_item`
--

DROP TABLE IF EXISTS `sh_idle_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_idle_item` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `idle_name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'item name',
  `idle_details` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'details',
  `picture_list` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'image list',
  `idle_price` decimal(10,2) NOT NULL COMMENT 'price',
  `idle_place` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'location',
  `idle_label` int NOT NULL COMMENT 'category label',
  `release_time` datetime NOT NULL COMMENT 'publish time',
  `idle_status` tinyint NOT NULL COMMENT 'status (1=published,2=off-shelf,0=deleted)',
  `user_id` bigint NOT NULL COMMENT 'user id',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id_index` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_idle_item`
--

LOCK TABLES `sh_idle_item` WRITE;
/*!40000 ALTER TABLE `sh_idle_item` DISABLE KEYS */;
INSERT INTO `sh_idle_item` VALUES (113,'Iphone 12 pro max','Pretty good ','[\"http://localhost:8080/image?imageName=file17718344052191004_U5c4f_U5e55_U622a_U56fe_2026-02-23_031307.png\"]',188.00,'OU library',6,'2026-02-23 08:13:26',2,11),(114,'OS Textbook','NEW!!!','[\"http://localhost:8080/image?imageName=file17718349381561006_U5c4f_U5e55_U622a_U56fe_2026-02-23_032127.png\"]',50.00,'HHB',1,'2026-02-23 08:22:21',1,14);
/*!40000 ALTER TABLE `sh_idle_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_message`
--

DROP TABLE IF EXISTS `sh_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_message` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `user_id` bigint NOT NULL COMMENT 'user id',
  `idle_id` bigint NOT NULL COMMENT 'item id',
  `content` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'message content',
  `create_time` datetime NOT NULL COMMENT 'message time',
  `to_user` bigint NOT NULL COMMENT 'reply-to user',
  `to_message` bigint DEFAULT NULL COMMENT 'reply-to message',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id_index` (`user_id`) USING BTREE,
  KEY `idle_id_index` (`idle_id`) USING BTREE,
  KEY `to_user_index` (`to_user`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_message`
--

LOCK TABLES `sh_message` WRITE;
/*!40000 ALTER TABLE `sh_message` DISABLE KEYS */;
INSERT INTO `sh_message` VALUES (54,14,113,'Hi','2026-02-23 08:25:25',11,NULL),(55,14,113,'is it still available','2026-02-23 08:25:44',11,NULL);
/*!40000 ALTER TABLE `sh_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_order`
--

DROP TABLE IF EXISTS `sh_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_order` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `order_number` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'order number',
  `user_id` bigint NOT NULL COMMENT 'user id',
  `idle_id` bigint NOT NULL COMMENT 'item id',
  `order_price` decimal(10,2) NOT NULL COMMENT 'order total',
  `payment_status` tinyint NOT NULL COMMENT 'payment status',
  `payment_way` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'payment method',
  `create_time` datetime NOT NULL COMMENT 'created time',
  `payment_time` datetime DEFAULT NULL COMMENT 'payment time',
  `order_status` tinyint NOT NULL COMMENT 'order status',
  `is_deleted` tinyint DEFAULT NULL COMMENT 'is deleted',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_order`
--

LOCK TABLES `sh_order` WRITE;
/*!40000 ALTER TABLE `sh_order` DISABLE KEYS */;
INSERT INTO `sh_order` VALUES (87,'177183561378710002',14,113,188.00,0,'Online','2026-02-23 08:33:34',NULL,0,NULL);
/*!40000 ALTER TABLE `sh_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_order_address`
--

DROP TABLE IF EXISTS `sh_order_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_order_address` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment id',
  `order_id` bigint NOT NULL COMMENT 'order id',
  `consignee_name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'consignee',
  `consignee_phone` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'phone',
  `detail_address` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'shipping address',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `orderId` (`order_id`) USING BTREE,
  KEY `order_id_index` (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_order_address`
--

LOCK TABLES `sh_order_address` WRITE;
/*!40000 ALTER TABLE `sh_order_address` DISABLE KEYS */;
INSERT INTO `sh_order_address` VALUES (23,87,'HENRY','2062272312','Michigan Auburn hills HHB 4036');
/*!40000 ALTER TABLE `sh_order_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_user`
--

DROP TABLE IF EXISTS `sh_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'auto-increment primary key',
  `account_number` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'account (phone)',
  `user_password` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'login password',
  `nickname` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'nickname',
  `avatar` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'avatar',
  `sign_in_time` datetime NOT NULL COMMENT 'sign-up time',
  `user_status` tinyint DEFAULT NULL COMMENT 'status (1=banned)',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `account_number` (`account_number`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_user`
--

LOCK TABLES `sh_user` WRITE;
/*!40000 ALTER TABLE `sh_user` DISABLE KEYS */;
INSERT INTO `sh_user` VALUES (13,'8182888176','123123','Henry','https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-02-23 08:08:53',NULL),(14,'2062272312','123123','Jared','https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png','2026-02-23 08:15:00',NULL);
/*!40000 ALTER TABLE `sh_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-23  3:44:59
