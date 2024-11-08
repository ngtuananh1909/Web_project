-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3001
-- Thời gian đã tạo: Th10 08, 2024 lúc 06:21 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
--
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(1, '2coH4A3Al4', 'ezdpggg', 1, '2024-11-08 01:52:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `image` longblob DEFAULT NULL,
  `creator` varchar(20) DEFAULT NULL,
  `creator_id` varchar(20) NOT NULL,
  `sale` tinyint(1) DEFAULT NULL,
  `saleval` tinyint(3) DEFAULT NULL,
  `sold` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `quantity`, `image`, `creator`, `creator_id`, `sale`, `saleval`, `sold`, `created_at`) VALUES
('06747506b89330ce07f1114e45354b90', 'Serum dưỡng ẩm', '<p>Thẩm thấu sâu, làm da căng bóng</p>', 250000, 50, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 90, 0, '2024-11-06 06:49:31'),
('0d34ff583dd47240615817bfb5d24a4d', 'Kem chống nắng SPF50+', '<p>Bảo vệ da khỏi tia UV</p>', 120000, 90, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('1e7858d43e0c175c27a6c852f861f692', 'Sữa rửa mặt than hoạt tính', '<p>Làm sạch sâu, giảm mụn</p>', 90000, 60, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('41d925f43ddbea6d0f0ebcb37c18ed9c', 'Son dưỡng môi hồng nhạt', '<p>Dưỡng môi mềm, không khô nứt</p>', 70000, 150, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('6762a3372f45be42a8976e1299a7a634', 'Tinh dầu tràm trà', '<p>Giảm viêm, kháng khuẩn</p>', 110000, 40, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('6aa5721d3e9c964d20e0da1a0e9527e1', 'Xịt khoáng tinh chất hoa hồng', '<p>Cấp ẩm, làm dịu da</p>', 80000, 70, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('85330a895d6da1840184f3c8fa5adcbf', 'Mặt nạ cấp ẩm từ thiên nhiên', '<p>Da mịn màng, căng bóng</p>', 50000, 100, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('8BcGlWUOiwxsQJIf6CZCCVT9XWcaHawhW6WJxZmXqYFLJA1kO2', 'hutao', 'hutaooo', 12000, 1222, 0x38646137633430343764353963653239383261346564376436353162386133312e6a7067, NULL, 'jfD3eXhT5q', 0, 9, 0, '2024-11-06 12:13:26'),
('9MF4A7FwYlWrCxOVtDwMVTMG8X2Rl5kSdcf3NIuoGmpCT2saRZ', 'Furina', '<p>dfgdffgfgf</p>', 34234000, 43534, 0x31383961326462663238373636633966616537343461363839346561623666342e6a7067, NULL, 'jfD3eXhT5q', 0, 0, 0, '2024-11-06 13:09:18'),
('a2f3d2449d4f81f233f2492d3ed94d81', 'Kem trị mụn', '<p>Giảm sưng viêm, ngừa mụn</p>', 140000, 80, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('Ao0xMehsHRrjgcOAHzb9cAakjrWllFJeuxTj2nmvHnp945jWns', 'Clear ', '<p>gội đầu</p>', 100000, 120, 0x646f776e6c6f61642e6a666966, NULL, 'jfD3eXhT5q', 0, 99, 0, '2024-11-06 06:22:18'),
('apqDm7mvorKDaecPDdCsej3NcM9pRhya1vmvqTHVBb9f7yJCof', 'mahiru', '<p>susss</p>', 120000, 11, 0x30656662316365653739303932333932653039313432363035333435643961612e6a7067, NULL, 'jfD3eXhT5q', 0, 11, 0, '2024-11-06 12:56:35'),
('b7821ebfdf8d963235a73b295f517b63', 'Tẩy trang dịu nhẹ', '<p>Làm sạch sâu không kích ứng</p>', 75000, 200, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('b8c2d7e6d493b1015867061c0c480230', 'Nước hoa unisex mini', '<p>Hương thơm tinh tế, sang trọng</p>', 300000, 30, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('b8da92061f0dd25702d7a5f5027f3575', 'Kem dưỡng da ban đêm', '<p>Dưỡng ẩm sâu, tái tạo da</p>', 200000, 50, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('b8ea852c2926b748176d12b91050722c', 'Gel lô hội làm dịu da', '<p>Giữ ẩm, giảm kích ứng</p>', 60000, 120, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('BDR5Sy9nA8j7EAJyOLNI9Zbd7jTN27axAzc5ZcT4ZiQ8rr3Wqi', 'Furinaaa', '<p><i><strong>furinaaaaaaaaaaaaa</strong></i></p>', 10000000, 1, 0x31383961326462663238373636633966616537343461363839346561623666342e6a7067, NULL, 'jfD3eXhT5q', 0, 0, 0, '2024-11-06 13:35:00'),
('bfbd77a87b96ab47d2755aafccb44c84', 'Nước hoa hồng không cồn', '<p>Cân bằng pH, dưỡng ẩm nhẹ</p>', 65000, 150, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('bwISJuQpyqMGDieWJ51JB52o3JuURgzXWyVRBfuZtTLuxeT9g2', 'fdghfgh', '<p>fghfghgfh</p>', 432343000, 34234, 0x30656662316365653739303932333932653039313432363035333435643961612e6a7067, NULL, 'jfD3eXhT5q', 99, 99, 0, '2024-11-06 11:25:57'),
('cd0706dd891adeaad59f1071518ecada', 'Bông tẩy trang cao cấp', '<p>Mềm mại, an toàn cho da</p>', 50000, 500, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('d89aef3321bdb2397216f024a64ac5f8', 'Mặt nạ giấy làm sáng da', '<p>Da tươi tắn rạng rỡ</p>', 30000, 300, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('dlXKvJJZIxCPWpVEa0d9OkKEN9oKRVzIYDv5TCDWnJdykKLRWJ', 'TUANANH', '<p><br></p>', 1000000, 12, 0x38646137633430343764353963653239383261346564376436353162386133312e6a7067, NULL, 'jfD3eXhT5q', 0, 99, 0, '2024-11-06 11:13:39'),
('ebec5d5e366dd762170c508504c02ca9', 'Dầu xả tóc mềm', '<p>Giữ tóc óng mượt</p>', 100000, 85, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('ed5d6f73ed5dbeffd92a927c52845613', 'Dầu gội thảo mộc thiên nhiên', '<p>Giúp tóc suôn mượt, chắc khỏe</p>', 100000, 120, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('ee283a08fb0fdd34a70175821c39eec9', 'Kem mắt giảm quầng thâm', '<p>Giảm bọng mắt, làm sáng vùng da</p>', 130000, 60, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('Eewhzp513GWJw7MPwDCVhjZ0G1wtkCA2cPZVV46NhJh90fPxHm', 'Sublime ', '<p>sublime</p>', 10000, 10, 0x323032345f315f385f3633383430333439363135383438353237305f7375626c696d652d746578742d332d342e6a7067, NULL, 'jfD3eXhT5q', 0, 1, 0, '2024-11-06 06:25:54'),
('f216cb49a6cde0900a1426acf5d83182', 'Sáp dưỡng thể', '<p>Dưỡng ẩm toàn thân, da mềm mịn</p>', 85000, 100, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('f48d56d2e7a27881e00119f2b9378fb0', 'Sữa tắm hương nước hoa', '<p>Lưu hương dài lâu, mềm mại da</p>', 150000, 80, 0x5b424c4f42202d20313320425d, NULL, 'creator_id', 0, 0, 0, '2024-11-06 06:49:31'),
('IZYG5YWUBXJR05YjnQshPut22xJIhZIjRHSQnRvl2zgDx17OZJ', 'TUANANH', '<p>sussss</p>', 12220000, 12, 0x31383961326462663238373636633966616537343461363839346561623666342e6a7067, NULL, 'jfD3eXhT5q', 0, 9, 0, '2024-11-06 07:38:01'),
('qThQJlPvkbCjoL7RqQ4zf5vwbd8AN3BYS1UMfClSbkTXNlB5hy', 'TUANANH', '<p><br></p>', 19000, 1, 0x31383961326462663238373636633966616537343461363839346561623666342e6a7067, NULL, 'jfD3eXhT5q', 0, 9, 0, '2024-11-06 07:07:51'),
('rsnx63sDl4AB15f75IBFoigR7uO9g0HzoV71mpmBq3gSfi7ZEx', 'Furina', '<p><br></p>', 1000, 2022, 0x31383961326462663238373636633966616537343461363839346561623666342e6a7067, NULL, 'jfD3eXhT5q', 90, 90, 0, '2024-11-06 07:04:08'),
('RVvGz2BfyUrtIzh2yiFyDcToQYql3eWT7tmGePVbnDfCseDUqA', 'susssssss', '<p><br></p>', 12000, 12, 0x3436313932303639395f3535393534303339333038363038375f3632343737323530393737363930343437325f6e2e6a7067, NULL, 'jfD3eXhT5q', 0, 1, 0, '2024-11-06 11:18:16'),
('SXVclf1EpCG4Nw865rlOiTB7kBDTB061ZagFv3b1Q0STopZnnr', 'TUANANH', '<p>sdfsdfs</p>', 32000, 12345, 0x30656662316365653739303932333932653039313432363035333435643961612e6a7067, NULL, 'jfD3eXhT5q', 0, 3, 0, '2024-11-06 11:39:43'),
('VMDnvIUxmBsQPIVgLxePMO8OFN05feFfFcGY4lwc1GjXGqyIlA', 'TUANANH', '<p>12asdasđ</p>', 12000, 12, 0x38646137633430343764353963653239383261346564376436353162386133312e6a7067, NULL, 'jfD3eXhT5q', 0, 1, 0, '2024-11-06 11:55:35'),
('wu2yYlSECuUm6tmfidlbNoOmpcIBYex7xDF5XGmqW0C7jJyEAI', 'qweqweqwe', 'sdfdsfsdfsd', 1321310000, 1232133, 0x30656662316365653739303932333932653039313432363035333435643961612e6a7067, NULL, 'jfD3eXhT5q', 0, 56, 0, '2024-11-06 12:09:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` longblob DEFAULT NULL,
  `balance` int(11) DEFAULT 0,
  `reputation` int(11) DEFAULT 0,
  `story` text DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `friends` int(11) NOT NULL DEFAULT 0,
  `github` text DEFAULT NULL,
  `twitter` text DEFAULT NULL,
  `instagram` text DEFAULT NULL,
  `facebook` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `balance`, `reputation`, `story`, `phone`, `friends`, `github`, `twitter`, `instagram`, `facebook`) VALUES
('2coH4A3Al4', 'hutao', 'chaucao@gmail.com', '$2a$10$wR9I70bcI940oNXxx2vBweL8MnXhK7NpGgrpSi3mmobRArBO/pW5a', NULL, 1000000, 0, NULL, '', 0, NULL, NULL, NULL, NULL),
('dJUbdhbCZ8', 'bui', 'nta1909k7@gmail.com', '$2a$10$DxQV98QcKe.HXR5/Sx3q1.rpzLomD11Fpmzrvmj7f6/tu3.VJ7VEy', NULL, 1000000, 0, NULL, '', 0, NULL, NULL, NULL, NULL),
('jfD3eXhT5q', 'TUANANH', 'tuananh190907@gmail.com', '$2a$10$VbHccK.pqZMdeTrNzjMtaeh4KTEdUlOUpLD8xEhFa6HuVm0d0Rt/C', NULL, 1000000, 0, NULL, '0799389161', 0, 'https://github.com/ngtuananh1909', NULL, NULL, 'https://www.facebook.com/tuan.anh.19092007');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_cart`
--

CREATE TABLE `user_cart` (
  `id` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `product_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_cart`
--

INSERT INTO `user_cart` (`id`, `user_id`, `product_id`) VALUES
(3, 'jfD3eXhT5q', '6762a3372f45be42a8976e1299a7a634'),
(4, 'dJUbdhbCZ8', '0d34ff583dd47240615817bfb5d24a4d'),
(5, '2coH4A3Al4', 'SXVclf1EpCG4Nw865rlOiTB7kBDTB061ZagFv3b1Q0STopZnnr');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_user` (`user_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_user` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_item_order` (`order_id`),
  ADD KEY `fk_order_item_product` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ratings_user` (`user_id`),
  ADD KEY `fk_ratings_product` (`product_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reviews_product` (`product_id`),
  ADD KEY `fk_reviews_user` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_cart`
--
ALTER TABLE `user_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_cart_user` (`user_id`),
  ADD KEY `fk_user_cart_product` (`product_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_cart`
--
ALTER TABLE `user_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `fk_ratings_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ratings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_cart`
--
ALTER TABLE `user_cart`
  ADD CONSTRAINT `fk_user_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
