--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.3

-- Started on 2020-11-30 14:57:22

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
-- TOC entry 4426 (class 1262 OID 16385)
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
-- TOC entry 13 (class 2615 OID 181364)
-- Name: adept; Type: SCHEMA; Schema: -; Owner: ngdsdb
--

CREATE SCHEMA adept;


ALTER SCHEMA adept OWNER TO ngdsdb;

--
-- TOC entry 1857 (class 1247 OID 181499)
-- Name: colset; Type: TYPE; Schema: adept; Owner: ngdsdb
--

CREATE TYPE adept.colset AS (
	col_id bigint,
	col_name text,
	user_id bigint,
	proc_state text,
	search_set json,
	record_set json
);


ALTER TYPE adept.colset OWNER TO ngdsdb;

--
-- TOC entry 1176 (class 1255 OID 181501)
-- Name: collectionset(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.collectionset(bigint) RETURNS SETOF adept.colset
    LANGUAGE sql
    AS $_$

	with col as (
		select col_id, col_name, user_id, proc_state
		from adept.collections 
		where user_id = $1 and state = 'active'
	),cs as (
		select col_id, cs_id, col_desc, search_url, rec_count 
		from adept.collection_search 
		where state = 'active' and col_id in
			( select col_id from col)
	), csj as (
		select c.col_id as scid, 
        json_agg(json_build_object('cs_id', c.cs_id, 
				'col_desc', c.col_desc, 
				'search_url', c.search_url,
				'rec_count', c.rec_count)) as cj
		from cs c 
		group by c.col_id
	), cr as (
		select col_id, cr_id, ident 
		from adept.collection_records 
		where state = 'active'  and col_id in 
			( select col_id from col) 
	), crj as (
		select r.col_id as rcid, 
		json_object_agg(r.cr_id, r.ident) as rj
		from cr r
		group by r.col_id
	)
	select col_id, col_name, 
		user_id, proc_state, cj, rj
	from col 
		left join csj on col.col_id = csj.scid
		left join crj on col.col_id = crj.rcid
	
$_$;


ALTER FUNCTION adept.collectionset(bigint) OWNER TO ngdsdb;

--
-- TOC entry 1175 (class 1255 OID 181502)
-- Name: deletecollection(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.deletecollection(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    collection_id ALIAS FOR $1;
	status text;
BEGIN
	status := 'start';
	delete from adept.collection_records where col_id = collection_id;
	status := 'records complete';
	delete from adept.collection_search where col_id = collection_id;
    status := 'searches complete';
	delete from adept.collections where col_id = collection_id;
	status := 'complete';
	return status;
END;
$_$;


ALTER FUNCTION adept.deletecollection(bigint) OWNER TO ngdsdb;

--
-- TOC entry 307 (class 1259 OID 181365)
-- Name: adept_user_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.adept_user_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.adept_user_id OWNER TO ngdsdb;

--
-- TOC entry 311 (class 1259 OID 181414)
-- Name: col_seq_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.col_seq_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.col_seq_id OWNER TO ngdsdb;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 314 (class 1259 OID 181434)
-- Name: collection_records; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.collection_records (
    cr_id bigint DEFAULT nextval('adept.col_seq_id'::regclass) NOT NULL,
    col_id bigint NOT NULL,
    ident text,
    itype text,
    state text
);


ALTER TABLE adept.collection_records OWNER TO ngdsdb;

--
-- TOC entry 313 (class 1259 OID 181425)
-- Name: collection_search; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.collection_search (
    cs_id bigint DEFAULT nextval('adept.col_seq_id'::regclass) NOT NULL,
    col_id bigint NOT NULL,
    col_desc text,
    search_url text,
    state text,
    rec_count bigint
);


ALTER TABLE adept.collection_search OWNER TO ngdsdb;

--
-- TOC entry 312 (class 1259 OID 181416)
-- Name: collections; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.collections (
    col_id bigint DEFAULT nextval('adept.col_seq_id'::regclass) NOT NULL,
    col_name text,
    col_type text,
    user_id bigint NOT NULL,
    proc_state text,
    share_state text,
    state text,
    created timestamp without time zone,
    modified timestamp without time zone
);


ALTER TABLE adept.collections OWNER TO ngdsdb;

--
-- TOC entry 310 (class 1259 OID 181403)
-- Name: dict_seq_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.dict_seq_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.dict_seq_id OWNER TO ngdsdb;

--
-- TOC entry 315 (class 1259 OID 181443)
-- Name: dictionaries; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.dictionaries (
    dict_id bigint NOT NULL,
    dict_name text,
    base_class text,
    case_sensitive text,
    last_updated timestamp without time zone,
    dict_source text,
    filter_flag text,
    state text
);


ALTER TABLE adept.dictionaries OWNER TO ngdsdb;

--
-- TOC entry 317 (class 1259 OID 181467)
-- Name: dictionary_terms; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.dictionary_terms (
    dt_id bigint DEFAULT nextval('adept.dict_seq_id'::regclass) NOT NULL,
    did bigint NOT NULL,
    term text,
    hits bigint NOT NULL,
    edit_state text,
    state text
);


ALTER TABLE adept.dictionary_terms OWNER TO ngdsdb;

--
-- TOC entry 321 (class 1259 OID 181503)
-- Name: proc_active_seq; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.proc_active_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.proc_active_seq OWNER TO ngdsdb;

--
-- TOC entry 322 (class 1259 OID 181508)
-- Name: process_activity; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.process_activity (
    pa_id bigint DEFAULT nextval('adept.proc_active_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    proc_name text,
    proc_type text,
    set_id bigint,
    dict_id bigint,
    ts_id bigint,
    source text,
    created timestamp without time zone,
    modified timestamp without time zone,
    state text
);


ALTER TABLE adept.process_activity OWNER TO ngdsdb;

--
-- TOC entry 309 (class 1259 OID 181393)
-- Name: roles; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.roles (
    role_id bigint NOT NULL,
    role_name text,
    role_description text,
    role_code text,
    state text
);


ALTER TABLE adept.roles OWNER TO ngdsdb;

--
-- TOC entry 318 (class 1259 OID 181476)
-- Name: test_set_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.test_set_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.test_set_id OWNER TO ngdsdb;

--
-- TOC entry 319 (class 1259 OID 181478)
-- Name: test_sets; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.test_sets (
    ts_id bigint DEFAULT nextval('adept.test_set_id'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    col_id bigint,
    ts_name text,
    apikey text,
    ts_url text,
    proc_state text,
    state text
);


ALTER TABLE adept.test_sets OWNER TO ngdsdb;

--
-- TOC entry 323 (class 1259 OID 181517)
-- Name: user_application_seq; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.user_application_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.user_application_seq OWNER TO ngdsdb;

--
-- TOC entry 324 (class 1259 OID 181537)
-- Name: user_applications; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_applications (
    ua_id bigint DEFAULT nextval('adept.user_application_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_name text,
    app_key text,
    app_type text,
    source_url text,
    proc_state text,
    state text,
    created timestamp without time zone
);


ALTER TABLE adept.user_applications OWNER TO ngdsdb;

--
-- TOC entry 316 (class 1259 OID 181458)
-- Name: user_dictionaries; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_dictionaries (
    did bigint DEFAULT nextval('adept.dict_seq_id'::regclass) NOT NULL,
    dict_id bigint,
    user_id bigint NOT NULL,
    proc_state text,
    source text,
    filter_flag text,
    state text,
    name text
);


ALTER TABLE adept.user_dictionaries OWNER TO ngdsdb;

--
-- TOC entry 308 (class 1259 OID 181381)
-- Name: users; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.users (
    user_id bigint DEFAULT nextval('adept.adept_user_id'::regclass) NOT NULL,
    first_name text,
    last_name text,
    email text,
    org_name text,
    purpose text,
    apikey text,
    role_id bigint,
    auth_app text,
    created timestamp without time zone,
    password text,
    user_name text,
    state text
);


ALTER TABLE adept.users OWNER TO ngdsdb;

--
-- TOC entry 4249 (class 2606 OID 181424)
-- Name: collections col_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collections
    ADD CONSTRAINT col_pkey PRIMARY KEY (col_id);


--
-- TOC entry 4253 (class 2606 OID 181442)
-- Name: collection_records cr_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_records
    ADD CONSTRAINT cr_pkey PRIMARY KEY (cr_id);


--
-- TOC entry 4251 (class 2606 OID 181433)
-- Name: collection_search cs_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_search
    ADD CONSTRAINT cs_pkey PRIMARY KEY (cs_id);


--
-- TOC entry 4255 (class 2606 OID 181450)
-- Name: dictionaries did_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionaries
    ADD CONSTRAINT did_pkey PRIMARY KEY (dict_id);


--
-- TOC entry 4259 (class 2606 OID 181475)
-- Name: dictionary_terms dt_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionary_terms
    ADD CONSTRAINT dt_pkey PRIMARY KEY (dt_id);


--
-- TOC entry 4263 (class 2606 OID 181516)
-- Name: process_activity pa_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.process_activity
    ADD CONSTRAINT pa_pkey PRIMARY KEY (pa_id);


--
-- TOC entry 4245 (class 2606 OID 181402)
-- Name: roles role_name_key; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_name_key UNIQUE (role_name);


--
-- TOC entry 4247 (class 2606 OID 181400)
-- Name: roles role_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4261 (class 2606 OID 181486)
-- Name: test_sets ts_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.test_sets
    ADD CONSTRAINT ts_pkey PRIMARY KEY (ts_id);


--
-- TOC entry 4265 (class 2606 OID 181545)
-- Name: user_applications ua_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_applications
    ADD CONSTRAINT ua_pkey PRIMARY KEY (ua_id);


--
-- TOC entry 4257 (class 2606 OID 181466)
-- Name: user_dictionaries udid_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_dictionaries
    ADD CONSTRAINT udid_pkey PRIMARY KEY (did);


--
-- TOC entry 4243 (class 2606 OID 181389)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


-- Completed on 2020-11-30 14:57:22

--
-- PostgreSQL database dump complete
--

