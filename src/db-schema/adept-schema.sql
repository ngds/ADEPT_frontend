--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: geothermal; Type: DATABASE; Schema: -; Owner: ngdsdb
--

CREATE DATABASE geothermal WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE geothermal OWNER TO ngdsdb;

\connect geothermal

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: collection_records; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.collection_records VALUES (59, 57, '5d458cfc0b45c76cafa31c58', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (60, 57, '5d42bfc70b45c76cafa29f69', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (63, 54, '5da3ecb1998e17af82539f65', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (64, 54, '5777492acf58f192390cca4c', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (66, 61, '5da3ecb1998e17af82539f65', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (67, 61, '5777492acf58f192390cca4c', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (68, 61, '58f3e9abcf58f10eb2b3cf30', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (69, 57, '5da3ecb1998e17af82539f65', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (70, 57, '58ebc85bcf58f107077af917', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (73, 71, '5d9c2d80998e17af82525f9a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (74, 71, '54f5a69ae13823054496a747', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (78, 76, '59d8666acf58f14820c1c26c', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (79, 76, '5880804fcf58f1bf0fbf72dd', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (82, 80, '5d18b9ae0b45c76caf909222', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (83, 80, '5d18655a0b45c76caf90895d', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (92, 10, '57', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (126, 117, '5962763fcf58f175c7855ff3', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (127, 117, '59627d49cf58f177f582768b', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (128, 117, '59697eafcf58f11d5925a3c8', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (129, 54, '597c8708cf58f1578ae08b46', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (130, 117, '59698cf5cf58f122cc9d46d9', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (131, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (132, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (133, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (134, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (135, 117, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (136, 117, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (137, 117, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (138, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (139, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (140, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (141, 97, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (142, 97, '5960d768cf58f1af1bb40bda', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (143, 117, '5960e57acf58f1b3a773bd32', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (145, 97, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (146, 99, '598cad6ecf58f17ac3321fa2', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (147, 99, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (148, 99, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (149, 99, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (150, 97, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (151, 99, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (152, 99, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (153, 97, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (154, 117, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (155, 99, '5960d768cf58f1af1bb40bda', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (156, 99, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (157, 97, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (158, 100, '5960d768cf58f1af1bb40bda', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (159, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (160, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (161, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (162, 99, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (163, 99, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (164, 101, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (165, 98, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (166, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (167, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (168, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (169, 101, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (170, 117, '5960d768cf58f1af1bb40bda', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (171, 117, '5960e57acf58f1b3a773bd32', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (172, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (173, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (174, 117, '5960d768cf58f1af1bb40bda', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (175, 100, '5960e57acf58f1b3a773bd32', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (176, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (177, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (178, 117, '598cc26ecf58f1814e5e5863', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (179, 117, '598cecbccf58f18e5ea8e1cd', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (180, 117, '598cecbccf58f18e5ea8e1cd', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (182, 117, '5961089dcf58f1beeffa17db', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (183, 117, '5961089dcf58f1beeffa17db', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (184, 117, '596140eccf58f112a2f19ce9', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (185, 117, '5962450fcf58f166112e8993', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (186, 117, '5962450fcf58f166112e8993', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (187, 117, '5bde52f3cf58f17627bd4942', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (189, 117, '5960e57acf58f1b3a773bd32', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (190, 117, '59627d49cf58f177f582768b', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (191, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (192, 117, '5bde28b8cf58f15c0aabed8d', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (193, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (194, 117, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (195, 117, '598ce5bacf58f18bfe40a0c4', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (196, 117, '598ce5bacf58f18bfe40a0c4', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (197, 61, '597a6977cf58f1678934f862', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (200, 117, '5961089dcf58f1beeffa17db', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (201, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (202, 8, '50', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (203, 8, '50', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (204, 8, '50', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (205, 8, '50', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (208, 8, '206', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (209, 117, '5960e57acf58f1b3a773bd32', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (210, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (211, 117, '5960d75bcf58f1af1bb40b83', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (212, 117, 'undefined', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (213, 117, 'undefined', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (214, 97, '598cc97dcf58f18351ca6e89', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (215, 117, '598cfaaacf58f192bb030773', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (216, 117, '598cfaaacf58f192bb030773', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (217, 117, '598cecbccf58f18e5ea8e1cd', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (220, 117, '5960ec82cf58f1b6011e9fd5', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (221, 117, '596140eccf58f112a2f19ce9', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (223, 97, '5d35cbef0b45c76caf93b369', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (224, 117, '5d35cbf00b45c76caf93b4f8', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (231, 109, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (232, 117, '598ca651cf58f178ab8fc32a', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (233, 109, '598ca660cf58f178ab8fc342', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (234, 97, '598ca65fcf58f178ab8fc340', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (235, 117, '5d35cbef0b45c76caf93b369', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (236, 117, '5d35cbef0b45c76caf93b369', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (237, 14, '117', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (238, 14, '117', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (239, 99, '5d35cbef0b45c76caf93b369', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (240, 99, '5a2d2ffdcf58f1aef4632685', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (241, 14, '117', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (242, 14, '117', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (243, 10, '54', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (247, 14, '244', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (254, 251, '5969c4b3cf58f13866656dde', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (284, 111, '598ca64ecf58f178ab8fc321', 'doi', 'active');
INSERT INTO adept.collection_records VALUES (285, 111, '598ca651cf58f178ab8fc32a', 'doi', 'active');


--
-- Data for Name: collection_search; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.collection_search VALUES (20, 18, 'csdco', '{"term":"csdco","dataset":"geothermal","dict":"opencoredata"}', 'active', 9);
INSERT INTO adept.collection_search VALUES (21, 16, 'surface', '{"term":"surface","pubname":"Water Supply Paper","dataset":"geothermal","recent":"true","dict":"ngds"}', 'active', 1526);
INSERT INTO adept.collection_search VALUES (22, 7, 'chile', '{"term":"chile","pubname":"New Scientist","dataset":"geothermal","dict":"ngds"}', 'active', 42);
INSERT INTO adept.collection_search VALUES (23, 7, 'active fault', '{"term":"active fault","pubname":"New Scientist","dataset":"geothermal","dict":"ngds"}', 'active', 22);
INSERT INTO adept.collection_search VALUES (24, 16, 'Arizona', '{"term":"Arizona","pubname":"Water Supply Paper","dataset":"geothermal","recent":"true","dict":"ngds"}', 'active', 465);
INSERT INTO adept.collection_search VALUES (25, 19, 'Arizona', '{"term":"Arizona","pubname":"Geology Today","publisher":"Wiley","dataset":"geothermal","dict":"ngds"}', 'active', 90);
INSERT INTO adept.collection_search VALUES (26, 19, 'Grand Canyon', '{"term":"Grand Canyon","pubname":"Terra Nova","publisher":"Wiley","dataset":"geothermal","dict":"ngds"}', 'active', 13);
INSERT INTO adept.collection_search VALUES (28, 27, 'lipid', '{"term":"lipid","pubname_like":"Organic Geochemistry","dataset":"geothermal","dict":"ngds"}', 'active', 2643);
INSERT INTO adept.collection_search VALUES (29, 16, 'aquifuge', '{"term":"aquifuge","pubname":"International Journal of Water Resources Development","dataset":"geothermal","dict":"reservoir"}', 'active', 3);
INSERT INTO adept.collection_search VALUES (30, 16, 'active fault', '{"term":"active fault","pubname":"Soil Dynamics and Earthquake Engineering","dataset":"geothermal","dict":"ngds"}', 'active', 213);
INSERT INTO adept.collection_search VALUES (32, 16, 'chemical', '{"term":"chemical","pubname":"Ore Geology Reviews","dataset":"geothermal"}', 'active', 2191);
INSERT INTO adept.collection_search VALUES (37, 36, 'aqueous chemistry', '{"term":"aqueous chemistry","dataset":"geothermal","dict":"ngds"}', 'active', 2849);
INSERT INTO adept.collection_search VALUES (38, 36, 'volcanic vents', '{"term":"volcanic vents","dataset":"geothermal","dict":"ngds"}', 'active', 4411);
INSERT INTO adept.collection_search VALUES (55, 54, 'Aluminite', '{"term":"Aluminite","dataset":"geothermal","dict":"ngds"}', 'active', 111);
INSERT INTO adept.collection_search VALUES (58, 57, 'Carbonyl', '{"term":"Carbonyl","dataset":"geothermal","dict":"ngds"}', 'active', 7356);
INSERT INTO adept.collection_search VALUES (77, 76, 'Bombesin', '{"term":"Bombesin","dataset":"geothermal","dict":"ngds"}', 'active', 58);
INSERT INTO adept.collection_search VALUES (81, 80, 'Arizona', '{"term":"Arizona","dataset":"geothermal"}', 'active', 52143);
INSERT INTO adept.collection_search VALUES (90, 89, 'Bombesin', '{"term":"Bombesin","dataset":"geothermal","dict":"ngds"}', 'active', 58);
INSERT INTO adept.collection_search VALUES (94, 61, 'panama canal', '{"term":"panama canal","dataset":"geothermal","dict":"ngds"}', 'active', 1574);
INSERT INTO adept.collection_search VALUES (106, 97, 'gem', '{"term":"gem","dataset":"geothermal","dict":"ngds"}', 'active', 347692);
INSERT INTO adept.collection_search VALUES (108, 97, 'limestone', '{"term":"limestone","dataset":"geothermal"}', 'active', 105497);
INSERT INTO adept.collection_search VALUES (112, 111, 'iron', '{"term":"iron","dataset":"geothermal","dict":"ngds"}', 'active', 175366);
INSERT INTO adept.collection_search VALUES (113, 111, 'bauxite', '{"term":"bauxite","dataset":"geothermal","dict":"ngds"}', 'active', 83778);
INSERT INTO adept.collection_search VALUES (115, 97, 'sandstone', '{"term":"sandstone","dataset":"geothermal"}', 'active', 119030);
INSERT INTO adept.collection_search VALUES (116, 97, 'gold deposit', '{"term":"gold deposit","dataset":"geothermal"}', 'active', 13320);
INSERT INTO adept.collection_search VALUES (124, 111, 'bacon', '{"term":"bacon","dataset":"geothermal","dict":"ngds"}', 'active', 16352);
INSERT INTO adept.collection_search VALUES (125, 117, 'limestone', '{"term":"limestone","dataset":"geothermal","dict":"ngds"}', 'active', 105497);
INSERT INTO adept.collection_search VALUES (144, 117, '', '{"dataset":"geothermal","dict":"ngds"}', 'active', 756020);
INSERT INTO adept.collection_search VALUES (225, 54, 'wyoming', '{"term":"wyoming","pubname":"Annual Report","publisher":"USGS","dataset":"geothermal","dict":"ngds"}', 'active', 100);
INSERT INTO adept.collection_search VALUES (245, 244, 'sand and gravel', '{"term":"sand and gravel","dataset":"geothermal","dict":"ngds"}', 'active', 24622);
INSERT INTO adept.collection_search VALUES (248, 99, 'Bookman', '{"term":"Bookman","dataset":"geothermal","dict":"ngds"}', 'active', 505);
INSERT INTO adept.collection_search VALUES (252, 250, 'taco', '{"term":"taco"}', 'active', 6009);
INSERT INTO adept.collection_search VALUES (253, 251, 'glass beads', '{"term":"glass beads"}', 'active', 44474);
INSERT INTO adept.collection_search VALUES (255, 102, '', '{"pubname":"A Handbook on Biotelemetry and Radio Tracking"}', 'active', 12);
INSERT INTO adept.collection_search VALUES (263, 244, 'lime', '{"term":"lime","dataset":"geothermal","dict":"ngds"}', 'active', 105497);
INSERT INTO adept.collection_search VALUES (264, 111, 'limestone', '{"term":"limestone"}', 'active', 217928);
INSERT INTO adept.collection_search VALUES (265, 117, 'limestone', '{"term":"limestone","dataset":"geothermal","dict":"ngds"}', 'active', 13954550);
INSERT INTO adept.collection_search VALUES (267, 266, 'limestone', '{"term":"limestone"}', 'active', 217928);
INSERT INTO adept.collection_search VALUES (270, 54, 'bacon', '{"term":"bacon"}', 'active', 145397);
INSERT INTO adept.collection_search VALUES (272, 271, 'granite', '{"term":"granite"}', 'active', 192994);
INSERT INTO adept.collection_search VALUES (273, 54, '', '{}', 'active', 13957407);
INSERT INTO adept.collection_search VALUES (274, 54, 'apatite', '{"term":"apatite"}', 'active', 79234);
INSERT INTO adept.collection_search VALUES (275, 54, 'apatite', '{"term":"apatite"}', 'active', 79234);
INSERT INTO adept.collection_search VALUES (276, 54, 'graphite fiber', '{"term":"graphite fiber"}', 'active', 1296);
INSERT INTO adept.collection_search VALUES (277, 91, 'shadow puppet', '{"term":"shadow puppet"}', 'active', 527);
INSERT INTO adept.collection_search VALUES (278, 91, 'mineralizing hydrothermal', '{"term":"mineralizing hydrothermal"}', 'active', 1138);
INSERT INTO adept.collection_search VALUES (279, 91, 'mineralizing hydrothermal', '{"term":"mineralizing hydrothermal"}', 'active', 1138);
INSERT INTO adept.collection_search VALUES (280, 250, 'subway', '{"term":"subway"}', 'active', 22415);
INSERT INTO adept.collection_search VALUES (281, 266, 'turkey', '{"term":"turkey"}', 'active', 394483);
INSERT INTO adept.collection_search VALUES (286, 261, 'body fossil', '{"term":"body fossil"}', 'active', 4903);
INSERT INTO adept.collection_search VALUES (287, 261, 'body fossil', '{"term":"body fossil"}', 'active', 4903);
INSERT INTO adept.collection_search VALUES (295, 268, 'test', '{"term":"test"}', 'active', 6884500);


--
-- Data for Name: collections; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.collections VALUES (7, 'Chile', 'user', 1, 'new', 'none', 'active', '2020-11-12 01:50:03.313837', NULL);
INSERT INTO adept.collections VALUES (16, 'Geothermal', 'user', 1, 'new', 'none', 'active', '2020-11-16 21:47:25.592461', NULL);
INSERT INTO adept.collections VALUES (18, 'glacial', 'user', 1, 'new', 'none', 'active', '2020-11-16 21:50:20.767699', NULL);
INSERT INTO adept.collections VALUES (19, 'Fissure Set', 'user', 1, 'new', 'none', 'active', '2020-11-16 21:54:01.962952', NULL);
INSERT INTO adept.collections VALUES (27, 'Organic Chemistry', 'user', 1, 'new', 'none', 'active', '2020-11-17 01:18:17.141673', NULL);
INSERT INTO adept.collections VALUES (36, 'Demo Set', 'user', 9, 'new', 'none', 'active', '2020-11-17 20:33:26.627167', NULL);
INSERT INTO adept.collections VALUES (39, 'Volcanic', 'user', 1, 'new', 'none', 'active', '2020-11-17 20:46:06.560083', NULL);
INSERT INTO adept.collections VALUES (54, 'test-unit', 'user', 10, 'new', 'none', 'active', '2021-04-08 19:09:08.975955', NULL);
INSERT INTO adept.collections VALUES (57, 'user-Set-2', 'user', 10, 'new', 'none', 'active', '2021-04-08 22:02:07.0568', NULL);
INSERT INTO adept.collections VALUES (61, 'Saved-user-search', 'user', 10, 'new', 'none', 'active', '2021-04-12 20:24:23.280826', NULL);
INSERT INTO adept.collections VALUES (71, 'testset3', 'user', 10, 'new', 'none', 'active', '2021-04-13 19:13:11.956264', NULL);
INSERT INTO adept.collections VALUES (76, 'new saved set', 'user', 10, 'new', 'none', 'active', '2021-04-21 19:12:35.954772', NULL);
INSERT INTO adept.collections VALUES (80, 'test3user saved set', 'user', 13, 'new', 'none', 'active', '2021-04-21 19:27:46.960686', NULL);
INSERT INTO adept.collections VALUES (86, 'Geothermal', 'user', 15, 'new', 'none', 'active', '2021-04-29 22:17:13.953014', NULL);
INSERT INTO adept.collections VALUES (89, 'onyx', 'user', 11, 'new', 'none', 'active', '2021-05-02 18:31:36.5518', NULL);
INSERT INTO adept.collections VALUES (91, 'Seven Sets', 'user', 10, 'new', 'none', 'active', '2021-05-04 15:38:36.678174', NULL);
INSERT INTO adept.collections VALUES (97, '', 'user', 14, 'new', 'none', 'active', '2021-06-22 15:56:55.423824', NULL);
INSERT INTO adept.collections VALUES (98, 'yes', 'user', 14, 'new', 'none', 'active', '2021-06-23 17:45:21.419036', NULL);
INSERT INTO adept.collections VALUES (99, 'Laura', 'user', 14, 'new', 'none', 'active', '2021-06-23 17:48:14.847567', NULL);
INSERT INTO adept.collections VALUES (100, 'undefined', 'user', 14, 'new', 'none', 'active', '2021-06-23 17:59:07.583204', NULL);
INSERT INTO adept.collections VALUES (101, 'undefined', 'user', 14, 'new', 'none', 'active', '2021-06-23 17:59:14.331404', NULL);
INSERT INTO adept.collections VALUES (102, 'testjune', 'user', 10, 'new', 'none', 'active', '2021-06-23 17:59:39.829269', NULL);
INSERT INTO adept.collections VALUES (103, 'testjune', 'user', 10, 'new', 'none', 'active', '2021-06-23 18:06:55.544192', NULL);
INSERT INTO adept.collections VALUES (104, 'test-june-2', 'user', 10, 'new', 'none', 'active', '2021-06-23 18:38:00.830554', NULL);
INSERT INTO adept.collections VALUES (109, 'new', 'user', 14, 'new', 'none', 'active', '2021-07-02 22:48:29.629781', NULL);
INSERT INTO adept.collections VALUES (111, 'STAYcation', 'user', 10, 'new', 'none', 'active', '2021-07-06 21:10:37.579414', NULL);
INSERT INTO adept.collections VALUES (117, 'NEWGOLD', 'user', 14, 'new', 'none', 'active', '2021-07-06 21:17:20.547515', NULL);
INSERT INTO adept.collections VALUES (244, 'newhello', 'user', 14, 'new', 'none', 'active', '2021-07-15 17:28:55.444127', NULL);
INSERT INTO adept.collections VALUES (250, 'BrokenSaves', 'user', 10, 'new', 'none', 'active', '2021-08-10 21:36:58.253214', NULL);
INSERT INTO adept.collections VALUES (251, 'New2021', 'user', 14, 'new', 'none', 'active', '2021-08-10 21:37:27.092839', NULL);
INSERT INTO adept.collections VALUES (261, 'Paleontology', 'user', 8, 'new', 'none', 'active', '2021-08-16 16:10:37.044613', NULL);
INSERT INTO adept.collections VALUES (262, 'Geothermal', 'user', 8, 'new', 'none', 'active', '2021-08-16 16:10:40.833223', NULL);
INSERT INTO adept.collections VALUES (266, 'NewDataSet', 'user', 10, 'new', 'none', 'active', '2021-08-16 22:22:41.325648', NULL);
INSERT INTO adept.collections VALUES (268, 'newaug', 'user', 14, 'new', 'none', 'active', '2021-08-16 22:23:23.286095', NULL);
INSERT INTO adept.collections VALUES (271, 'new-aug-search', 'user', 10, 'new', 'none', 'active', '2021-08-16 22:53:00.826883', NULL);


--
-- Data for Name: dictionaries; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.dictionaries VALUES (12, 'tensor', 'tensor', 'false', '2020-10-06 00:00:00', './dictionaries/tensor', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (4, 'strom', 'stromatalites', 'false', '2020-10-12 00:00:00', './dictionaries/strom', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (5, 'carbon', 'carbon', 'false', '2020-10-06 00:00:00', './dictionaries/carbon', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (32, 'regions', 'region', 'true', '2020-10-12 00:00:00', 'https://macrostrat.org/api/places?placetype=region', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (31, 'shale', 'shale', 'false', '2020-10-12 00:00:00', './dictionaries/shale_attributes', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (34, 'IGSNs', 'IGSN', 'true', '2020-10-06 00:00:00', './dictionaries/IGSNs', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (35, 'museum_abbreviations', 'museum', 'false', '2020-10-12 00:00:00', './dictionaries/museum_abbreviations', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (6, 'cr', 'mineral', 'false', '2020-10-12 00:00:00', './dictionaries/Cr_minerals', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (7, 'co', 'mineral', 'false', '2020-10-12 00:00:00', './dictionaries/Co_minerals', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (15, 'genes', 'genes', 'true', '2020-10-06 00:00:00', './dictionaries/genes', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (36, 'point_count', 'point count', 'false', '2020-10-12 00:00:00', './dictionaries/point_count', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (13, 'pyrite', 'pyrite', 'false', '2020-10-06 00:00:00', './dictionaries/pyrite', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (37, 'encrinites', 'encrinites', 'false', '2020-10-06 00:00:00', './dictionaries/encrinites', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (20, 'museums', 'museum', 'true', '2020-10-06 00:00:00', './dictionaries/museums', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (19, 'ophiolite', 'ophiolite', 'false', '2020-10-12 00:00:00', './dictionaries/ophiolite', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (42, 'biosecurity', 'plant_pest', 'true', '2020-10-06 00:00:00', './dictionaries/biosecurity.json', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (43, 'bryozoa', 'bryozoa', 'false', '2020-10-12 00:00:00', './dictionaries/bryozoa', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (40, 'whole_rock_geochem', 'whole_rock_geochem', 'false', '2020-10-12 00:00:00', './dictionaries/whole_rock_geochem', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (25, 'sandstones', 'sandstones', 'null', '2020-10-12 00:00:00', './dictionaries/sandstones', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (16, 'pollen_diagram', 'pollen diagram', 'false', '2020-10-12 00:00:00', './dictionaries/pollen_diagram', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (14, 'lead', 'lead', 'false', '2020-10-12 00:00:00', './dictionaries/lead', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (23, 'countries', 'place', 'true', '2020-10-06 00:00:00', 'https://macrostrat.org/api/places?placetype=country', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (44, 'ITIS', 'taxa', 'true', '2020-10-12 00:00:00', './dictionaries/ITIS.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (21, 'v', 'mineral', 'null', '2020-10-12 00:00:00', './dictionaries/V_minerals', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (29, 'intervals', 'interval', 'true', '2020-10-06 00:00:00', 'https://macrostrat.org/api/defs/intervals?all', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (45, 'leah', 'location', 'true', '2020-10-06 00:00:00', './dictionaries/leah', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (46, 'bryozoa_genera', 'genus', 'true', '2020-10-06 00:00:00', 'https://raw.githubusercontent.com/kopperud/dictionary_bryozoa_genera/master/dictionary.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (48, 'ichnofossils', 'taxon', 'true', '2020-10-06 00:00:00', './dictionaries/ichnofossils.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (30, 'continents', 'continent', 'true', '2020-10-06 00:00:00', 'https://macrostrat.org/api/places?placetype=continent', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (49, 'volcanic_ash', '', 'false', '2020-10-12 00:00:00', './dictionaries/volcanic_ash', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (50, 'location_signals', '', 'true', '2020-10-12 00:00:00', './dictionaries/location_signals', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (52, 'lustres', '', 'false', '2020-10-12 00:00:00', './dictionaries/lustres', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (51, 'prokaryotic_type_strains', '', 'true', '2018-08-22 00:00:00', './dictionaries/prokaryotic_species', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (53, 'colors', '', 'false', '2020-10-06 00:00:00', './dictionaries/colors', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (54, 'mineral_geochem', '', 'false', '2020-10-12 00:00:00', './dictionaries/mineral_geochem', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (55, 'crystal_forms', '', 'false', '2020-10-06 00:00:00', './dictionaries/crystal_forms', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (57, 'geology_rutgers_custom', 'rock', 'false', '2018-10-30 00:00:00', './dictionaries/geology_rutgers_custom', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (58, 'agnathan_genera', 'taxa', 'true', '2020-10-06 00:00:00', 'https://raw.githubusercontent.com/cambro/dictionary_example/master/dictionary.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (59, 'NAS_ITIS', 'taxa', 'true', '2020-10-06 00:00:00', './dictionaries/nas_species_itis.txt', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (26, 'sandstone_attributes', 'sandstone_attributes', 'null', '2020-10-12 00:00:00', './dictionaries/sandstone_attributes', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (60, 'protein_families', '"protein_familes"', 'true', '2020-10-12 00:00:00', './dictionaries/fplx_terms', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (61, 'biological_processes', '"biological processes"', 'true', '2020-10-13 00:00:00', './dictionaries/go_mesh_terms', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (62, 'chemicals', '"chemical"', 'true', '2020-10-12 00:00:00', './dictionaries/chebi_terms', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (63, 'virii', 'virus', 'true', '2020-10-12 00:00:00', 'https://raw.githubusercontent.com/ZhaoqingCui/dictionary_example/master/dictionary_virus.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (64, 'cell_line', 'virus', 'true', '2020-10-12 00:00:00', 'https://raw.githubusercontent.com/ZhaoqingCui/dictionary_example/master/dictionary_cell_line.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (65, 'covid-19', 'virus', 'true', '2020-10-21 00:00:00', 'https://raw.githubusercontent.com/UW-COSMOS/dictionary_example/master/dictionary.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (66, 'covid-19_drugs', 'drugs', 'true', '2020-10-13 00:00:00', './dictionaries/covid-19_drugs.csv', 'false', 'active');
INSERT INTO adept.dictionaries VALUES (1, 'stratigraphic_names', 'stratigraphic_name', 'true', '2020-10-12 00:00:00', 'https://macrostrat.org/api/v2/defs/strat_names?all', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (9, 'hydro', 'hydro', 'false', '2020-10-12 00:00:00', './dictionaries/hydro', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (2, 'lithologies', 'lithology', 'false', '2020-10-13 00:00:00', 'https://macrostrat.org/api/v2/defs/lithologies?all', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (38, 'geochron', 'geochron', 'true', '2020-10-12 00:00:00', './dictionaries/geochron', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (17, 'reservoir', 'reservoir', 'false', '2020-10-12 00:00:00', './dictionaries/reservoir', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (18, 'opencoredata', 'opencoredata', 'false', '2020-10-12 00:00:00', './dictionaries/opencoredata', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (10, 'carbon_isotope', 'carbon_isotope', 'false', '2020-10-06 00:00:00', './dictionaries/carbon_isotope', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (47, 'ngds', '', 'false', '2020-10-13 00:00:00', './dictionaries/ngds_dict.csv', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (11, 'minerals', 'mineral', 'false', '2020-10-13 00:00:00', 'https://macrostrat.org/api/v2/defs/minerals?all', 'true', 'active');
INSERT INTO adept.dictionaries VALUES (56, 'international_intervals', 'interval', 'true', '2020-10-06 00:00:00', 'https://macrostrat.org/api/defs/intervals?timescale=international', 'false', 'active');


--
-- Data for Name: dictionary_terms; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.dictionary_terms VALUES (1, 12, 'frog', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (2, 12, 'leg', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (5, 13, ' Garlic', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (6, 13, ' Pickles', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (7, 14, 'Dust', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (8, 14, ' Mites', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (9, 14, ' Rectangles', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (10, 15, 'Dolphins', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (11, 15, ' Cats', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (12, 15, ' Winnebagos', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (4, 13, 'cabbage', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (13, 5, 'bingo', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (14, 5, 'frogs', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (15, 5, 'zippers', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (3, 12, 'frodo baggins', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (17, 8, 'lapidary', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (18, 16, 'Carrots', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (19, 16, ' Mesquite', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (20, 16, ' Saguaro', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (22, 16, ' Creosote', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (23, 16, ' Elm Tree', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (24, 16, ' Desert Broom', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (25, 17, 'carrots', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (26, 17, ' beets', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (28, 17, 'spinach', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (29, 17, 'pickles', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (21, 16, 'testthis', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (30, 18, 'help', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (31, 18, ' test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (32, 18, ' new', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (33, 19, 'help', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (34, 19, ' test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (35, 19, ' new', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (36, 19, ' study', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (37, 20, 'help', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (38, 20, ' study', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (39, 20, ' new', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (40, 20, ' test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (41, 13, 'bog', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (42, 21, 'test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (43, 21, ' new', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (44, 21, ' old', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (45, 21, ' study', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (46, 22, 'help', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (47, 22, ' Laura', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (48, 22, ' test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (49, 23, 'new', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (50, 23, ' help', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (51, 23, ' test', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (52, 24, 'ian', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (53, 24, ' why', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (54, 24, ' cant', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (55, 24, ' this', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (56, 24, ' work?', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (57, 25, 'apples', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (58, 25, ' oranges', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (59, 25, ' tangerine', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (60, 26, 'will', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (61, 26, 'url', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (62, 26, 'work', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (67, 28, 'hello', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (68, 28, ' hey', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (69, 28, ' yo', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (70, 29, 'apple', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (71, 29, ' berry', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (72, 29, ' cat', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (73, 30, 'a', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (74, 30, 'b', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (75, 30, 'c', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (76, 30, 'd', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (77, 27, 'bongo', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (78, 27, 'tuba', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (79, 27, 'flute', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (80, 31, 'Spaghetti', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (81, 31, ' rigotoni', 0, 'new', 'active');
INSERT INTO adept.dictionary_terms VALUES (82, 31, ' calzone', 0, 'new', 'active');


--
-- Data for Name: process_activity; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.process_activity VALUES (1, 1, 'Request Test Set', 'Dataset', 16, NULL, NULL, 'local', '2020-11-18 18:54:09.547801', NULL, 'active');
INSERT INTO adept.process_activity VALUES (2, 1, 'Request Test Set', 'Dictionary', NULL, 2, NULL, 'local', '2020-11-18 18:55:26.143949', NULL, 'active');
INSERT INTO adept.process_activity VALUES (3, 8, 'Request Test Set', 'Dictionary', NULL, 3, NULL, 'local', '2020-11-18 18:59:31.452608', NULL, 'active');
INSERT INTO adept.process_activity VALUES (4, 8, 'Request Test Set', 'Dataset', 33, NULL, NULL, 'local', '2020-11-18 19:00:57.116634', NULL, 'active');
INSERT INTO adept.process_activity VALUES (5, 8, 'Received Test Set', 'Test Set', NULL, NULL, 4, 'https://xdd.wisc.edu/api/products', '2020-11-18 19:02:08.595458', NULL, 'complete');
INSERT INTO adept.process_activity VALUES (6, 8, 'Received Test Set', 'Test Set', NULL, NULL, 5, 'https://xdd.wisc.edu/api/products', '2020-11-18 19:02:25.738901', NULL, 'complete');
INSERT INTO adept.process_activity VALUES (7, 8, 'Received Test Set', 'Test Set', NULL, NULL, 6, 'https://xdd.wisc.edu/api/products', '2020-11-18 19:02:30.135424', NULL, 'complete');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.roles VALUES (1, 'admin', 'admin', 'a', 'active');
INSERT INTO adept.roles VALUES (2, 'user', 'power user', 'u', 'active');


--
-- Data for Name: test_sets; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.test_sets VALUES (1, 10, NULL, 'scienceparse', 'c2f661f9-8f34-4d14-b023-a8edbb55fb66', 'https://xdd.wisc.edu/api/products?api_key=c2f661f9-8f34-4d14-b023-a8edbb55fb66&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (2, 10, NULL, 'lithologies', '6c5023f4-a4d5-466d-810e-c8882335c366', 'https://xdd.wisc.edu/api/products?api_key=6c5023f4-a4d5-466d-810e-c8882335c366&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (3, 10, NULL, 'strat names', '9243ba37-953c-4dd3-b46e-37ff1f325c52', 'https://xdd.wisc.edu/api/products?api_key=9243ba37-953c-4dd3-b46e-37ff1f325c52&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (4, 14, NULL, 'scienceparse', 'c2f661f9-8f34-4d14-b023-a8edbb55fb66', 'https://xdd.wisc.edu/api/products?api_key=c2f661f9-8f34-4d14-b023-a8edbb55fb66&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (5, 14, NULL, 'lithologies', '6c5023f4-a4d5-466d-810e-c8882335c366', 'https://xdd.wisc.edu/api/products?api_key=6c5023f4-a4d5-466d-810e-c8882335c366&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (6, 14, NULL, 'strat names', '9243ba37-953c-4dd3-b46e-37ff1f325c52', 'https://xdd.wisc.edu/api/products?api_key=9243ba37-953c-4dd3-b46e-37ff1f325c52&products=scienceparse', 'ready', 'active', NULL);
INSERT INTO adept.test_sets VALUES (7, 14, 99, 'TESTSET NAME', 'XXXXX', 'https://xdd.wisc.edu/api/products?api_key=undefined&products=TESTSET NAME', 'ready', 'active', '2021-07-02 22:12:41.662183');
INSERT INTO adept.test_sets VALUES (8, 14, 99, 'Laura', 'XXXXX', 'https://xdd.wisc.edu/api/products?api_key=undefined&products=TESTSET NAME', 'ready', 'active', '2021-07-02 22:20:38.495937');
INSERT INTO adept.test_sets VALUES (11, 14, 99, 'Laura', '7d2a6c14-8467-44e1-97cd-6f86b5613cb3', 'https://xdd.wisc.edu/api/products?api_key=7d2a6c14-8467-44e1-97cd-6f86b5613cb3&products=Laura', 'ready', 'active', '2021-07-02 22:44:59.492181');
INSERT INTO adept.test_sets VALUES (12, 10, 57, 'user-Set-2', '38d57370-0d52-4064-aae5-7ab91b4f4b44', 'https://xdd.wisc.edu/api/products?api_key=38d57370-0d52-4064-aae5-7ab91b4f4b44&products=user-Set-2', 'ready', 'active', '2021-07-02 22:47:53.942775');
INSERT INTO adept.test_sets VALUES (13, 10, 61, 'Saved-user-search', 'f1195264-466c-464a-a8ae-400ee28961ae', 'https://xdd.wisc.edu/api/products?api_key=f1195264-466c-464a-a8ae-400ee28961ae&products=Saved-user-search', 'ready', 'active', '2021-07-02 22:48:19.992515');
INSERT INTO adept.test_sets VALUES (14, 14, 109, 'new', '277dfc39-f9be-44a6-87b0-ca30f3029d32', 'https://xdd.wisc.edu/api/products?api_key=277dfc39-f9be-44a6-87b0-ca30f3029d32&products=new', 'ready', 'active', '2021-07-02 22:49:44.564895');
INSERT INTO adept.test_sets VALUES (15, 14, 99, 'Laura', 'f0a151b4-5458-4629-9ce2-65bad277e324', 'https://xdd.wisc.edu/api/products?api_key=f0a151b4-5458-4629-9ce2-65bad277e324&products=Laura', 'ready', 'active', '2021-07-06 15:25:15.228721');
INSERT INTO adept.test_sets VALUES (16, 14, 117, 'NEWGOLD', '903687f4-9a50-4fac-ab12-2495ace974c5', 'https://xdd.wisc.edu/api/products?api_key=903687f4-9a50-4fac-ab12-2495ace974c5&products=NEWGOLD', 'ready', 'active', '2021-07-06 21:40:13.825799');
INSERT INTO adept.test_sets VALUES (17, 10, 54, 'test-unit', '43ad89f9-143a-4725-9b2a-d1d866c81554', 'https://xdd.wisc.edu/api/products?api_key=43ad89f9-143a-4725-9b2a-d1d866c81554&products=test-unit', 'ready', 'active', '2021-07-15 17:41:59.250776');
INSERT INTO adept.test_sets VALUES (18, 14, 244, 'newhello', '98db8a71-1331-4fca-a205-cbdd9694f82c', 'https://xdd.wisc.edu/api/products?api_key=98db8a71-1331-4fca-a205-cbdd9694f82c&products=newhello', 'ready', 'active', '2021-07-15 17:42:13.836813');
INSERT INTO adept.test_sets VALUES (19, 14, 117, 'NEWGOLD', '1ea259b6-3005-4948-93c8-14bb16184c1f', 'https://xdd.wisc.edu/api/products?api_key=1ea259b6-3005-4948-93c8-14bb16184c1f&products=NEWGOLD', 'ready', 'active', '2021-07-15 17:48:05.76468');
INSERT INTO adept.test_sets VALUES (20, 10, 54, 'test-unit-1', 'ec13ea0d-1610-43e1-9d81-af0de550d70f', 'https://xdd.wisc.edu/api/products?api_key=ec13ea0d-1610-43e1-9d81-af0de550d70f&products=test-unit', 'ready', 'active', '2021-07-15 18:04:40.927123');
INSERT INTO adept.test_sets VALUES (21, 10, 54, 'test-unit-2', '1fc732df-93b3-42b9-82b2-521ff40b1996', 'https://xdd.wisc.edu/api/products?api_key=1fc732df-93b3-42b9-82b2-521ff40b1996&products=test-unit', 'ready', 'active', '2021-07-15 18:05:13.828925');
INSERT INTO adept.test_sets VALUES (22, 14, 244, 'newhello-1', '44a53b51-1c2e-402c-8bb9-64cb18784084', 'https://xdd.wisc.edu/api/products?api_key=44a53b51-1c2e-402c-8bb9-64cb18784084&products=newhello', 'ready', 'active', '2021-07-15 18:06:53.005697');
INSERT INTO adept.test_sets VALUES (23, 14, 244, 'newhello-2', '0da59df5-d3d4-400d-8cd4-bec67a68f7d8', 'https://xdd.wisc.edu/api/products?api_key=0da59df5-d3d4-400d-8cd4-bec67a68f7d8&products=newhello', 'ready', 'active', '2021-07-20 15:51:01.035582');
INSERT INTO adept.test_sets VALUES (24, 14, 244, 'newhello-3', '0aa47ef1-bc53-4f47-af34-3b76ee1ae0e8', 'https://xdd.wisc.edu/api/products?api_key=0aa47ef1-bc53-4f47-af34-3b76ee1ae0e8&products=newhello', 'ready', 'active', '2021-07-20 15:51:47.516998');
INSERT INTO adept.test_sets VALUES (25, 14, 244, 'newhello-4', '5029aca2-df55-4370-b99b-370bb5bd84c2', 'https://xdd.wisc.edu/api/products?api_key=5029aca2-df55-4370-b99b-370bb5bd84c2&products=newhello', 'ready', 'active', '2021-07-21 13:53:35.968009');
INSERT INTO adept.test_sets VALUES (26, 8, 50, 'Paleontology', '698b1b90-9d45-4f69-93eb-a306a72dc393', 'https://xdd.wisc.edu/api/products?api_key=698b1b90-9d45-4f69-93eb-a306a72dc393&products=Paleontology', 'ready', 'active', '2021-07-21 21:03:46.56651');
INSERT INTO adept.test_sets VALUES (27, 14, 251, 'New2021', '3d17628d-9281-49f1-be54-99ab707520f2', 'https://xdd.wisc.edu/api/products?api_key=3d17628d-9281-49f1-be54-99ab707520f2&products=New2021', 'ready', 'active', '2021-08-10 22:03:05.533562');
INSERT INTO adept.test_sets VALUES (28, 14, 251, 'New2021-1', 'a99b9773-ce79-4647-8ce3-9cb06c7c838d', 'https://xdd.wisc.edu/api/products?api_key=a99b9773-ce79-4647-8ce3-9cb06c7c838d&products=New2021', 'ready', 'active', '2021-08-11 15:09:03.467657');
INSERT INTO adept.test_sets VALUES (29, 14, 251, 'New2021-2', 'cbe5cfd5-5c24-4f14-af7e-c508a9fe07b0', 'https://xdd.wisc.edu/api/products?api_key=cbe5cfd5-5c24-4f14-af7e-c508a9fe07b0&products=New2021', 'ready', 'active', '2021-08-16 20:38:12.556917');
INSERT INTO adept.test_sets VALUES (30, 14, 23, 'Lauranew', '5edfe4a7-8cff-44af-838c-e62063f548b3', 'https://xdd.wisc.edu/api/products?api_key=5edfe4a7-8cff-44af-838c-e62063f548b3&products=Lauranew', 'dictionary', 'active', '2021-08-16 20:53:05.49523');
INSERT INTO adept.test_sets VALUES (31, 14, 23, 'Lauranew-1', '47d9e1af-c778-47b1-8d0b-2aee8a9d9e67', 'https://xdd.wisc.edu/api/products?api_key=47d9e1af-c778-47b1-8d0b-2aee8a9d9e67&products=Lauranew', 'dictionary', 'active', '2021-08-16 20:53:53.554395');
INSERT INTO adept.test_sets VALUES (32, 10, 16, 'Plants ', '159dd771-d14b-4963-84b4-e8cc17ec840c', 'https://xdd.wisc.edu/api/products?api_key=159dd771-d14b-4963-84b4-e8cc17ec840c&products=Plants ', 'dictionary', 'active', '2021-08-16 20:54:29.722535');
INSERT INTO adept.test_sets VALUES (33, 10, 13, 'Savory', '6fc8a34f-9ab4-4891-a96e-eb70af6b06cd', 'https://xdd.wisc.edu/api/products?api_key=6fc8a34f-9ab4-4891-a96e-eb70af6b06cd&products=Savory', 'dictionary', 'active', '2021-08-16 20:54:51.437536');
INSERT INTO adept.test_sets VALUES (34, 10, 25, 'betterway', '070d7045-2df7-4937-bbb1-7c9b0acf3e37', 'https://xdd.wisc.edu/api/products?api_key=070d7045-2df7-4937-bbb1-7c9b0acf3e37&products=betterway', 'dictionary', 'active', '2021-08-16 22:43:46.414586');
INSERT INTO adept.test_sets VALUES (35, 10, 26, 'scienparse-test', '50ee1dbc-8b9e-4865-817a-05b6ef3be65a', 'https://xdd.wisc.edu/api/products?api_key=50ee1dbc-8b9e-4865-817a-05b6ef3be65a&products=scienparse-test', 'dictionary', 'active', '2021-08-16 22:47:32.775848');
INSERT INTO adept.test_sets VALUES (36, 10, 27, 'new-science-parse', 'd639c23b-bb83-494d-80d5-0a8a98aae6c1', 'https://xdd.wisc.edu/api/products?api_key=d639c23b-bb83-494d-80d5-0a8a98aae6c1&products=scienceparse', 'dictionary', 'active', '2021-08-16 22:49:31.304169');
INSERT INTO adept.test_sets VALUES (37, 14, 28, 'test123', 'c9c30969-7099-4e4f-8512-2cd84d5fad37', 'https://xdd.wisc.edu/api/products?api_key=c9c30969-7099-4e4f-8512-2cd84d5fad37&products=scienceparse', 'dictionary', 'active', '2021-08-16 22:49:39.179389');
INSERT INTO adept.test_sets VALUES (38, 10, 29, 'dict-reg-test', '912406b7-0ad3-45c5-b77f-992a0713238e', 'https://xdd.wisc.edu/api/products?api_key=912406b7-0ad3-45c5-b77f-992a0713238e&products=scienceparse', 'dictionary', 'active', '2021-08-16 22:51:40.967576');
INSERT INTO adept.test_sets VALUES (39, 14, 30, 'lauraagain', 'f987a239-6850-4036-a3e2-f9fe70212cca', 'https://xdd.wisc.edu/api/products?api_key=f987a239-6850-4036-a3e2-f9fe70212cca&products=scienceparse', 'dictionary', 'active', '2021-08-16 22:52:25.827988');
INSERT INTO adept.test_sets VALUES (40, 10, 271, 'new-aug-search', '4ab49e2d-7bf4-43a3-94f7-f4086d7f8057', 'https://xdd.wisc.edu/api/products?api_key=4ab49e2d-7bf4-43a3-94f7-f4086d7f8057&products=scienceparse', 'ready', 'active', '2021-08-16 22:54:19.765996');
INSERT INTO adept.test_sets VALUES (41, 10, 27, 'new-science-parse-1', '3aab8b75-f5d0-44a1-aabb-5849bf5827a6', 'https://xdd.wisc.edu/api/products?api_key=3aab8b75-f5d0-44a1-aabb-5849bf5827a6&products=scienceparse', 'dictionary', 'active', '2021-08-16 22:59:33.680806');
INSERT INTO adept.test_sets VALUES (42, 10, 31, 'Donkey Kong', 'd1d9e77f-5eda-4ce4-bece-7b50e38cde42', 'https://xdd.wisc.edu/api/products?api_key=d1d9e77f-5eda-4ce4-bece-7b50e38cde42&products=scienceparse', 'dictionary', 'active', '2021-08-20 20:43:04.315087');


--
-- Data for Name: user_app_instance; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.user_app_instance VALUES (8, 10, 26, 'enote', '2021-07-29 23:45:29.042445', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (9, 14, 42, 'test', '2021-07-30 00:09:40.827015', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (10, 14, 29, 'test', '2021-07-30 00:13:36.244046', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (11, 14, 29, 'test', '2021-07-30 00:17:26.663536', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (12, 14, 29, 'test', '2021-07-30 00:21:17.847443', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (13, 14, 29, 'test', '2021-07-30 00:26:32.787323', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (14, 14, 29, 'test', '2021-07-30 00:29:26.968627', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (16, 14, 29, 'test', '2021-07-30 00:44:25.019297', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (17, 14, 29, 'test', '2021-07-30 00:47:43.8494', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (18, 14, 29, 'test', '2021-07-30 00:50:40.938353', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (19, 10, 26, 'enote', '2021-07-30 00:51:28.167901', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (20, 10, 26, 'enote', '2021-07-30 00:52:40.355436', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (21, 10, 26, 'exec-553', '2021-07-30 00:53:52.175932', NULL, 'new', '2', '2', NULL);
INSERT INTO adept.user_app_instance VALUES (22, 14, 45, '13', '2021-07-30 18:38:25.665331', NULL, 'new', '12', '12', NULL);
INSERT INTO adept.user_app_instance VALUES (23, 14, 47, '11', '2021-07-30 19:59:29.770662', NULL, 'new', '12', '5', NULL);
INSERT INTO adept.user_app_instance VALUES (25, 10, 1, 'notes-1', '2021-08-02 20:35:21.195602', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (30, 14, 49, 'test123', '2021-08-03 17:06:15.39782', NULL, 'new', '1', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (31, 10, 51, 'please run this', '2021-08-03 21:01:06.342364', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (32, 10, 51, 'another run', '2021-08-03 21:33:29.604094', NULL, 'new', '99', '1', NULL);
INSERT INTO adept.user_app_instance VALUES (33, 10, 51, 'execute btn history', '2021-08-03 21:50:05.354014', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (34, 10, 51, 'execute btn history', '2021-08-03 21:50:25.272847', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (35, 10, 51, 'execute btn history', '2021-08-03 21:51:12.283241', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (36, 10, 51, 'button test', '2021-08-03 21:56:19.731052', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (37, 10, 51, 'btntest', '2021-08-03 22:11:52.903682', NULL, 'new', '2', '2', NULL);
INSERT INTO adept.user_app_instance VALUES (38, 10, 51, 'btn-test-2', '2021-08-03 22:14:15.289508', NULL, 'new', '2', '2', NULL);
INSERT INTO adept.user_app_instance VALUES (39, 10, 51, 'btntest-5', '2021-08-03 22:29:59.08697', NULL, 'new', '4', '3', NULL);
INSERT INTO adept.user_app_instance VALUES (45, 14, 53, 'testingagain', '2021-08-16 22:15:58.815191', NULL, 'new', '11', '11', NULL);
INSERT INTO adept.user_app_instance VALUES (46, 10, 3, 'borehole-33', '2021-08-16 22:18:34.341595', NULL, 'new', '33', '44', NULL);
INSERT INTO adept.user_app_instance VALUES (47, 10, 3, 'btntest-77', '2021-08-16 22:55:15.1455', NULL, 'new', '4', '4', NULL);
INSERT INTO adept.user_app_instance VALUES (48, 10, 26, 'try this with dict', '2021-08-20 20:43:43.488843', NULL, 'new', '55', '55', NULL);
INSERT INTO adept.user_app_instance VALUES (49, 10, 26, 'try this with dict', '2021-08-20 20:43:54.866175', NULL, 'new', '55', '55', NULL);


--
-- Data for Name: user_app_resources; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.user_app_resources VALUES (5, 10, 26, 'test set', 1, 'new', '2021-04-21 19:15:44.281508', NULL);
INSERT INTO adept.user_app_resources VALUES (6, 10, 26, 'dict', 38, 'new', '2021-04-21 19:15:44.281508', NULL);
INSERT INTO adept.user_app_resources VALUES (7, 10, 31, 'test set', 21, 'new', '2021-07-22 21:51:36.79649', NULL);
INSERT INTO adept.user_app_resources VALUES (8, 10, 31, 'dict', 11, 'new', '2021-07-22 21:51:36.79649', NULL);
INSERT INTO adept.user_app_resources VALUES (15, 10, 35, 'test set', 21, 'new', '2021-07-22 22:07:36.419303', NULL);
INSERT INTO adept.user_app_resources VALUES (16, 10, 35, 'dict', 11, 'new', '2021-07-22 22:07:36.419303', NULL);
INSERT INTO adept.user_app_resources VALUES (19, 14, 37, 'test set', 18, 'new', '2021-07-22 22:27:47.735624', NULL);
INSERT INTO adept.user_app_resources VALUES (20, 14, 37, 'dict', 11, 'new', '2021-07-22 22:27:47.735624', NULL);
INSERT INTO adept.user_app_resources VALUES (29, 10, 26, 'test set', 33, 'new', '2021-07-29 23:45:29.042445', 8);
INSERT INTO adept.user_app_resources VALUES (30, 10, 26, 'test set', NULL, 'new', '2021-07-29 23:45:29.042445', 8);
INSERT INTO adept.user_app_resources VALUES (31, 10, 26, 'dict', NULL, 'new', '2021-07-29 23:45:29.042445', 8);
INSERT INTO adept.user_app_resources VALUES (32, 10, 26, 'dict', NULL, 'new', '2021-07-29 23:45:29.042445', 8);
INSERT INTO adept.user_app_resources VALUES (33, 14, 42, 'test set', NULL, 'new', '2021-07-30 00:09:40.827015', 9);
INSERT INTO adept.user_app_resources VALUES (34, 14, 42, 'test set', NULL, 'new', '2021-07-30 00:09:40.827015', 9);
INSERT INTO adept.user_app_resources VALUES (35, 14, 42, 'dict', NULL, 'new', '2021-07-30 00:09:40.827015', 9);
INSERT INTO adept.user_app_resources VALUES (36, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:13:36.244046', 10);
INSERT INTO adept.user_app_resources VALUES (37, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:13:36.244046', 10);
INSERT INTO adept.user_app_resources VALUES (38, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:13:36.244046', 10);
INSERT INTO adept.user_app_resources VALUES (39, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:17:26.663536', 11);
INSERT INTO adept.user_app_resources VALUES (40, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:17:26.663536', 11);
INSERT INTO adept.user_app_resources VALUES (41, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:17:26.663536', 11);
INSERT INTO adept.user_app_resources VALUES (42, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:21:17.847443', 12);
INSERT INTO adept.user_app_resources VALUES (43, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:21:17.847443', 12);
INSERT INTO adept.user_app_resources VALUES (44, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:21:17.847443', 12);
INSERT INTO adept.user_app_resources VALUES (45, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:21:17.847443', 12);
INSERT INTO adept.user_app_resources VALUES (46, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:26:32.787323', 13);
INSERT INTO adept.user_app_resources VALUES (47, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:26:32.787323', 13);
INSERT INTO adept.user_app_resources VALUES (48, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:26:32.787323', 13);
INSERT INTO adept.user_app_resources VALUES (49, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:26:32.787323', 13);
INSERT INTO adept.user_app_resources VALUES (50, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:29:26.968627', 14);
INSERT INTO adept.user_app_resources VALUES (51, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:29:26.968627', 14);
INSERT INTO adept.user_app_resources VALUES (52, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:29:26.968627', 14);
INSERT INTO adept.user_app_resources VALUES (53, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:29:26.968627', 14);
INSERT INTO adept.user_app_resources VALUES (54, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:44:25.019297', 16);
INSERT INTO adept.user_app_resources VALUES (55, 14, 29, 'test set', NULL, 'new', '2021-07-30 00:44:25.019297', 16);
INSERT INTO adept.user_app_resources VALUES (56, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:44:25.019297', 16);
INSERT INTO adept.user_app_resources VALUES (57, 14, 29, 'dict', NULL, 'new', '2021-07-30 00:44:25.019297', 16);
INSERT INTO adept.user_app_resources VALUES (58, 14, 29, 'test set', 8, 'new', '2021-07-30 00:47:43.8494', 17);
INSERT INTO adept.user_app_resources VALUES (59, 14, 29, 'test set', 22, 'new', '2021-07-30 00:47:43.8494', 17);
INSERT INTO adept.user_app_resources VALUES (60, 14, 29, 'dict', 38, 'new', '2021-07-30 00:47:43.8494', 17);
INSERT INTO adept.user_app_resources VALUES (61, 14, 29, 'dict', 39, 'new', '2021-07-30 00:47:43.8494', 17);
INSERT INTO adept.user_app_resources VALUES (62, 14, 29, 'test set', 8, 'new', '2021-07-30 00:50:40.938353', 18);
INSERT INTO adept.user_app_resources VALUES (63, 14, 29, 'test set', 22, 'new', '2021-07-30 00:50:40.938353', 18);
INSERT INTO adept.user_app_resources VALUES (64, 14, 29, 'dict', 38, 'new', '2021-07-30 00:50:40.938353', 18);
INSERT INTO adept.user_app_resources VALUES (65, 14, 29, 'dict', 39, 'new', '2021-07-30 00:50:40.938353', 18);
INSERT INTO adept.user_app_resources VALUES (66, 10, 26, 'test set', 2, 'new', '2021-07-30 00:51:28.167901', 19);
INSERT INTO adept.user_app_resources VALUES (67, 10, 26, 'test set', 33, 'new', '2021-07-30 00:51:28.167901', 19);
INSERT INTO adept.user_app_resources VALUES (68, 10, 26, 'dict', 38, 'new', '2021-07-30 00:51:28.167901', 19);
INSERT INTO adept.user_app_resources VALUES (69, 10, 26, 'dict', 39, 'new', '2021-07-30 00:51:28.167901', 19);
INSERT INTO adept.user_app_resources VALUES (70, 10, 26, 'test set', 2, 'new', '2021-07-30 00:52:40.355436', 20);
INSERT INTO adept.user_app_resources VALUES (71, 10, 26, 'test set', 33, 'new', '2021-07-30 00:52:40.355436', 20);
INSERT INTO adept.user_app_resources VALUES (72, 10, 26, 'dict', 38, 'new', '2021-07-30 00:52:40.355436', 20);
INSERT INTO adept.user_app_resources VALUES (73, 10, 26, 'dict', 39, 'new', '2021-07-30 00:52:40.355436', 20);
INSERT INTO adept.user_app_resources VALUES (74, 10, 26, 'test set', 20, 'new', '2021-07-30 00:53:52.175932', 21);
INSERT INTO adept.user_app_resources VALUES (75, 10, 26, 'test set', 21, 'new', '2021-07-30 00:53:52.175932', 21);
INSERT INTO adept.user_app_resources VALUES (76, 10, 26, 'dict', 10, 'new', '2021-07-30 00:53:52.175932', 21);
INSERT INTO adept.user_app_resources VALUES (77, 10, 26, 'dict', 47, 'new', '2021-07-30 00:53:52.175932', 21);
INSERT INTO adept.user_app_resources VALUES (78, 14, 45, 'test set', 18, 'new', '2021-07-30 18:38:25.665331', 22);
INSERT INTO adept.user_app_resources VALUES (79, 14, 45, 'test set', 22, 'new', '2021-07-30 18:38:25.665331', 22);
INSERT INTO adept.user_app_resources VALUES (80, 14, 45, 'dict', 18, 'new', '2021-07-30 18:38:25.665331', 22);
INSERT INTO adept.user_app_resources VALUES (81, 14, 47, 'test set', 23, 'new', '2021-07-30 19:59:29.770662', 23);
INSERT INTO adept.user_app_resources VALUES (82, 14, 47, 'test set', 14, 'new', '2021-07-30 19:59:29.770662', 23);
INSERT INTO adept.user_app_resources VALUES (83, 14, 47, 'dict', 17, 'new', '2021-07-30 19:59:29.770662', 23);
INSERT INTO adept.user_app_resources VALUES (84, 14, 47, 'dict', 18, 'new', '2021-07-30 19:59:29.770662', 23);
INSERT INTO adept.user_app_resources VALUES (85, 10, 1, 'test set', 1, 'new', '2021-08-02 20:35:21.195602', 25);
INSERT INTO adept.user_app_resources VALUES (86, 10, 1, 'dict', 9, 'new', '2021-08-02 20:35:21.195602', 25);
INSERT INTO adept.user_app_resources VALUES (87, 14, 49, 'test set', 15, 'new', '2021-08-03 17:06:15.39782', 30);
INSERT INTO adept.user_app_resources VALUES (88, 14, 49, 'dict', 10, 'new', '2021-08-03 17:06:15.39782', 30);
INSERT INTO adept.user_app_resources VALUES (89, 10, 51, 'test set', 12, 'new', '2021-08-03 21:01:06.342364', 31);
INSERT INTO adept.user_app_resources VALUES (90, 10, 51, 'dict', 2, 'new', '2021-08-03 21:01:06.342364', 31);
INSERT INTO adept.user_app_resources VALUES (91, 10, 51, 'test set', 13, 'new', '2021-08-03 21:33:29.604094', 32);
INSERT INTO adept.user_app_resources VALUES (92, 10, 51, 'dict', 47, 'new', '2021-08-03 21:33:29.604094', 32);
INSERT INTO adept.user_app_resources VALUES (93, 10, 51, 'test set', 21, 'new', '2021-08-03 21:50:05.354014', 33);
INSERT INTO adept.user_app_resources VALUES (94, 10, 51, 'dict', 11, 'new', '2021-08-03 21:50:05.354014', 33);
INSERT INTO adept.user_app_resources VALUES (95, 10, 51, 'test set', 21, 'new', '2021-08-03 21:50:25.272847', 34);
INSERT INTO adept.user_app_resources VALUES (96, 10, 51, 'dict', 11, 'new', '2021-08-03 21:50:25.272847', 34);
INSERT INTO adept.user_app_resources VALUES (97, 10, 51, 'test set', 21, 'new', '2021-08-03 21:51:12.283241', 35);
INSERT INTO adept.user_app_resources VALUES (98, 10, 51, 'dict', 11, 'new', '2021-08-03 21:51:12.283241', 35);
INSERT INTO adept.user_app_resources VALUES (99, 10, 51, 'test set', 21, 'new', '2021-08-03 21:56:19.731052', 36);
INSERT INTO adept.user_app_resources VALUES (100, 10, 51, 'dict', 9, 'new', '2021-08-03 21:56:19.731052', 36);
INSERT INTO adept.user_app_resources VALUES (101, 10, 51, 'test set', 21, 'new', '2021-08-03 22:11:52.903682', 37);
INSERT INTO adept.user_app_resources VALUES (102, 10, 51, 'dict', 11, 'new', '2021-08-03 22:11:52.903682', 37);
INSERT INTO adept.user_app_resources VALUES (103, 10, 51, 'test set', 21, 'new', '2021-08-03 22:14:15.289508', 38);
INSERT INTO adept.user_app_resources VALUES (104, 10, 51, 'dict', 11, 'new', '2021-08-03 22:14:15.289508', 38);
INSERT INTO adept.user_app_resources VALUES (105, 10, 51, 'test set', 3, 'new', '2021-08-03 22:29:59.08697', 39);
INSERT INTO adept.user_app_resources VALUES (106, 10, 51, 'dict', 2, 'new', '2021-08-03 22:29:59.08697', 39);
INSERT INTO adept.user_app_resources VALUES (110, 14, 53, 'test set', 30, 'new', '2021-08-16 22:15:58.815191', 45);
INSERT INTO adept.user_app_resources VALUES (111, 10, 3, 'test set', 33, 'new', '2021-08-16 22:18:34.341595', 46);
INSERT INTO adept.user_app_resources VALUES (112, 10, 3, 'test set', 32, 'new', '2021-08-16 22:18:34.341595', 46);
INSERT INTO adept.user_app_resources VALUES (113, 10, 3, 'test set', 40, 'new', '2021-08-16 22:55:15.1455', 47);
INSERT INTO adept.user_app_resources VALUES (114, 10, 26, 'test set', 42, 'new', '2021-08-20 20:43:43.488843', 48);
INSERT INTO adept.user_app_resources VALUES (115, 10, 26, 'test set', 42, 'new', '2021-08-20 20:43:54.866175', 49);


--
-- Data for Name: user_applications; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.user_applications VALUES (1, 10, 'Well Log Gradient Descent', '23422a7122', 'python 2.7', 'https://de.cyverse.org/example/app/id', 'new', 'active', '2020-11-18 20:27:05.453515', NULL, NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (2, 10, 'Well Log Gradient Descent', '23422a7122', 'python 2.7', 'https://de.cyverse.org/example/app/id', 'new', 'active', '2020-11-18 20:27:22.405508', NULL, NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (3, 10, 'Borehole Regression', '237892a7122', 'python 2.7', 'https://de.cyverse.org/example/app/id', 'new', 'active', '2020-11-18 20:29:36.401919', NULL, NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (26, 10, 'Todays App', '0', 'docker', 'docker-id 99 version 444', 'new', 'new', '2021-04-21 19:15:44.274805', '2-8', NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (29, 14, '44', '0', 'docker', '', 'new', 'new', '2021-06-22 17:18:32.408577', '-', NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (31, 10, 'TESTTHIS', '0', 'docker', 'dockerdocer', 'new', 'new', '2021-07-22 21:51:36.790937', '10-10', NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (35, 10, 'mtest33', '0', 'docker', '777777', 'new', 'new', '2021-07-22 22:07:36.412899', '9-9', NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (37, 14, 'Laureatest', '0', 'docker', '342343', 'new', 'pending', '2021-07-22 22:27:47.731585', '10-10-12', NULL, NULL, NULL);
INSERT INTO adept.user_applications VALUES (39, 14, 'testtt', '0', 'testing ', '18290', '17288', 'pending', '2021-07-27 22:38:46.345347', '10-12', 'www.github.com', '2', NULL);
INSERT INTO adept.user_applications VALUES (42, 14, 'lalalal', '0', 'hello', 'ad', '1234', 'pending', '2021-07-27 22:51:50.548031', '12-12', '1', '1', NULL);
INSERT INTO adept.user_applications VALUES (43, 10, 'aname-44', '0', 'ades-44', 'did-44', 'cs-44', 'pending', '2021-07-27 22:52:25.006286', '4-4', 'https://github.com', '44', NULL);
INSERT INTO adept.user_applications VALUES (44, 10, 'aname-44', '0', 'ades-44', 'did-44', 'cs-44', 'pending', '2021-07-27 22:52:51.360329', '4-4', 'https://github.com', '44', NULL);
INSERT INTO adept.user_applications VALUES (45, 14, 'tget', '0', 'hthth', 'tht', 'tht', 'pending', '2021-07-27 23:25:36.96865', 'thth-th', 'hth', 'ht', NULL);
INSERT INTO adept.user_applications VALUES (46, 14, '148', '0', 'vjhg', 'dfgsdfg', 'sdfgfdgf', 'pending', '2021-07-27 23:26:03.304961', '12-13', '1245', '1245', NULL);
INSERT INTO adept.user_applications VALUES (47, 14, 'testf', '0', 'sdf', '123', '1233', 'pending', '2021-07-28 18:04:16.657592', '12-12', '1', '1', NULL);
INSERT INTO adept.user_applications VALUES (49, 14, 'fgdfg', '0', 'fgfdgf', 'gfdgd', 'fgdfg', 'pending', '2021-07-28 20:03:52.810859', 'fdgfd-gdfg', 'dffd', 'fg', NULL);
INSERT INTO adept.user_applications VALUES (50, 14, '1545', '0', '123', '65646884', '651161', 'pending', '2021-07-28 20:48:38.287031', '12-10', '3546541', '5', NULL);
INSERT INTO adept.user_applications VALUES (51, 10, 'july29', '0', 'app-729', 'docker-729', '729-cs', 'pending', '2021-07-29 18:42:05.000713', '2-2', 'github', '4', NULL);
INSERT INTO adept.user_applications VALUES (53, 14, 'hellothere', '0', 'hello hello hello ', '1234', '12', 'pending', '2021-08-06 21:40:35.19225', '1-1', '', '', 19);
INSERT INTO adept.user_applications VALUES (54, 10, 'changes-aug-6', '0', 'big long description', 'docker2222', '77777', 'pending', '2021-08-06 21:40:40.514263', '2424-2', 'github', 'runtime-444', 3);


--
-- Data for Name: user_dictionaries; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.user_dictionaries VALUES (1, 1, 1, 'new', '/source', 'true', 'active', 'test name');
INSERT INTO adept.user_dictionaries VALUES (2, 0, 1, 'new', 'local', 'true', 'active', 'myGeothermal');
INSERT INTO adept.user_dictionaries VALUES (3, 0, 8, 'new', 'local', 'true', 'active', 'myGeothermal');
INSERT INTO adept.user_dictionaries VALUES (4, 0, 8, 'new', 'local', 'true', 'active', 'hydro2');
INSERT INTO adept.user_dictionaries VALUES (5, 0, 10, 'new', 'local', 'true', 'active', 'Testone');
INSERT INTO adept.user_dictionaries VALUES (6, 0, 13, 'new', 'local', 'true', 'active', 'test3user local dict');
INSERT INTO adept.user_dictionaries VALUES (7, 0, 8, 'new', 'local', 'true', 'active', 'test');
INSERT INTO adept.user_dictionaries VALUES (8, 0, 10, 'new', 'local', 'true', 'active', 'NewDictFormat');
INSERT INTO adept.user_dictionaries VALUES (12, 0, 10, 'new', 'local', 'true', 'active', 'sql-test');
INSERT INTO adept.user_dictionaries VALUES (13, 0, 10, 'new', 'local', 'true', 'active', 'Savory');
INSERT INTO adept.user_dictionaries VALUES (14, 0, 10, 'new', 'local', 'true', 'active', 'Particles');
INSERT INTO adept.user_dictionaries VALUES (15, 0, 10, 'new', 'local', 'true', 'active', 'Taxonomy');
INSERT INTO adept.user_dictionaries VALUES (16, 0, 10, 'new', 'local', 'true', 'active', 'Plants ');
INSERT INTO adept.user_dictionaries VALUES (17, 0, 10, 'new', 'local', 'true', 'active', 'August-12-dict');
INSERT INTO adept.user_dictionaries VALUES (18, 0, 10, 'new', 'local', 'true', 'active', 'test');
INSERT INTO adept.user_dictionaries VALUES (19, 0, 10, 'new', 'local', 'true', 'active', 'help');
INSERT INTO adept.user_dictionaries VALUES (20, 0, 10, 'new', 'local', 'true', 'active', 'testtest');
INSERT INTO adept.user_dictionaries VALUES (21, 0, 10, 'new', 'local', 'true', 'active', 'hello');
INSERT INTO adept.user_dictionaries VALUES (22, 0, 10, 'new', 'local', 'true', 'active', 'Lauratest');
INSERT INTO adept.user_dictionaries VALUES (23, 0, 14, 'new', 'local', 'true', 'active', 'Lauranew');
INSERT INTO adept.user_dictionaries VALUES (24, 0, 10, 'new', 'local', 'true', 'active', 'Aug-26-XXX');
INSERT INTO adept.user_dictionaries VALUES (25, 0, 10, 'new', 'local', 'true', 'active', 'betterway');
INSERT INTO adept.user_dictionaries VALUES (26, 0, 10, 'new', 'local', 'true', 'active', 'scienparse-test');
INSERT INTO adept.user_dictionaries VALUES (27, 0, 10, 'new', 'local', 'true', 'active', 'new-science-parse');
INSERT INTO adept.user_dictionaries VALUES (28, 0, 14, 'new', 'local', 'true', 'active', 'test123');
INSERT INTO adept.user_dictionaries VALUES (29, 0, 10, 'new', 'local', 'true', 'active', 'dict-reg-test');
INSERT INTO adept.user_dictionaries VALUES (30, 0, 14, 'new', 'local', 'true', 'active', 'lauraagain');
INSERT INTO adept.user_dictionaries VALUES (31, 0, 10, 'new', 'local', 'true', 'active', 'Donkey Kong');


--
-- Data for Name: users; Type: TABLE DATA; Schema: adept; Owner: ngdsdb
--

INSERT INTO adept.users VALUES (10, 'G', 'H', 'ghudman@email.arizona.edu', 'UA', 'no', '5d097fe1065645c8', 1, 'adept', '2021-04-07 19:59:38.412029', 'a6ea21d923197973f2ffa513e79a160fab9cd8bc00072657b9f3841d9776aa3e7fa19d0dc9f5ea615994955c88b4a46df72e98d132017e852ef835d04966a9a2', '', 'active');
INSERT INTO adept.users VALUES (15, 'Reviewer', 'Reviewer', 'reviewer@review.org', 'reviewer@review.org', 'Review', '5d097fe1065645c8', 2, 'adept', '2021-04-29 18:28:31.184695', '34d918331317f35a49bd49db899303b97f4f6a045d68efff776cdeb54da4f1befc11977433e3e5fb67e41a599196cdee75bd57096d291e16f35b18df0b09a7f1', 'reviewer', 'active');
INSERT INTO adept.users VALUES (11, 'Test', 'User', 'onetest@test.com', 'Knowledge', 'On Purpose', '5d097fe1065645c8', 2, 'adept', '2021-04-13 18:33:17.746494', '785d47d6501ea2eec1b687e76eee4cafdd64e56a1150814656d208495cf0c9873e52323b9b4727df2fac3141984b38f4a0ad9b87180ff0f51107e14563f17bea', '', 'active');
INSERT INTO adept.users VALUES (12, 'test2', 'user', 'twotest@test.com', 'A', 'B', '5d097fe1065645c8', 2, 'adept', '2021-04-13 18:36:35.430814', '785d47d6501ea2eec1b687e76eee4cafdd64e56a1150814656d208495cf0c9873e52323b9b4727df2fac3141984b38f4a0ad9b87180ff0f51107e14563f17bea', '', 'inactive');
INSERT INTO adept.users VALUES (9, 'Demo', 'Geologo', 'gary.hudman.azgs@gmail.com', '', '', '5d097fe1065645c8', 2, 'adept', '2020-11-17 20:32:38.87271', '785d47d6501ea2eec1b687e76eee4cafdd64e56a1150814656d208495cf0c9873e52323b9b4727df2fac3141984b38f4a0ad9b87180ff0f51107e14563f17bea', '', 'active');
INSERT INTO adept.users VALUES (1, 'Gary', 'Hudman', 'garyhudman@email.arizona.edu', 'U of A', 'fun', '5d097fe1065645c8', 1, 'adept', '2020-11-05 21:29:47.668184', '857dffec49b726d46b835978977a57e09253d9fd4d2c7c6af3873606b2dff9b14ca63dc7317a584dc641ac2662a6bf50b8725350e352c02607589b52575c91e8', '', 'active');
INSERT INTO adept.users VALUES (14, 'Laura', 'Bookman', 'lbookman@arizona.edu', '', '', '5d097fe1065645c8', 1, 'adept', '2021-04-13 20:03:10.840382', '9ce0f71f0f882a26d48fcebbd9df85913623149d555b59870394e3ccb9d31d5bbc13b3a2e3290f91db7518cea15f205f5bfb0d42b556c15a3b8ed56d0588d739', '', 'active');
INSERT INTO adept.users VALUES (13, 'test3', 'user', '3test@test.com', '', '', '5d097fe1065645c8', 2, 'adept', '2021-04-13 18:39:28.92668', '785d47d6501ea2eec1b687e76eee4cafdd64e56a1150814656d208495cf0c9873e52323b9b4727df2fac3141984b38f4a0ad9b87180ff0f51107e14563f17bea', '', 'active');
INSERT INTO adept.users VALUES (8, 'Andrew', 'Zaffos', 'azaffos@email.arizona.edu', 'Arizona Geological Survey', 'Administration', '5d097fe1065645c8', 1, 'adept', '2020-11-17 20:24:19.647607', '785d47d6501ea2eec1b687e76eee4cafdd64e56a1150814656d208495cf0c9873e52323b9b4727df2fac3141984b38f4a0ad9b87180ff0f51107e14563f17bea', '', 'active');


--
-- Name: adept_user_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.adept_user_id', 15, true);


--
-- Name: col_seq_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.col_seq_id', 295, true);


--
-- Name: dict_seq_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.dict_seq_id', 31, true);


--
-- Name: dict_term_seq_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.dict_term_seq_id', 82, true);


--
-- Name: group_member_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.group_member_id', 32, true);


--
-- Name: group_object_seq; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.group_object_seq', 19, true);


--
-- Name: proc_active_seq; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.proc_active_seq', 7, true);


--
-- Name: test_set_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.test_set_id', 42, true);


--
-- Name: user_app_proc_seq; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.user_app_proc_seq', 49, true);


--
-- Name: user_app_res_seq; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.user_app_res_seq', 115, true);


--
-- Name: user_application_seq; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.user_application_seq', 54, true);


--
-- Name: user_group_id; Type: SEQUENCE SET; Schema: adept; Owner: ngdsdb
--

SELECT pg_catalog.setval('adept.user_group_id', 9, true);


--
-- PostgreSQL database dump complete
--

