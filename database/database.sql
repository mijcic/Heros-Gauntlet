-- ============================================
-- Hero's Gauntlet — Database Setup
-- Run this once to create database and tables
-- ============================================

CREATE DATABASE IF NOT EXISTS `rpg-game`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `rpg-game`;

-- ============================================
-- Users — accounts
-- ============================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- Heroes — game data per user
-- ============================================

CREATE TABLE IF NOT EXISTS `heroes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `hp` INT DEFAULT 100,
  `max_hp` INT DEFAULT 100,
  `attack` INT DEFAULT 10,
  `defense` INT DEFAULT 5,
  `magic` INT DEFAULT 5,
  `level` INT DEFAULT 1,
  `xp` INT DEFAULT 0,
  `unlocked_index` INT DEFAULT 0,
  `runs_completed` INT DEFAULT 0,
  `hero_class` VARCHAR(20) DEFAULT 'knight',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `heroes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- Learned Moves — moves a hero has learned from victories
-- ============================================

CREATE TABLE IF NOT EXISTS `learned_moves` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hero_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `effect` VARCHAR(50) NOT NULL,
  `value` INT NOT NULL,
  `duration` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hero_id` (`hero_id`),
  CONSTRAINT `learned_moves_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `heroes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- Saved Runs — Save & Exit state per user (one slot)
-- ============================================

CREATE TABLE IF NOT EXISTS `saved_runs` (
  `user_id` INT NOT NULL,
  `state` JSON NOT NULL,
  `saved_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `saved_runs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;