--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.3

-- Started on 2021-07-14 14:16:21

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
-- TOC entry 1895 (class 1247 OID 181499)
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
-- TOC entry 1945 (class 1247 OID 214201)
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
-- TOC entry 1956 (class 1247 OID 215517)
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
-- TOC entry 1212 (class 1255 OID 214203)
-- Name: add_group_member(bigint, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.add_group_member(bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
	grp_id ALIAS for $1;
	mem_name ALIAS for $2;
	uid bigint;
	status text;
BEGIN

	status := 'start';
	uid := 0;
	select user_id into uid from adept.users where email = mem_name;
	
	if uid > 0 then
	
		--select user_id from adept.group_members where group_id = grp_id;
		insert into adept.group_members (user_id, created, state, group_id)
			values (uid, current_timestamp, 'new', grp_id);
		status := 'Success-'||uid::text||'-'||mem_name;
	else 
		status := 'Error-'||mem_name;
	end if;
	
    return status;

END;
$_$;


ALTER FUNCTION adept.add_group_member(bigint, text) OWNER TO ngdsdb;

--
-- TOC entry 1205 (class 1255 OID 181501)
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
-- TOC entry 1196 (class 1255 OID 214207)
-- Name: create_group(bigint, text, text, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.create_group(bigint, text, text, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    user_id ALIAS FOR $1;
	grp_name ALIAS FOR $2;
	grp_notes ALIAS FOR $3;
	grp_members ALIAS FOR $4;
	grp_id bigint;
	gma text[];
	gx text;
	status text;
	mstate text;
    rc int;
BEGIN

	status := 'Start';
    insert into adept.groups (group_name, owner_id, created, state, notes ) 
	values
	(grp_name, user_id, current_timestamp,'new',grp_notes )
	returning group_id into grp_id;
	status := 'GID-'||grp_id||'-members-';
	
	gma := string_to_array(grp_members,',');
	mstate := '';
	rc := 0;
	
	FOREACH gx IN ARRAY gma    
	LOOP 
	
		select add_group_member into mstate 
		from adept.add_group_member(grp_id, gx);   
		status := status||mstate;
		if rc > 0 then
			status := status||',';
		end if;
		rc := rc+1;
		
	END LOOP;	
	return status;
END;
$_$;


ALTER FUNCTION adept.create_group(bigint, text, text, text) OWNER TO ngdsdb;

--
-- TOC entry 1203 (class 1255 OID 181502)
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
-- TOC entry 1214 (class 1255 OID 214137)
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
-- TOC entry 1215 (class 1255 OID 214233)
-- Name: group_membership(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.group_membership(bigint) RETURNS SETOF adept.groupset
    LANGUAGE sql
    AS $_$
with gw as (
	select group_id,
	group_name, 
	owner_id,
	u.email as owner_name,
	'owner' as gtype, 
	g.created, g.state, g.notes
	from adept.groups g, adept.users u 
	where g.owner_id = u.user_id and g.owner_id = $1
), u as (
	select u.user_id, u.email from adept.users u
), members as (
	select group_id, json_agg(z) as mj from (
		select u.user_id, u.email, m.group_id
		from adept.users u, adept.group_members m
		where u.user_id = m.user_id) z 
	group by group_id
), gm as (
	select g.group_id, g.group_name, 
		g.owner_id, 
	    (select email from u where user_id = g.owner_id) as owner_name,
	    'member' as gtype, 
		g.created, g.state, g.notes
	from adept.groups g, adept.group_members m, adept.users u
	where g.group_id = m.group_id and 
		m.user_id = u.user_id and 
		m.user_id = $1
), g2 as (
   	select g.group_id, g.group_name, 
		g.owner_id, g.owner_name,
		g.gtype, g.created, g.state, g.notes,
		(select mj from members where group_id = g.group_id) as memx
	from gw g
), gm2 as (
	select g.group_id, g.group_name, 
		g.owner_id, g.owner_name,
		g.gtype, g.created, g.state, g.notes,
		(select mj from members where group_id = g.group_id) as memx
	from gm g
), unx as (
	select group_id, group_name, 
		owner_id, owner_name,
		gtype, created, state, notes
	from g2
	union
	select group_id, group_name, 
		owner_id, owner_name,
		gtype, created, state, notes
	from gm2
)
select g.group_id, group_name, 
		owner_id, owner_name,
		gtype, created, state, notes,
		m.mj as members
from unx g left join members m on g.group_id = m.group_id
$_$;


ALTER FUNCTION adept.group_membership(bigint) OWNER TO ngdsdb;

--
-- TOC entry 1217 (class 1255 OID 215578)
-- Name: insert_testset(bigint, bigint, text); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.insert_testset(bigint, bigint, text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
    user_id ALIAS FOR $1;
	cx_id ALIAS FOR $2;
	apikey ALIAS FOR $3;
	ts_url text;
	ts_namex text;
	status text;


BEGIN

	status := 'Start';
	select col_name INTO ts_namex from adept.collections where col_id = cx_id;
	ts_url := 'https://xdd.wisc.edu/api/products?api_key='||apikey||'&products='||ts_namex;
	
	insert into adept.test_sets 
		(ts_id, user_id, col_id, ts_name, apikey, ts_url, proc_state, state, created) 
	values ( nextval('adept.test_set_id'),
		user_id,cx_id,ts_namex,apikey,ts_url,'ready','active',current_timestamp);
	
	status := 'DONE';
	return status;
END;
$_$;


ALTER FUNCTION adept.insert_testset(bigint, bigint, text) OWNER TO ngdsdb;

--
-- TOC entry 1213 (class 1255 OID 215518)
-- Name: not_group_member(bigint); Type: FUNCTION; Schema: adept; Owner: ngdsdb
--

CREATE FUNCTION adept.not_group_member(bigint) RETURNS SETOF adept.not_group
    LANGUAGE sql
    AS $_$
	select g.group_id, 
			g.group_name, 
			g.owner_id, 
			u.email 
	from adept.groups g, adept.users u 
	where g.owner_id = u.user_id and g.group_id not in
		(select group_id from adept.group_members where user_id = $1 ) 
		and g.owner_id <> $1
$_$;


ALTER FUNCTION adept.not_group_member(bigint) OWNER TO ngdsdb;

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
-- TOC entry 337 (class 1259 OID 214179)
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
-- TOC entry 338 (class 1259 OID 214181)
-- Name: user_app_instance; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_app_instance (
    ax_id bigint DEFAULT nextval('adept.user_app_proc_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_id bigint NOT NULL,
    proc_notes text,
    created timestamp without time zone,
    run_date timestamp without time zone,
    state text
);


ALTER TABLE adept.user_app_instance OWNER TO ngdsdb;

--
-- TOC entry 334 (class 1259 OID 214138)
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
-- TOC entry 335 (class 1259 OID 214158)
-- Name: user_app_resources; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.user_app_resources (
    ur_id bigint DEFAULT nextval('adept.user_app_res_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    app_id bigint NOT NULL,
    res_type text,
    res_id bigint,
    state text,
    created timestamp without time zone
);


ALTER TABLE adept.user_app_resources OWNER TO ngdsdb;

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
    app_type text,
    source_url text,
    proc_state text,
    state text,
    created timestamp without time zone,
    resources text
);


ALTER TABLE adept.user_applications OWNER TO ngdsdb;

--
-- TOC entry 339 (class 1259 OID 214190)
-- Name: app_resource; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.app_resource AS
 WITH mj AS (
         SELECT a.ua_id,
            a.user_id,
            a.app_name,
            a.app_key,
            a.app_type,
            a.source_url,
            a.proc_state,
            a.state,
            a.created,
            a.resources
           FROM adept.user_applications a
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
    mj.app_type,
    mj.source_url,
    mj.proc_state,
    mj.state,
    mj.created,
    mj.resources,
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
-- TOC entry 341 (class 1259 OID 214208)
-- Name: group_object_seq; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.group_object_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.group_object_seq OWNER TO ngdsdb;

--
-- TOC entry 342 (class 1259 OID 214224)
-- Name: group_objects; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.group_objects (
    go_id bigint DEFAULT nextval('adept.group_object_seq'::regclass) NOT NULL,
    group_id bigint NOT NULL,
    object_type text NOT NULL,
    object_id bigint NOT NULL,
    created timestamp without time zone,
    state text
);


ALTER TABLE adept.group_objects OWNER TO ngdsdb;

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
-- TOC entry 332 (class 1259 OID 214119)
-- Name: groups; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.groups (
    group_id bigint DEFAULT nextval('adept.user_group_id'::regclass) NOT NULL,
    group_name text,
    owner_id bigint,
    created timestamp without time zone,
    state text,
    notes text
);


ALTER TABLE adept.groups OWNER TO ngdsdb;

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
-- TOC entry 347 (class 1259 OID 215540)
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
        ), gc AS (
         SELECT c_1.col_id,
            json_agg(json_build_object('group_id', g.group_id, 'group_name', g.group_name)) AS jgrp
           FROM adept.group_objects o,
            adept.groups g,
            adept.collections c_1
          WHERE ((o.group_id = g.group_id) AND (o.object_type = 'dataset'::text) AND (o.object_id = c_1.col_id))
          GROUP BY c_1.col_id
        )
 SELECT c.col_id,
    c.col_name,
    c.user_id,
    u.email,
    c.state,
    c.created,
    s.scnt,
    s.srecs,
    s.mdcnt,
    gc.jgrp
   FROM (((adept.collections c
     LEFT JOIN sr s ON ((c.col_id = s.col_id)))
     LEFT JOIN gc ON ((c.col_id = gc.col_id)))
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
-- TOC entry 345 (class 1259 OID 215525)
-- Name: group_collections; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.group_collections AS
 WITH go AS (
         SELECT g_1.group_id,
            g_1.group_name,
            g_1.created,
            g_1.state,
            o.go_id,
            o.object_id,
            o.object_type
           FROM adept.groups g_1,
            adept.group_objects o
          WHERE ((g_1.group_id = o.group_id) AND (o.object_type = 'dataset'::text))
        ), sc AS (
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
    c.state,
    c.created,
    g.go_id,
    g.group_id,
    g.group_name,
    s.scnt,
    s.srecs,
    s.mdcnt
   FROM ((adept.collections c
     LEFT JOIN go g ON ((c.col_id = g.object_id)))
     LEFT JOIN sr s ON ((c.col_id = s.col_id)));


ALTER TABLE adept.group_collections OWNER TO ngdsdb;

--
-- TOC entry 346 (class 1259 OID 215530)
-- Name: group_collections2; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.group_collections2 AS
 WITH go AS (
         SELECT g_1.group_id,
            g_1.group_name,
            g_1.created,
            g_1.state,
            o.go_id,
            o.object_id,
            o.object_type
           FROM adept.groups g_1,
            adept.group_objects o
          WHERE ((g_1.group_id = o.group_id) AND (o.object_type = 'dataset'::text))
          ORDER BY g_1.group_id
        ), sc AS (
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
    c.state,
    c.created,
    g.group_id,
    json_agg(json_build_object('go_id', g.go_id, 'group_name', g.group_name)) AS jgrp,
    s.scnt,
    s.srecs,
    s.mdcnt
   FROM ((adept.collections c
     LEFT JOIN go g ON ((c.col_id = g.object_id)))
     LEFT JOIN sr s ON ((c.col_id = s.col_id)))
  GROUP BY c.col_id, c.col_name, c.user_id, c.state, c.created, g.group_id, s.scnt, s.srecs, s.mdcnt
  ORDER BY c.col_id;


ALTER TABLE adept.group_collections2 OWNER TO ngdsdb;

--
-- TOC entry 331 (class 1259 OID 214117)
-- Name: group_member_id; Type: SEQUENCE; Schema: adept; Owner: ngdsdb
--

CREATE SEQUENCE adept.group_member_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE adept.group_member_id OWNER TO ngdsdb;

--
-- TOC entry 333 (class 1259 OID 214128)
-- Name: group_members; Type: TABLE; Schema: adept; Owner: ngdsdb
--

CREATE TABLE adept.group_members (
    gm_id bigint DEFAULT nextval('adept.group_member_id'::regclass) NOT NULL,
    user_id bigint,
    created timestamp without time zone,
    state text,
    group_id bigint
);


ALTER TABLE adept.group_members OWNER TO ngdsdb;

--
-- TOC entry 348 (class 1259 OID 215545)
-- Name: group_member_collection_datasets; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.group_member_collection_datasets AS
 WITH gm AS (
         SELECT g.group_id,
            g.created,
            g.group_name,
            g.owner_id,
            u.email AS owner_name,
            m.user_id,
            m.created AS member_start,
            m.state AS member_state
           FROM adept.group_members m,
            adept.groups g,
            adept.users u
          WHERE ((m.group_id = g.group_id) AND (g.owner_id = u.user_id))
        ), gox AS (
         SELECT o.group_id,
            o.object_id,
            c.col_name,
            c.created AS col_created
           FROM adept.group_objects o,
            adept.collections c
          WHERE ((o.object_type = 'dataset'::text) AND (o.object_id = c.col_id))
        )
 SELECT gm.group_id,
    gm.created,
    gm.group_name,
    gm.owner_id,
    gm.owner_name,
    gm.user_id,
    gm.member_start,
    gm.member_state,
    gox.object_id,
    gox.col_name,
    gox.col_created
   FROM gm,
    gox
  WHERE (gm.group_id = gox.group_id);


ALTER TABLE adept.group_member_collection_datasets OWNER TO ngdsdb;

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
-- TOC entry 351 (class 1259 OID 215571)
-- Name: group_view_objects; Type: VIEW; Schema: adept; Owner: ngdsdb
--

CREATE VIEW adept.group_view_objects AS
 WITH go AS (
         SELECT g.group_id,
            g.group_name,
            o.go_id,
            o.object_type,
            o.object_id,
            o.created,
            o.state
           FROM adept.groups g,
            adept.group_objects o
          WHERE (g.group_id = o.group_id)
        ), gc AS (
         SELECT go.group_id,
            go.group_name,
            go.go_id,
            go.object_type,
            go.object_id,
            go.created,
            go.state,
            c.col_id AS id,
            c.col_name AS name
           FROM go,
            adept.collections c
          WHERE ((go.object_id = c.col_id) AND (go.object_type = 'dataset'::text))
        ), gd AS (
         SELECT go.group_id,
            go.group_name,
            go.go_id,
            go.object_type,
            go.object_id,
            go.created,
            go.state,
            d.dict_id AS id,
            d.name
           FROM go,
            adept.user_dictionaries d
          WHERE ((go.object_id = d.dict_id) AND (go.object_type = 'dictionary'::text))
        ), ga AS (
         SELECT go.group_id,
            go.group_name,
            go.go_id,
            go.object_type,
            go.object_id,
            go.created,
            go.state,
            a.ua_id AS id,
            a.app_name AS name
           FROM go,
            adept.user_applications a
          WHERE ((go.object_id = a.ua_id) AND (go.object_type = 'application'::text))
        )
 SELECT gc.group_id,
    gc.group_name,
    gc.go_id,
    gc.object_type,
    gc.object_id,
    gc.created,
    gc.state,
    gc.id,
    gc.name
   FROM gc
UNION
 SELECT gd.group_id,
    gd.group_name,
    gd.go_id,
    gd.object_type,
    gd.object_id,
    gd.created,
    gd.state,
    gd.id,
    gd.name
   FROM gd
UNION
 SELECT ga.group_id,
    ga.group_name,
    ga.go_id,
    ga.object_type,
    ga.object_id,
    ga.created,
    ga.state,
    ga.id,
    ga.name
   FROM ga;


ALTER TABLE adept.group_view_objects OWNER TO ngdsdb;

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
-- TOC entry 4386 (class 2606 OID 214189)
-- Name: user_app_instance ax_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_app_instance
    ADD CONSTRAINT ax_pkey PRIMARY KEY (ax_id);


--
-- TOC entry 4362 (class 2606 OID 181424)
-- Name: collections col_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collections
    ADD CONSTRAINT col_pkey PRIMARY KEY (col_id);


--
-- TOC entry 4366 (class 2606 OID 181442)
-- Name: collection_records cr_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_records
    ADD CONSTRAINT cr_pkey PRIMARY KEY (cr_id);


--
-- TOC entry 4364 (class 2606 OID 181433)
-- Name: collection_search cs_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.collection_search
    ADD CONSTRAINT cs_pkey PRIMARY KEY (cs_id);


--
-- TOC entry 4368 (class 2606 OID 181450)
-- Name: dictionaries did_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionaries
    ADD CONSTRAINT did_pkey PRIMARY KEY (dict_id);


--
-- TOC entry 4372 (class 2606 OID 181475)
-- Name: dictionary_terms dt_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.dictionary_terms
    ADD CONSTRAINT dt_pkey PRIMARY KEY (dt_id);


--
-- TOC entry 4382 (class 2606 OID 214136)
-- Name: group_members gm_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.group_members
    ADD CONSTRAINT gm_pkey PRIMARY KEY (gm_id);


--
-- TOC entry 4388 (class 2606 OID 214232)
-- Name: group_objects go_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.group_objects
    ADD CONSTRAINT go_pkey PRIMARY KEY (go_id);


--
-- TOC entry 4380 (class 2606 OID 214127)
-- Name: groups group_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.groups
    ADD CONSTRAINT group_pkey PRIMARY KEY (group_id);


--
-- TOC entry 4376 (class 2606 OID 181516)
-- Name: process_activity pa_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.process_activity
    ADD CONSTRAINT pa_pkey PRIMARY KEY (pa_id);


--
-- TOC entry 4358 (class 2606 OID 181402)
-- Name: roles role_name_key; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_name_key UNIQUE (role_name);


--
-- TOC entry 4360 (class 2606 OID 181400)
-- Name: roles role_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.roles
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4374 (class 2606 OID 181486)
-- Name: test_sets ts_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.test_sets
    ADD CONSTRAINT ts_pkey PRIMARY KEY (ts_id);


--
-- TOC entry 4378 (class 2606 OID 181545)
-- Name: user_applications ua_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_applications
    ADD CONSTRAINT ua_pkey PRIMARY KEY (ua_id);


--
-- TOC entry 4370 (class 2606 OID 181466)
-- Name: user_dictionaries udid_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_dictionaries
    ADD CONSTRAINT udid_pkey PRIMARY KEY (did);


--
-- TOC entry 4384 (class 2606 OID 214166)
-- Name: user_app_resources ur_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.user_app_resources
    ADD CONSTRAINT ur_pkey PRIMARY KEY (ur_id);


--
-- TOC entry 4356 (class 2606 OID 181389)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: adept; Owner: ngdsdb
--

ALTER TABLE ONLY adept.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


-- Completed on 2021-07-14 14:16:21

--
-- PostgreSQL database dump complete
--

