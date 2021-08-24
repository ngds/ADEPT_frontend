--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.3

-- Started on 2021-08-24 15:18:35

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
-- TOC entry 1888 (class 1247 OID 181499)
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
-- TOC entry 1926 (class 1247 OID 214201)
-- Name: groupset; Type: TYPE; Schema: adept; Owner: ngdsdb
--

CREATE TYPE adept.groupset AS (
	group_id bigint,
	group_name text,
	owner_id bigint,
	owner_name text,
	gtype text,
	created timestamp without time zone,
	state text,
	notes text,
	members json
);


ALTER TYPE adept.groupset OWNER TO ngdsdb;

--
-- TOC entry 1932 (class 1247 OID 215517)
-- Name: not_group; Type: TYPE; Schema: adept; Owner: ngdsdb
--

CREATE TYPE adept.not_group AS (
	group_id bigint,
	group_name text,
	owner_id bigint,
	owner_name text
);


ALTER TYPE adept.not_group OWNER TO ngdsdb;

--
-- TOC entry 1199 (class 1255 OID 215637)
-- Name: addnewinstance(bigint, bigint, text, text, text, text[]); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.addnewinstance(bigint, bigint, text, text, text, text[]) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    user_id ALIAS FOR $1;
	app_id ALIAS FOR $2;
	notes ALIAS FOR $3;
	cores ALIAS FOR $4;
	mem ALIAS FOR $5;
	tset ALIAS FOR $6;
	--dict  ALIAS FOR $7;
	status text;
	instanceId bigint;
	k int;
	i int;
	
BEGIN
	status := 'start';
	insert into adept.user_app_instance 
		(ax_id, user_id, app_id, proc_notes, created, state, cores, memory ) values 
		( nextval('adept.user_app_proc_seq'), user_id, app_id, notes, 
	  		current_timestamp, 'new', cores, mem ) returning ax_id into instanceId;
	  
	status := 'app instance'; 
	FOREACH k in ARRAY tset LOOP
	 
		RAISE NOTICE 'test set id %',k;
		insert into adept.user_app_resources 
			( ur_id, user_id, app_id, res_type,res_id, state, created, instance_id )
			values 
			( nextval('adept.user_app_res_seq'), user_id, app_id, 'test set',
			 	k::bigint, 'new', current_timestamp, instanceId );
	END LOOP;
	status := status||'app Test Sets'; 
	--FOREACH i in ARRAY dict LOOP
	--    RAISE NOTICE 'Dict id %',i;
	--	insert into adept.user_app_resources 
	--		( ur_id, user_id, app_id, res_type,res_id, state, created, instance_id )
	--		values 
	--		( nextval('adept.user_app_res_seq'), user_id, app_id, 'dict',
	--		 	i::bigint, 'new', current_timestamp, instanceId ); 
	--END LOOP;
	status := 'Done-'||instanceId::text; 
	
	return status;
END;
$_$;


ALTER FUNCTION adept.addnewinstance(bigint, bigint, text, text, text, text[]) OWNER TO ngdsdb;

--
-- TOC entry 1203 (class 1255 OID 215591)
-- Name: addnewinstance(bigint, bigint, text, text, text, text[], text[]); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.addnewinstance(bigint, bigint, text, text, text, text[], text[]) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    user_id ALIAS FOR $1;
	app_id ALIAS FOR $2;
	notes ALIAS FOR $3;
	cores ALIAS FOR $4;
	mem ALIAS FOR $5;
	tset ALIAS FOR $6;
	dict  ALIAS FOR $7;
	status text;
	instanceId bigint;
	k int;
	i int;
	
BEGIN
	status := 'start';
	insert into adept.user_app_instance 
		(ax_id, user_id, app_id, proc_notes, created, state, cores, memory ) values 
		( nextval('adept.user_app_proc_seq'), user_id, app_id, notes, 
	  		current_timestamp, 'new', cores, mem ) returning ax_id into instanceId;
	  
	status := 'app instance'; 
	FOREACH k in ARRAY tset LOOP
	 
		RAISE NOTICE 'test set id %',k;
		insert into adept.user_app_resources 
			( ur_id, user_id, app_id, res_type,res_id, state, created, instance_id )
			values 
			( nextval('adept.user_app_res_seq'), user_id, app_id, 'test set',
			 	k::bigint, 'new', current_timestamp, instanceId );
	END LOOP;
	status := status||'app Test Sets'; 
	FOREACH i in ARRAY dict LOOP
	    RAISE NOTICE 'Dict id %',i;
		insert into adept.user_app_resources 
			( ur_id, user_id, app_id, res_type,res_id, state, created, instance_id )
			values 
			( nextval('adept.user_app_res_seq'), user_id, app_id, 'dict',
			 	i::bigint, 'new', current_timestamp, instanceId ); 
	END LOOP;
	status := 'Done-'||instanceId::text; 
	
	return status;
END;
$_$;


ALTER FUNCTION adept.addnewinstance(bigint, bigint, text, text, text, text[], text[]) OWNER TO ngdsdb;

--
-- TOC entry 1195 (class 1255 OID 181501)
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
				'search_url', c.search_url::json,
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
-- TOC entry 1210 (class 1255 OID 215644)
-- Name: delete_local_dict(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.delete_local_dict(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    dxid ALIAS FOR $1;
	tx bigint;
	status text;
BEGIN
	status := 'start';
	select ts_id into tx from adept.test_sets where col_id = dxid and proc_state = 'dictionary';
	
	if tx > 0 then
		status := 'IN USE AS TEST SET';
	else
		delete from adept.dictionary_terms where dt_id = dxid;
		status := 'terms deleted';
		delete from adept.user_dictionaries where did = dxid;
    	status := 'dictionary deleted';
	end if;
	return status;
END;
$_$;


ALTER FUNCTION adept.delete_local_dict(bigint) OWNER TO ngdsdb;

--
-- TOC entry 1208 (class 1255 OID 215584)
-- Name: deleteapplication(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.deleteapplication(bigint) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    apx_id ALIAS FOR $1;
	status text;
BEGIN
	status := 'start';
	delete from adept.user_app_instance where app_id = apx_id;
	status := 'instances deleted';
	delete from adept.user_app_resources where app_id = apx_id;
    status := 'resources deleted';
	delete from adept.user_applications where ua_id = apx_id;
	status := 'complete';
	return status;
END;
$_$;


ALTER FUNCTION adept.deleteapplication(bigint) OWNER TO ngdsdb;

--
-- TOC entry 1193 (class 1255 OID 181502)
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
-- TOC entry 1206 (class 1255 OID 214137)
-- Name: getcollection(bigint, bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.getcollection(bigint, bigint) RETURNS SETOF adept.colset
    LANGUAGE sql
    AS $_$
with col as (
		select col_id, col_name, user_id, proc_state
		from adept.collections 
		where --user_id = $1 and 
		col_id = $2 and state = 'active'
	),cs as (
		select col_id, cs_id, col_desc, search_url, rec_count 
		from adept.collection_search 
		where state = 'active' and col_id in
			( select col_id from col)
	), csj as (
		select c.col_id as scid, 
        json_agg(json_build_object('cs_id', c.cs_id, 
				'col_desc', c.col_desc, 
				'search_url',c.search_url::json,
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


ALTER FUNCTION adept.getcollection(bigint, bigint) OWNER TO ngdsdb;

--
-- TOC entry 1201 (class 1255 OID 215636)
-- Name: insert_dictionary_testset(bigint, bigint, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.insert_dictionary_testset(bigint, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    us_id ALIAS FOR $1;
	dx_id ALIAS FOR $2;
	apikey ALIAS FOR $3;
	ts_url text;
	dict_name text;
	status text;
	v_count bigint;

BEGIN

	status := 'Start';
	
	select count(*) into v_count from adept.test_sets where user_id = us_id and col_id = dx_id;
	
	select name INTO dict_name from adept.user_dictionaries where did = dx_id;
	
	ts_url := 'https://xdd.wisc.edu/api/products?api_key='||apikey||'&products=scienceparse';
	
	if v_count > 0 then
		dict_name := dict_name||'-'||v_count;
	end if;
	
	insert into adept.test_sets 
		(ts_id, user_id, col_id, ts_name, apikey, ts_url, proc_state, state, created) 
	values ( nextval('adept.test_set_id'),
		us_id,dx_id,dict_name,apikey,ts_url,'dictionary','active',current_timestamp);
	
	status := 'DONE';
	return status;
END;
$_$;


ALTER FUNCTION adept.insert_dictionary_testset(bigint, bigint, text) OWNER TO ngdsdb;

--
-- TOC entry 1209 (class 1255 OID 215578)
-- Name: insert_testset(bigint, bigint, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.insert_testset(bigint, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    us_id ALIAS FOR $1;
	cx_id ALIAS FOR $2;
	apikeyx ALIAS FOR $3;
	tx_url text;
	ts_namex text;
	status text;
	v_count bigint;

BEGIN

	status := 'Start';
	
	select count(*) into v_count from adept.test_sets where user_id = us_id and col_id = cx_id;
	
	select col_name INTO ts_namex from adept.collections where col_id = cx_id;
	tx_url := 'https://xdd.wisc.edu/api/products?api_key='||apikeyx||'&products=scienceparse';
	
	if v_count > 0 then
		--ts_namex := ts_namex||'-'||v_count;
		update adept.test_sets set ts_url = tx_url, apikey= apikeyx, created = current_timestamp
		where col_id = cx_id;
	else 
		insert into adept.test_sets 
			(ts_id, user_id, col_id, ts_name, apikey , ts_url, proc_state, state, created) 
		values ( nextval('adept.test_set_id'),
			us_id,cx_id,ts_namex,apikeyx,tx_url,'ready','active',current_timestamp);
	end if;

	status := 'DONE';
	return status;
END;
$_$;


ALTER FUNCTION adept.insert_testset(bigint, bigint, text) OWNER TO ngdsdb;

--
-- TOC entry 1200 (class 1255 OID 215635)
-- Name: new_local_dictionary(bigint, text, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.new_local_dictionary(bigint, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    user_id ALIAS FOR $1;
	dict_name ALIAS FOR $2;
	dict_terms ALIAS FOR $3;

	dict_id bigint;
	dta text[];
	dx text;
	status text;
	rc int := 0;
	
BEGIN

	status := 'Start';
    insert into adept.user_dictionaries 
		 (did, dict_id, user_id, proc_state, source, filter_flag, state, name)
	values
		(nextval('adept.dict_seq_id'), 0, user_id,'new','local','true','active',dict_name)
	returning did into dict_id;
	status := 'DICT_ID '||dict_id::text;
	
	dta := string_to_array(dict_terms,',');

	FOREACH dx IN ARRAY dta    
	LOOP 
        insert into adept.dictionary_terms 
			(dt_id, did, term, hits, edit_state, state)
		values
			(nextval('adept.dict_term_seq_id'),dict_id, dx,0,'new','active' );	
		rc := rc + 1;
	END LOOP;	
	return status||' Term Count '||rc::text;
END;
$_$;


ALTER FUNCTION adept.new_local_dictionary(bigint, text, text) OWNER TO ngdsdb;

--
-- TOC entry 306 (class 1259 OID 181365)
-- Name: adept_user_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.adept_user_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.adept_user_id OWNER TO ngdsdb;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 314 (class 1259 OID 181443)
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
-- TOC entry 317 (class 1259 OID 181476)
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
-- TOC entry 318 (class 1259 OID 181478)
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
    state text,
    created timestamp without time zone
);


ALTER TABLE adept.test_sets OWNER TO ngdsdb;

--
-- TOC entry 334 (class 1259 OID 214179)
-- Name: user_app_proc_seq; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.user_app_proc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.user_app_proc_seq OWNER TO ngdsdb;

--
-- TOC entry 335 (class 1259 OID 214181)
-- Name: user_app_instance; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_app_instance (
    ax_id bigint DEFAULT nextval('adept.user_app_proc_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_id bigint NOT NULL,
    proc_notes text,
    created timestamp without time zone,
    run_date timestamp without time zone,
    state text,
    cores text,
    memory text,
    output_link text
);


ALTER TABLE adept.user_app_instance OWNER TO ngdsdb;

--
-- TOC entry 331 (class 1259 OID 214138)
-- Name: user_app_res_seq; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.user_app_res_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.user_app_res_seq OWNER TO ngdsdb;

--
-- TOC entry 332 (class 1259 OID 214158)
-- Name: user_app_resources; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_app_resources (
    ur_id bigint DEFAULT nextval('adept.user_app_res_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_id bigint NOT NULL,
    res_type text,
    res_id bigint,
    state text,
    created timestamp without time zone,
    instance_id bigint
);


ALTER TABLE adept.user_app_resources OWNER TO ngdsdb;

--
-- TOC entry 340 (class 1259 OID 215627)
-- Name: app_instance_history; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.app_instance_history AS
 WITH tsx AS (
         SELECT t.ts_id,
            t.ts_name,
            r.ur_id
           FROM adept.test_sets t,
            adept.user_app_resources r
          WHERE ((r.res_type = 'test set'::text) AND (r.res_id = t.ts_id))
        ), dsx AS (
         SELECT d.dict_id,
            d.dict_name,
            r.ur_id
           FROM adept.dictionaries d,
            adept.user_app_resources r
          WHERE ((r.res_type = 'dict'::text) AND (r.res_id = d.dict_id))
        ), inr AS (
         SELECT i_1.ax_id,
            i_1.app_id,
            i_1.proc_notes,
            i_1.created,
            i_1.state,
            i_1.cores,
            i_1.memory,
            i_1.output_link,
            r.ur_id,
            r.res_type,
            r.res_id,
            r.instance_id
           FROM adept.user_app_instance i_1,
            adept.user_app_resources r
          WHERE (i_1.ax_id = r.instance_id)
        )
 SELECT i.ax_id,
    i.app_id,
    i.proc_notes,
    i.created,
    i.state,
    i.cores,
    i.memory,
    i.instance_id,
    i.output_link,
    string_agg(tsx.ts_name, ','::text) AS test_sets,
    string_agg(dsx.dict_name, ','::text) AS dicts
   FROM ((inr i
     LEFT JOIN tsx ON ((i.ur_id = tsx.ur_id)))
     LEFT JOIN dsx ON ((i.ur_id = dsx.ur_id)))
  GROUP BY i.ax_id, i.app_id, i.proc_notes, i.created, i.state, i.cores, i.memory, i.instance_id, i.output_link
  ORDER BY i.ax_id;


ALTER TABLE adept.app_instance_history OWNER TO ngdsdb;

--
-- TOC entry 322 (class 1259 OID 181517)
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
-- TOC entry 323 (class 1259 OID 181537)
-- Name: user_applications; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_applications (
    ua_id bigint DEFAULT nextval('adept.user_application_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_name text,
    app_key text,
    app_desc text,
    docker_image text,
    checksum text,
    state text,
    created timestamp without time zone,
    resources text,
    github_repo text,
    runtime text,
    testset_id bigint
);


ALTER TABLE adept.user_applications OWNER TO ngdsdb;

--
-- TOC entry 339 (class 1259 OID 215622)
-- Name: app_resource; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.app_resource AS
 WITH mj AS (
         SELECT a.ua_id,
            a.user_id,
            a.app_name,
            a.app_key,
            a.app_desc,
            a.docker_image,
            a.checksum,
            a.state,
            a.created,
            a.resources,
            a.testset_id AS default_ts_id,
            t.ts_name AS default_testset
           FROM (adept.user_applications a
             LEFT JOIN adept.test_sets t ON ((a.testset_id = t.ts_id)))
        ), ts AS (
         SELECT z.app_id,
            json_agg(z.*) AS test_set
           FROM ( SELECT a.app_id,
                    a.res_id,
                    a.created,
                    t.ts_name,
                    t.ts_url
                   FROM adept.user_app_resources a,
                    adept.test_sets t
                  WHERE ((a.res_id = t.ts_id) AND (a.res_type = 'test set'::text))) z
          GROUP BY z.app_id
        ), dict AS (
         SELECT d.app_id AS dapp_id,
            json_agg(d.*) AS dict
           FROM ( SELECT a.app_id,
                    a.res_id,
                    a.created,
                    d_1.dict_name,
                    d_1.dict_source,
                    d_1.last_updated
                   FROM adept.user_app_resources a,
                    adept.dictionaries d_1
                  WHERE ((a.res_id = d_1.dict_id) AND (a.res_type = 'dict'::text))) d
          GROUP BY d.app_id
        ), proc AS (
         SELECT p.app_id AS papp_id,
            json_agg(p.*) AS proc
           FROM ( SELECT user_app_instance.app_id,
                    user_app_instance.ax_id,
                    user_app_instance.proc_notes,
                    user_app_instance.created,
                    user_app_instance.run_date,
                    user_app_instance.state
                   FROM adept.user_app_instance
                  WHERE (user_app_instance.app_id IN ( SELECT mj_1.ua_id
                           FROM mj mj_1))) p
          GROUP BY p.app_id
        )
 SELECT mj.ua_id,
    mj.user_id,
    mj.app_name,
    mj.app_key,
    mj.app_desc,
    mj.docker_image,
    mj.checksum,
    mj.state,
    mj.created,
    mj.resources,
    mj.default_ts_id,
    mj.default_testset,
    ts.app_id,
    ts.test_set,
    dict.dapp_id,
    dict.dict,
    proc.papp_id,
    proc.proc
   FROM (((mj
     LEFT JOIN ts ON ((mj.ua_id = ts.app_id)))
     LEFT JOIN dict ON ((mj.ua_id = dict.dapp_id)))
     LEFT JOIN proc ON ((mj.ua_id = proc.papp_id)));


ALTER TABLE adept.app_resource OWNER TO ngdsdb;

--
-- TOC entry 310 (class 1259 OID 181414)
-- Name: col_seq_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.col_seq_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.col_seq_id OWNER TO ngdsdb;

--
-- TOC entry 313 (class 1259 OID 181434)
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
-- TOC entry 312 (class 1259 OID 181425)
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
-- TOC entry 311 (class 1259 OID 181416)
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
-- TOC entry 307 (class 1259 OID 181381)
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
-- TOC entry 342 (class 1259 OID 215638)
-- Name: collection_group; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.collection_group AS
 WITH sc AS (
         SELECT collection_search.col_id,
            count(collection_search.col_id) AS scnt,
            sum(collection_search.rec_count) AS rcnt
           FROM adept.collection_search
          WHERE (collection_search.state = 'active'::text)
          GROUP BY collection_search.col_id
        ), rc AS (
         SELECT collection_records.col_id,
            count(collection_records.col_id) AS rc
           FROM adept.collection_records
          WHERE (collection_records.state = 'active'::text)
          GROUP BY collection_records.col_id
        ), sr AS (
         SELECT s_1.col_id,
            s_1.scnt,
            s_1.rcnt AS srecs,
            r.rc AS mdcnt
           FROM (sc s_1
             LEFT JOIN rc r ON ((s_1.col_id = r.col_id)))
        )
 SELECT c.col_id,
    c.col_name,
    c.user_id,
    u.email,
    c.state,
    c.created,
    s.scnt,
    s.srecs,
    s.mdcnt
   FROM ((adept.collections c
     LEFT JOIN sr s ON ((c.col_id = s.col_id)))
     LEFT JOIN adept.users u ON ((c.user_id = u.user_id)));


ALTER TABLE adept.collection_group OWNER TO ngdsdb;

--
-- TOC entry 309 (class 1259 OID 181403)
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
-- TOC entry 341 (class 1259 OID 215632)
-- Name: dict_term_seq_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.dict_term_seq_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.dict_term_seq_id OWNER TO ngdsdb;

--
-- TOC entry 316 (class 1259 OID 181467)
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
-- TOC entry 320 (class 1259 OID 181503)
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
-- TOC entry 321 (class 1259 OID 181508)
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
-- TOC entry 308 (class 1259 OID 181393)
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
-- TOC entry 315 (class 1259 OID 181458)
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
-- TOC entry 330 (class 1259 OID 214115)
-- Name: user_group_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.user_group_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.user_group_id OWNER TO ngdsdb;

--
-- TOC entry 4346 (class 2606 OID 214189)
-- Name: user_app_instance ax_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_app_instance
    ADD CONSTRAINT ax_pkey PRIMARY KEY (ax_id);


--
-- TOC entry 4326 (class 2606 OID 181424)
-- Name: collections col_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collections
    ADD CONSTRAINT col_pkey PRIMARY KEY (col_id);


--
-- TOC entry 4330 (class 2606 OID 181442)
-- Name: collection_records cr_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_records
    ADD CONSTRAINT cr_pkey PRIMARY KEY (cr_id);


--
-- TOC entry 4328 (class 2606 OID 181433)
-- Name: collection_search cs_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_search
    ADD CONSTRAINT cs_pkey PRIMARY KEY (cs_id);


--
-- TOC entry 4332 (class 2606 OID 181450)
-- Name: dictionaries did_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionaries
    ADD CONSTRAINT did_pkey PRIMARY KEY (dict_id);


--
-- TOC entry 4336 (class 2606 OID 181475)
-- Name: dictionary_terms dt_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionary_terms
    ADD CONSTRAINT dt_pkey PRIMARY KEY (dt_id);


--
-- TOC entry 4340 (class 2606 OID 181516)
-- Name: process_activity pa_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.process_activity
    ADD CONSTRAINT pa_pkey PRIMARY KEY (pa_id);


--
-- TOC entry 4322 (class 2606 OID 181402)
-- Name: roles role_name_key; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_name_key UNIQUE (role_name);


--
-- TOC entry 4324 (class 2606 OID 181400)
-- Name: roles role_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4338 (class 2606 OID 181486)
-- Name: test_sets ts_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.test_sets
    ADD CONSTRAINT ts_pkey PRIMARY KEY (ts_id);


--
-- TOC entry 4342 (class 2606 OID 181545)
-- Name: user_applications ua_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_applications
    ADD CONSTRAINT ua_pkey PRIMARY KEY (ua_id);


--
-- TOC entry 4334 (class 2606 OID 181466)
-- Name: user_dictionaries udid_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_dictionaries
    ADD CONSTRAINT udid_pkey PRIMARY KEY (did);


--
-- TOC entry 4344 (class 2606 OID 214166)
-- Name: user_app_resources ur_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_app_resources
    ADD CONSTRAINT ur_pkey PRIMARY KEY (ur_id);


--
-- TOC entry 4320 (class 2606 OID 181389)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


-- Completed on 2021-08-24 15:18:36

--
-- PostgreSQL database dump complete
--

