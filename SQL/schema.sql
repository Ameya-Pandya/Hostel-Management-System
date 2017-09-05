
create database kandi_hostel;

use kandi_hostel;

CREATE TABLE `kandi_hostel`.`student_table` ( `id` INT NOT NULL AUTO_INCREMENT , `student_id` VARCHAR(512) NOT NULL , `student_name` VARCHAR(50) NOT NULL , `college_name` VARCHAR(50) NOT NULL , `college_roll` INT(15) NOT NULL , `branch_name` VARCHAR(50) NOT NULL , `permanent_address` TEXT NOT NULL , `correspondence_address` TEXT NOT NULL , `parent_contact` VARCHAR(20) NOT NULL , `student_contact` VARCHAR(20) NOT NULL , `room_no` INT(5) NOT NULL , PRIMARY KEY (`student_id`), UNIQUE `id` (`id`)) ENGINE = InnoDB;

CREATE TABLE `kandi_hostel`.`office_table` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `student_id` VARCHAR(512) NOT NULL , `admission_date` TEXT NOT NULL , `next_payment_date` TEXT NOT NULL , `rent_finalized` INT(7) NOT NULL , `rent_balance` INT(7) NOT NULL , `rent_duration` TEXT NOT NULL , UNIQUE `id` (`id`), PRIMARY KEY (`student_id`)) ENGINE = InnoDB;

CREATE TABLE `kandi_hostel`.`documents_table` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `student_id` VARCHAR(512) NOT NULL , `student_photo` TEXT NOT NULL , `aadhar_card_photo` TEXT NOT NULL , `college_id_photo` TEXT NOT NULL , UNIQUE `id` (`id`), PRIMARY KEY (`student_id`)) ENGINE = InnoDB;