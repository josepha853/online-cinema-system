-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2025 at 09:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cinema`
--

-- --------------------------------------------------------

--
-- Table structure for table `auditoriums`
--

CREATE TABLE `auditoriums` (
  `aud_id` int(11) NOT NULL,
  `theater_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `seating_map_url` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auditoriums`
--

INSERT INTO `auditoriums` (`aud_id`, `theater_id`, `name`, `seating_map_url`, `capacity`) VALUES
(1, 1, 'Hall 1', 'uploads/maps/hall1.json', 100),
(2, 1, 'Hall 2', 'uploads/maps/hall2.json', 80),
(3, 2, 'Premium Hall', 'uploads/maps/premium.json', 120);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `target_table` varchar(100) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `user_id`, `action`, `target_table`, `target_id`, `created_at`) VALUES
(1, 2, 'created_order', 'orders', 1, '2025-11-30 11:37:58'),
(2, 2, 'created_order', 'orders', 2, '2025-11-30 11:37:58'),
(3, 4, 'REGISTER', 'users', 4, '2025-11-30 11:40:46'),
(4, 4, 'register', 'users', 4, '2025-11-30 11:40:46'),
(5, 4, 'LOGIN', 'users', 4, '2025-11-30 11:40:59'),
(6, 4, 'login', 'users', 4, '2025-11-30 11:40:59'),
(7, 5, 'REGISTER', 'users', 5, '2025-11-30 11:41:44'),
(8, 5, 'register', 'users', 5, '2025-11-30 11:41:44'),
(9, 6, 'REGISTER', 'users', 6, '2025-11-30 11:43:09'),
(10, 6, 'register', 'users', 6, '2025-11-30 11:43:09'),
(11, 6, 'LOGIN', 'users', 6, '2025-11-30 11:43:24'),
(12, 6, 'login', 'users', 6, '2025-11-30 11:43:24'),
(13, 7, 'REGISTER', 'users', 7, '2025-11-30 13:52:02'),
(14, 7, 'register', 'users', 7, '2025-11-30 13:52:02'),
(15, 7, 'LOGIN', 'users', 7, '2025-11-30 13:52:24'),
(16, 7, 'login', 'users', 7, '2025-11-30 13:52:24'),
(17, 8, 'REGISTER', 'users', 8, '2025-11-30 17:35:53'),
(18, 8, 'register', 'users', 8, '2025-11-30 17:35:53'),
(19, 9, 'REGISTER', 'users', 9, '2025-11-30 17:36:41'),
(20, 9, 'register', 'users', 9, '2025-11-30 17:36:41'),
(21, 9, 'LOGIN', 'users', 9, '2025-11-30 17:36:53'),
(22, 9, 'login', 'users', 9, '2025-11-30 17:36:53'),
(23, 9, 'LOGOUT', 'users', 9, '2025-11-30 19:05:54'),
(24, 10, 'REGISTER', 'users', 10, '2025-11-30 19:06:30'),
(25, 10, 'register', 'users', 10, '2025-11-30 19:06:30'),
(26, 10, 'LOGIN', 'users', 10, '2025-11-30 19:06:44'),
(27, 10, 'login', 'users', 10, '2025-11-30 19:06:44'),
(28, 11, 'REGISTER', 'users', 11, '2025-12-01 14:12:54'),
(29, 11, 'register', 'users', 11, '2025-12-01 14:12:54'),
(30, 11, 'LOGIN', 'users', 11, '2025-12-01 14:13:17'),
(31, 11, 'login', 'users', 11, '2025-12-01 14:13:17'),
(32, 11, 'LOGIN', 'users', 11, '2025-12-01 14:14:15'),
(33, 11, 'login', 'users', 11, '2025-12-01 14:14:15'),
(34, 12, 'REGISTER', 'users', 12, '2025-12-01 14:25:15'),
(35, 12, 'register', 'users', 12, '2025-12-01 14:25:15'),
(36, 12, 'LOGIN', 'users', 12, '2025-12-01 14:25:28'),
(37, 12, 'login', 'users', 12, '2025-12-01 14:25:28'),
(38, 12, 'LOGIN', 'users', 12, '2025-12-01 14:44:36'),
(39, 12, 'login', 'users', 12, '2025-12-01 14:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `user_id`, `show_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 1, 5, 'Amazing action sequences!', '2025-11-30 11:37:58'),
(2, 2, 2, 4, 'Very romantic and touching.', '2025-11-30 11:37:58');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `director` varchar(255) DEFAULT NULL,
  `cast` text DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`movie_id`, `title`, `description`, `genre`, `duration`, `language`, `release_date`, `rating`, `director`, `cast`, `poster_url`, `status`, `created_at`, `updated_at`) VALUES
(2, 'true love', 'about love', 'Horror', 123456, 'English', '0000-00-00', 0.0, 'karongi', '', 'uploads/posters/movie_692c469d08e4c.jpg', 'active', '2025-11-30 13:29:01', '2025-11-30 13:29:01'),
(3, 'wtytyyt', 'sdfg', 'Horror', 123456, 'English', '0000-00-00', 3.0, 'karongi', 'act2', 'uploads/posters/movie_692c474f0e544.jpg', 'active', '2025-11-30 13:31:59', '2025-11-30 13:31:59'),
(4, 'qwert', 'trtyu', 'Comedy', 2345, 'English', '0000-00-00', 4.0, 'karongu', 'qwe', 'uploads/posters/movie_692c80da48b9c.jpg', 'active', '2025-11-30 17:37:30', '2025-11-30 17:58:39'),
(5, 'thesecret movies', 'there is some thing behind', 'Fantasy', 123456, 'English', '0000-00-00', 5.0, 'stella', 'act4', 'uploads/posters/movie_692da5c1bd28f.jpg', 'active', '2025-12-01 14:27:13', '2025-12-01 14:27:13');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notif_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notif_id`, `user_id`, `message`, `type`, `sent_at`) VALUES
(1, 2, 'Booking confirmed for The Great Adventure', 'booking', '2025-11-30 11:37:58'),
(2, 2, 'Booking confirmed for Romantic Escape', 'booking', '2025-11-30 11:37:58'),
(3, 4, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 11:40:46'),
(4, 5, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 11:41:44'),
(5, 6, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 11:43:09'),
(6, 7, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 13:52:02'),
(7, 8, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 17:35:53'),
(8, 9, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 17:36:41'),
(9, 10, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-11-30 19:06:30'),
(10, 11, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-12-01 14:12:54'),
(11, 12, 'Welcome to CinemaHub! Your account has been created successfully.', 'success', '2025-12-01 14:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` enum('pending','paid','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `show_id`, `total_amount`, `payment_method`, `status`, `created_at`) VALUES
(1, 2, 1, 10000.00, 'wallet', 'confirmed', '2025-11-30 11:37:57'),
(2, 2, 2, 5000.00, 'card', 'confirmed', '2025-11-30 11:37:57');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `ticket_type_id` int(11) NOT NULL,
  `seat_number` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `ticket_type_id`, `seat_number`, `price`) VALUES
(1, 1, 1, 'A1', 5000.00),
(2, 1, 1, 'A2', 5000.00),
(3, 2, 3, 'B5', 5000.00);

-- --------------------------------------------------------

--
-- Table structure for table `shows`
--

CREATE TABLE `shows` (
  `show_id` int(11) NOT NULL,
  `auditorium_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('movie','play') DEFAULT 'movie',
  `language` varchar(50) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `status` enum('scheduled','cancelled','finished') DEFAULT 'scheduled',
  `poster_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shows`
--

INSERT INTO `shows` (`show_id`, `auditorium_id`, `title`, `type`, `language`, `genre`, `date`, `time`, `duration`, `status`, `poster_url`, `description`, `rating`) VALUES
(1, 1, 'The Great Adventure', 'movie', 'English', 'Action', '2025-12-05', '18:30:00', 120, 'scheduled', '/src/assets/cimena1.jpg', 'An epic journey of courage and discovery as a team of explorers venture into uncharted territories.', 7.5),
(2, 1, 'Romantic Escape', 'movie', 'English', 'Romance', '2025-12-06', '20:00:00', 105, 'scheduled', '/src/assets/cinema2.jpg', 'A heartwarming love story set against the beautiful backdrop of Paris.', 8.2),
(3, 2, 'Comedy Night Live', 'movie', 'English', 'Comedy', '2025-12-07', '19:30:00', 95, 'scheduled', '/src/assets/cinema3.jpg', 'Laugh out loud with the funniest comedians in this hilarious stand-up special.', 7.8),
(4, 2, 'Sci-Fi Odyssey', 'movie', 'English', 'Sci-Fi', '2025-12-08', '21:00:00', 140, 'scheduled', '/src/assets/cinema4.jpg', 'A mind-bending journey through space and time that will leave you questioning reality.', 8.5),
(5, 3, 'Horror House', 'movie', 'English', 'Horror', '2025-12-09', '22:00:00', 110, 'scheduled', '/src/assets/cinema5.jpg', 'Enter if you dare. A terrifying tale of a haunted mansion with dark secrets.', 7.0),
(6, 3, 'Family Fun Time', 'movie', 'English', 'Family', '2025-12-10', '15:00:00', 90, 'scheduled', '/src/assets/cinema6.jpg', 'A delightful animated adventure perfect for the whole family to enjoy together.', 8.0);

-- --------------------------------------------------------

--
-- Table structure for table `theaters`
--

CREATE TABLE `theaters` (
  `theater_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `auditoriums_json` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `theaters`
--

INSERT INTO `theaters` (`theater_id`, `name`, `address`, `contact`, `city`, `auditoriums_json`) VALUES
(1, 'CineMax Kigali', 'KN 4 Ave, Kigali', '+250788123456', 'Kigali', '[]'),
(2, 'Century Cinemax', 'Kimihurura, Kigali', '+250788654321', 'Kigali', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `qr_code_url` varchar(255) DEFAULT NULL,
  `checked_in` tinyint(1) DEFAULT 0,
  `checked_in_at` timestamp NULL DEFAULT NULL,
  `canceled` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `order_item_id`, `qr_code_url`, `checked_in`, `checked_in_at`, `canceled`) VALUES
(1, 1, 'uploads/qrcodes/ticket_1.png', 0, NULL, 0),
(2, 2, 'uploads/qrcodes/ticket_2.png', 0, NULL, 0),
(3, 3, 'uploads/qrcodes/ticket_3.png', 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_types`
--

CREATE TABLE `ticket_types` (
  `type_id` int(11) NOT NULL,
  `show_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity_total` int(11) DEFAULT 0,
  `quantity_remaining` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_types`
--

INSERT INTO `ticket_types` (`type_id`, `show_id`, `name`, `price`, `quantity_total`, `quantity_remaining`) VALUES
(1, 1, 'Standard', 5000.00, 90, 90),
(2, 1, 'VIP', 10000.00, 10, 10),
(3, 2, 'Standard', 5000.00, 90, 85),
(4, 2, 'VIP', 10000.00, 10, 8),
(5, 3, 'Standard', 4000.00, 90, 88),
(6, 3, 'VIP', 8000.00, 10, 10),
(7, 4, 'Standard', 6000.00, 90, 90),
(8, 4, 'VIP', 12000.00, 10, 10),
(9, 5, 'Standard', 5500.00, 90, 90),
(10, 5, 'VIP', 11000.00, 10, 10),
(11, 6, 'Standard', 4500.00, 90, 90),
(12, 6, 'VIP', 9000.00, 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('customer','admin','staff') DEFAULT 'customer',
  `wallet_balance` decimal(10,2) DEFAULT 0.00,
  `loyalty_points` int(11) DEFAULT 0,
  `profile_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `role`, `wallet_balance`, `loyalty_points`, `profile_photo`, `created_at`) VALUES
(1, 'Admin User', 'admin@example.com', '$2y$10$e0NRg9Cz0z1fQhZ1uI7fEeKxk9pY/8J3q9H8Z1YfJwN8bqM8ZfE9G', '+250700000000', 'admin', 100.00, 200, NULL, '2025-11-30 11:37:57'),
(2, 'Alice Customer', 'alice@example.com', '$2y$10$e0NRg9Cz0z1fQhZ1uI7fEeKxk9pY/8J3q9H8Z1YfJwN8bqM8ZfE9G', '+250788111222', 'customer', 50.00, 30, NULL, '2025-11-30 11:37:57'),
(3, 'Bob Staff', 'bob@example.com', '$2y$10$e0NRg9Cz0z1fQhZ1uI7fEeKxk9pY/8J3q9H8Z1YfJwN8bqM8ZfE9G', '+250788333444', 'staff', 0.00, 0, NULL, '2025-11-30 11:37:57'),
(4, 'luna aganze', 'luna@gmail.com', '$2y$10$InVXH81PWGKAr7chRh.IcOfxXID4tHakgSDYIUjsRDLaBodW3oeuK', '+250789756742', 'customer', 0.00, 0, NULL, '2025-11-30 11:40:46'),
(5, 'josepha m', 'josepha@gmail.com', '$2y$10$Dgdx7grhTy0hkfBuDvDCruIJMSYpI27IZrwTRpUKo2kch/dpeczXa', '+250798578164', 'admin', 0.00, 0, NULL, '2025-11-30 11:41:44'),
(6, 'titi', 'titi@gmail.com', '$2y$10$xj5XYXyJspbPVU1dlCo.2eS08qDeqpXi.645Hc3JaCqjezkL5Qxdu', '0783456990', 'admin', 0.00, 0, 'uploads/profiles/692c2dccd03ba_WhatsApp Image 2025-11-27 at 9.06.14 PM (1).jpeg', '2025-11-30 11:43:08'),
(7, 'mere', 'mere@cinema.com', '$2y$10$e7juoLYm/yHETLz3FUjzTe3PM8H/VFHCtzcvaRyb3xHtSVgwvegsC', '+250798578163', 'customer', 0.00, 0, NULL, '2025-11-30 13:52:02'),
(8, 'mary uwera', 'osepha@cinema.com', '$2y$10$OcLtIsRjHHXng5DEdt45f.NRpd0ySq9QX2sP/SzOnYOQyoZN9tnR6', '+250798578168', 'staff', 0.00, 0, 'uploads/profiles/692c80799d8f4_cinema2.jpg', '2025-11-30 17:35:53'),
(9, 'uwera', 'uwera@gmail.com', '$2y$10$Tp.WuOhmrJt9XWsaXAaiEOTt5T9HL7nOc8T4HhKNV608uUGXRo/lu', '0784567893', 'admin', 0.00, 0, 'uploads/profiles/692c80a90980b_cimena1.jpg', '2025-11-30 17:36:41'),
(10, 'aganze', 'aganze@gmail.com', '$2y$10$oKBYzVM8XMEfopR48PvVbuXGHd7omue51rhItoveovbxu0A4UrJSy', '07865432356', 'customer', 0.00, 0, NULL, '2025-11-30 19:06:30'),
(11, 'clara', 'clara@gmail.com', '$2y$10$hoi6x2wULasjy1GwHpsXreht1DtpBmUBjN4ELe07Z7em/7dO8F02.', '07823456787', 'staff', 0.00, 0, 'uploads/profiles/692da266b8e64_cinema2.jpg', '2025-12-01 14:12:54'),
(12, 'cade', 'cade@gmail.com', '$2y$10$So2Xy0cgtzThqbbfX.KuxeIp4Kp6x0pTwXvgeYLAqJb5tgvdch8SC', '07865432134', 'admin', 0.00, 0, 'uploads/profiles/692da54b1990a_cinema4.jpg', '2025-12-01 14:25:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditoriums`
--
ALTER TABLE `auditoriums`
  ADD PRIMARY KEY (`aud_id`),
  ADD KEY `theater_id` (`theater_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `show_id` (`show_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notif_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `show_id` (`show_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `ticket_type_id` (`ticket_type_id`);

--
-- Indexes for table `shows`
--
ALTER TABLE `shows`
  ADD PRIMARY KEY (`show_id`),
  ADD KEY `auditorium_id` (`auditorium_id`),
  ADD KEY `idx_shows_date` (`date`);

--
-- Indexes for table `theaters`
--
ALTER TABLE `theaters`
  ADD PRIMARY KEY (`theater_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `idx_tickets_checked_in` (`checked_in`);

--
-- Indexes for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`type_id`),
  ADD KEY `show_id` (`show_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auditoriums`
--
ALTER TABLE `auditoriums`
  MODIFY `aud_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notif_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shows`
--
ALTER TABLE `shows`
  MODIFY `show_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `theaters`
--
ALTER TABLE `theaters`
  MODIFY `theater_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ticket_types`
--
ALTER TABLE `ticket_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auditoriums`
--
ALTER TABLE `auditoriums`
  ADD CONSTRAINT `auditoriums_ibfk_1` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`theater_id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`type_id`) ON DELETE CASCADE;

--
-- Constraints for table `shows`
--
ALTER TABLE `shows`
  ADD CONSTRAINT `shows_ibfk_1` FOREIGN KEY (`auditorium_id`) REFERENCES `auditoriums` (`aud_id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE CASCADE;

--
-- Constraints for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD CONSTRAINT `ticket_types_ibfk_1` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
