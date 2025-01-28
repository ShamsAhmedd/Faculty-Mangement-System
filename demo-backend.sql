-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2023 at 02:05 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo-backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '0=inactive\r\n1=active',
  `instructorID` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `code`, `status`, `instructorID`) VALUES
(1, 'internet application', 'is305', 'active', 5),
(2, 'graphics', 'is303', 'active', 7),
(3, 'system analysis', 'IS313', 'active', 6),
(4, 'system engineer', 'IS320', 'in active', NULL),
(5, 'data structure', 'cs310', 'in active', NULL),
(6, 'multi media', 'it310', 'in active', NULL),
(7, 'operating system', 'is201', 'active', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `studentcourse`
--

CREATE TABLE `studentcourse` (
  `studentID` int(11) DEFAULT NULL,
  `courseID` int(11) DEFAULT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentcourse`
--

INSERT INTO `studentcourse` (`studentID`, `courseID`, `grade`) VALUES
(4, 1, 95);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '0=in active\r\n1=active',
  `role` varchar(3) NOT NULL DEFAULT '0' COMMENT '0=student\r\n1=admin\r\n2=instructor',
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `status`, `role`, `token`) VALUES
(1, 'maria ashraf', 'mariaashraf@gmail.com', '$2b$10$T/4t/gwpmkk3EiM5Z2W.c.RWEWUuLSN8Z8.R63/s.AwhcTxC.AYCu', '', 'active', '1', 'c81aca3a17e3de133e46155aae9d5d17'),
(2, 'shams ahmed', 'shamsAhmed@gmail.com', '$2b$10$zXhbK22q4Cvs7kzSPGRHpOF2zGZs.vScMlkvSRCSVYzjymWCyH0Fm', '', 'active', '1', '3bf2a16880a7aaa2a4cf4d1e8a7963b3'),
(3, 'mario emad', 'marioemad@gmail.com', '$2b$10$pj561CSv.zbSh0aVTv80oOCV/IEPJ61d9OYG3Z5KWG8sGZElOO..6', '', 'active', '0', '5ba62c85f95fc3673366e419e822f315'),
(4, 'abdelaziz hassan', 'zozhassan@gmail.com', '$2b$10$ppwhKW2MpJNmVUr8MYVVd.N5I8QnJOB8xj0NiCYBkVViC.AadEmTq', '', 'active', '0', '6972ff4ef8c03aaa672dad02ebc6709d'),
(5, 'hanan', 'hanan@gmail.com', '$2b$10$omVsTPpGgOAP7riyUHCIVeSKWHirZkln2DziTd35RwqtCjGD4eIl.', '01200003', 'active', '2', '142b6f5d066f25d47a072d29cf6c02f9'),
(6, 'amr ghonim', 'amrGhonim@gmail.com', '$2b$10$zloDUHy8NxUSSki8JmtzIeeS7KYwuRiV6J.IKjx5qchPuAWkrj/FO', '012345678', 'active', '2', 'f18969fff62299dad8dd2d77dbea15ca'),
(7, 'ahmed elsaid', 'ahmedelsaid@gmail.com', '$2b$10$1jAoGpw2wBtdY5wa34vu0OR8EIwgBv2qC19QIrgBna3fXBMJ7Hv9y', '01200000', 'in active', '2', '396efcbcd4e0e019920e88662bab265c'),
(8, 'reem aymen', 'reemAymen@gmail.com', '$2b$10$fDp9Lx8fhut6FZyQUfauX.gA7Zko.JwyIsjvJslNWWNxyQmRbzbXm', '', 'active', '0', '308038cbb0515f1e8a6255ad6041bb48'),
(9, 'menna salah', 'mennasalah@gmail.com', '$2b$10$J5tfwdrCkJ4QpODkGAN4hOkN8QDoxrl5WjyGh/68.Tc96zo6cTdAK', '', 'active', '0', '805de45cdbae0355f218a97156469305');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructor-const-id` (`instructorID`);

--
-- Indexes for table `studentcourse`
--
ALTER TABLE `studentcourse`
  ADD KEY `student-const-id` (`studentID`),
  ADD KEY `course-const-id` (`courseID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `instructor-const-id` FOREIGN KEY (`instructorID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studentcourse`
--
ALTER TABLE `studentcourse`
  ADD CONSTRAINT `course-const-id` FOREIGN KEY (`courseID`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student-const-id` FOREIGN KEY (`studentID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
