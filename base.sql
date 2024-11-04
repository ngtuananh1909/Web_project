DROP DATABASE IF EXISTS product_db;
CREATE DATABASE product_db DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE product_db;

-- Table: `users` (nên tạo trước)
CREATE TABLE `users` (
  `id` VARCHAR(20) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` LONGBLOB DEFAULT NULL,
  `balance` INT DEFAULT 0,
  `reputation` INT DEFAULT 0,
  `story` TEXT DEFAULT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `friends` INT NOT NULL DEFAULT 0,
  `github` TEXT DEFAULT NULL,
  `twitter` TEXT DEFAULT NULL,
  `instagram` TEXT DEFAULT NULL,
  `facebook` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `products` (tạo bảng này sau bảng `users`)
CREATE TABLE `products` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` INT DEFAULT NULL,
  `quantity` INT NOT NULL,
  `image` LONGBLOB DEFAULT NULL,
  `creator` VARCHAR(20) DEFAULT NULL,
  `creator_id` VARCHAR(20) NOT NULL,
  `sale` TINYINT(1) DEFAULT NULL,
  `saleval` TINYINT(3) DEFAULT NULL,
  `sold` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `ratings`
CREATE TABLE `ratings` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(20) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ratings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ratings_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `reviews`
CREATE TABLE `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(20) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `user_cart`
CREATE TABLE `user_cart` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(20) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  CONSTRAINT `fk_user_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `orders`
CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(20) NOT NULL,
  `total_amount` INT NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table: `order_items`
CREATE TABLE `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_purchase` INT NOT NULL,
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

COMMIT;
