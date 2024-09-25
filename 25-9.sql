-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3001
-- Thời gian đã tạo: Th9 25, 2024 lúc 06:49 AM
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
-- Cơ sở dữ liệu: `product_db`
--

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
('1mhCp3yA6xa26gH48wdJEad6PbMh6NVI9WyJQAtlrOLNTt434s', 'Phat Ta Simp', 'gay', 100, 1, 0x313732313337333630303332365f6465662e6a7067, 'Quan Minh', 'aL4RptWAMs', 0, 0, 0, '2024-07-22 03:16:26'),
('BoonQ5K4vkWuEjNQ3gNjNzmPUcB1EWyl3JdVyOMkQktxzJC9wq', 'Tuan Anh beo', 'gay', 100, 1, 0x313732313337333439373738305f5475616e20416e682e6a7067, 'Quan Minh', 'aL4RptWAMs', 1, 99, 0, '2024-07-22 03:16:26'),
('dtiUELIJajgyzcSfMBXnapmxqMapVEkTXL1ctIgIXVIT766Oij', 'Trung Kien', 'gay', 100, 1, 0x313732313336353635373736385f5472756e674b69656e536c6565702e6a7067, 'Quan Minh', 'aL4RptWAMs', 1, 99, 0, '2024-07-22 03:16:26'),
('hUriIAklJA1IQmYt0dinAJiAtyEOekaFOgacl4ZD7nlXUy9jh3', 'Quan Minh', 'gay', 100, 1, 0x3635313065313231666665616562333130356536633932393034306331323430, 'Quan Minh', '', 0, 0, 0, '2024-07-22 03:16:26'),
('kJy4WQaUD1oezriugFq9thwSuc0FV1UEkV7D9zpCc55Irb2eUm', 'Minh Quân', 'gay', 1000, 1, 0x313732313730323739343830325f6e67756f696e696767612e706e67, 'Quan Minh', 'aL4RptWAMs', 1, 99, 0, '2024-07-23 02:46:34'),
('lYcvZ9B8rIR5dQFX8N4IcwLti0wNzFmagyA52SkwdD7Ek5UOlu', 'Ta Tan Phat', 'gay', 100, 1, 0x313732313337373832303537365f6465662e6a7067, 'Quan Minh', 'aL4RptWAMs', 1, 69, 0, '2024-07-22 03:16:26'),
('Xg32XkFR7EpGlQoPZIw2Et9UKsicJKA30kem86ausAkDwQ3iRo', 'Quan Minh', 'gay', 100, 1, 0x313732313335383737323832325f5472756e674b69656e536c6565702e6a7067, 'Quan Minh', '', 0, 0, 0, '2024-07-22 03:16:26');

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
  `friends` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `balance`, `reputation`, `story`, `phone`, `friends`) VALUES
('EUbXBmJABE', 'Tuan Anh', 'tes2t@gmail.com', '$2a$10$nibHRtShxVl66IOxRnpZ/u4bMCg3biLd8IiVdyFWy6IrRa4dy6ciu', NULL, NULL, NULL, NULL, '', 0),
('aL4RptWAMs', 'Quan Minh noob', 'test@gmail.com', '$2a$10$PHbJd0tH0TYyUV937w6cC.NKOn/PHLxFR76C9rF0uRAc/cqpXQiOm', 0x75706c6f6164732f614c3452707457414d732e706e67, 0, NULL, NULL, '', 0),
('MucJ31Cuch', 'Trung Kien', 'test2@gmail.com', '$2a$10$uRRigeffK8h0H4iUPhfmdOpHLh82FemMkwswUxSqts6rUT3vsiPBC', 0x75706c6f6164732f4d75634a3331437563682e6a7067, 0, 0, NULL, '', 0),
('AFbzX92VFg', 'Giang Trung Kien', 'test3@gmail.com', '$2a$10$XivEbLRNIw3VxtiQSwOzWuazuFqBoZxOKh7MWwco5s8FaX7Dwaley', NULL, 0, 0, NULL, '', 0),
('WEsUEBHmJv', 'Trung Kien', 'test4@gmail.com', '$2a$10$kKeYCR6EI1la0g9RpHRv6OMsVEUwiVIuH7Hf5f4vEywN04YJuTiSS', NULL, 0, 0, NULL, '', 0),
('iiU3QGItfH', 'Trung Kien2', 'test5@gmail.com', '$2a$10$AVoeJpiGjKVpcymva3bDGeXl6r9XApD.jvV304LNbO0p2Em31Q9Ue', NULL, 0, 0, NULL, '', 0),
('YfvViHLuSg', 'Minh Quan', 'tests@gmail.com', '$2a$10$Qbieq3M325I1EXvjsEcRcuwpJBe/P/xr5wkArhByJK7p7DJRMPZqS', 0x75706c6f6164732f5966765669484c7553672e6a7067, 0, 0, NULL, '', 0),
('TfF2cAin7Z', 'Mink Quan', 'testq@gmail.com', '$2a$10$gPKL5h8vVDEoF.ytexJ5rOiV.QqaV2cVPTr/0WGhkugutM5kXNHgO', NULL, 0, 0, NULL, '', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_cart`
--

CREATE TABLE `user_cart` (
  `user_id` varchar(20) NOT NULL,
  `product_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_cart`
--

INSERT INTO `user_cart` (`user_id`, `product_id`) VALUES
('aL4RptWAMs', 'BoonQ5K4vkWuEjNQ3gNjNzmPUcB1EWyl3JdVyOMkQktxzJC9wq');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_cart`
--
ALTER TABLE `user_cart`
  ADD PRIMARY KEY (`user_id`,`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
