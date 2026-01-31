--
-- PostgreSQL database dump
--

\restrict yCwopFnfqmk6VcqODhuOog18sp41qRmTJASETkX41gystlPRpfAW6K8SrKcjc43

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.amenities (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(100),
    category character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.amenities OWNER TO postgres;

--
-- Name: amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.amenities_id_seq OWNER TO postgres;

--
-- Name: amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.amenities_id_seq OWNED BY public.amenities.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: calendar_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_availability (
    id integer NOT NULL,
    property_id integer NOT NULL,
    date date NOT NULL,
    available boolean DEFAULT true,
    price_per_night numeric(10,2) NOT NULL,
    min_nights integer DEFAULT 1,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.calendar_availability OWNER TO postgres;

--
-- Name: calendar_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_availability_id_seq OWNER TO postgres;

--
-- Name: calendar_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_availability_id_seq OWNED BY public.calendar_availability.id;


--
-- Name: cancellation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cancellation_rules (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    days_before integer NOT NULL,
    refund_percentage numeric(5,2) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cancellation_rules OWNER TO postgres;

--
-- Name: cancellation_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cancellation_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cancellation_rules_id_seq OWNER TO postgres;

--
-- Name: cancellation_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cancellation_rules_id_seq OWNED BY public.cancellation_rules.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    property_id integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    reservation_id integer,
    property_id integer,
    message text NOT NULL,
    sent_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    read boolean DEFAULT false,
    read_at timestamp(6) with time zone
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    reference_url text,
    reference_id integer,
    read boolean DEFAULT false,
    read_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    reservation_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    platform_fee numeric(10,2) DEFAULT 0.00,
    host_amount numeric(10,2) DEFAULT 0.00,
    transaction_number character varying(100),
    payment_gateway_response text,
    refund_amount numeric(10,2) DEFAULT 0.00,
    refund_date timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    address character varying(255) NOT NULL,
    city character varying(100) DEFAULT 'Loja'::character varying,
    province character varying(100) DEFAULT 'Loja'::character varying,
    latitude numeric(10,8),
    longitude numeric(11,8),
    num_guests integer DEFAULT 1 NOT NULL,
    num_rooms integer DEFAULT 1 NOT NULL,
    num_beds integer DEFAULT 1 NOT NULL,
    num_bathrooms integer DEFAULT 1 NOT NULL,
    price_per_night numeric(10,2) NOT NULL,
    cancellation_rule_id integer,
    is_active boolean DEFAULT true,
    property_type character varying(50) DEFAULT 'apartment'::character varying,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(6) with time zone,
    publication_status character varying(50) DEFAULT 'draft'::character varying,
    published_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: property_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_amenities (
    id integer NOT NULL,
    property_id integer NOT NULL,
    amenity_id integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.property_amenities OWNER TO postgres;

--
-- Name: property_amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_amenities_id_seq OWNER TO postgres;

--
-- Name: property_amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_amenities_id_seq OWNED BY public.property_amenities.id;


--
-- Name: property_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_images (
    id integer NOT NULL,
    property_id integer NOT NULL,
    image_url text NOT NULL,
    is_main boolean DEFAULT false,
    display_order integer DEFAULT 1,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.property_images OWNER TO postgres;

--
-- Name: property_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_images_id_seq OWNER TO postgres;

--
-- Name: property_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_images_id_seq OWNED BY public.property_images.id;


--
-- Name: property_phones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_phones (
    id integer NOT NULL,
    property_id integer NOT NULL,
    phone_number character varying(20) NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.property_phones OWNER TO postgres;

--
-- Name: property_phones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_phones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_phones_id_seq OWNER TO postgres;

--
-- Name: property_phones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_phones_id_seq OWNED BY public.property_phones.id;


--
-- Name: property_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_subscriptions (
    id integer NOT NULL,
    property_id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    plan_price numeric(10,2) DEFAULT 3.00,
    starts_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone,
    auto_renew boolean DEFAULT false,
    payment_method character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    payment_transaction_id character varying(255)
);


ALTER TABLE public.property_subscriptions OWNER TO postgres;

--
-- Name: property_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_subscriptions_id_seq OWNER TO postgres;

--
-- Name: property_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_subscriptions_id_seq OWNED BY public.property_subscriptions.id;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    property_id integer NOT NULL,
    user_id integer NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    num_guests integer DEFAULT 1 NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    cancellation_reason text,
    cancelled_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(6) with time zone
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_seq OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    reservation_id integer,
    property_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    cleanliness integer,
    communication integer,
    location integer,
    value_for_money integer,
    host_response text,
    host_response_date timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(6) with time zone
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    refresh_token text,
    device_info text,
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true,
    expires_at timestamp(6) with time zone NOT NULL,
    last_activity timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_sessions_id_seq OWNER TO postgres;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    surname character varying(150),
    email character varying(255) NOT NULL,
    phone character varying(20),
    password text,
    avatar_url text,
    auth_provider character varying(50) DEFAULT 'local'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    role_id integer DEFAULT 1 NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp(6) with time zone,
    profile_image_url text,
    accepted_terms boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: amenities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities ALTER COLUMN id SET DEFAULT nextval('public.amenities_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: calendar_availability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_availability ALTER COLUMN id SET DEFAULT nextval('public.calendar_availability_id_seq'::regclass);


--
-- Name: cancellation_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cancellation_rules ALTER COLUMN id SET DEFAULT nextval('public.cancellation_rules_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: property_amenities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_amenities ALTER COLUMN id SET DEFAULT nextval('public.property_amenities_id_seq'::regclass);


--
-- Name: property_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images ALTER COLUMN id SET DEFAULT nextval('public.property_images_id_seq'::regclass);


--
-- Name: property_phones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_phones ALTER COLUMN id SET DEFAULT nextval('public.property_phones_id_seq'::regclass);


--
-- Name: property_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.property_subscriptions_id_seq'::regclass);


--
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
57511c1f-11d2-4270-83f0-96e1d88e5160	aebf47067a4a02d0eeced61d96b7aa371247c9fe3cbd911020b6161f63c533bb	2026-01-22 12:15:07.550537-05	20260122171507_add_province_field	\N	\N	2026-01-22 12:15:07.355429-05	1
18b05461-c5f1-4380-a7b2-791a57eb155c	943f17f3a386ebc92bccb587993d85d3f84b024940a0da6d19a24aa4b73d6630	2026-01-27 11:20:40.891865-05	20260127162040_add_profile_image_url	\N	\N	2026-01-27 11:20:40.885398-05	1
171815f9-8932-45bf-90f9-8b52a6792487	087a1a2d1de499a64cfcd0f9bcab544842aceeb59480173b4f8e98145cf50c43	2026-01-30 14:06:23.063771-05	20260130190623_add_accepted_terms	\N	\N	2026-01-30 14:06:23.055644-05	1
\.


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amenities (id, name, icon, category, created_at, updated_at) FROM stdin;
1	WiFi	\N	Conectividad	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
2	Aire acondicionado	\N	Clima	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
3	Calefacción	\N	Clima	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
4	Televisor	\N	Entretenimiento	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
5	Cocina equipada	\N	Cocina	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
6	Refrigerador	\N	Cocina	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
7	Lavadora	\N	Servicios	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
8	Piscina	\N	Exterior	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
9	Patio	\N	Exterior	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
10	Garaje	\N	Estacionamiento	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
11	Estacionamiento	\N	Estacionamiento	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
12	Balcón	\N	Exterior	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
13	Jacuzzi	\N	Baño	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
14	Caja fuerte	\N	Seguridad	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
15	Alarma	\N	Seguridad	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
16	Cámara de seguridad	\N	Seguridad	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
17	Servicio de limpieza	\N	Servicios	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
18	Recepción 24 horas	\N	Servicios	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
19	Mascotas permitidas	\N	Políticas	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
20	Estacionamiento gratuito	\N	Estacionamiento	2026-01-29 10:20:23.756317-05	2026-01-29 10:20:23.756317-05
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: calendar_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_availability (id, property_id, date, available, price_per_night, min_nights, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cancellation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cancellation_rules (id, name, description, days_before, refund_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, property_id, created_at) FROM stdin;
1	4	4	2026-01-27 13:53:23.772-05
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, reservation_id, property_id, message, sent_at, read, read_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, message, reference_url, reference_id, read, read_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, reservation_id, amount, payment_method, payment_status, platform_fee, host_amount, transaction_number, payment_gateway_response, refund_amount, refund_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (id, user_id, title, description, address, city, province, latitude, longitude, num_guests, num_rooms, num_beds, num_bathrooms, price_per_night, cancellation_rule_id, is_active, property_type, created_at, updated_at, deleted_at, publication_status, published_at, expires_at) FROM stdin;
1	4	dasad	dsasdasd	dasdasd	Loja	Loja	\N	\N	1	1	1	1	45.00	\N	t	apartment	2026-01-22 19:28:32.503-05	2026-01-22 19:28:32.503-05	\N	active	2026-01-22 19:29:50.146-05	2026-02-21 19:29:50.146-05
2	4	szxcxz	zcxczxc	cxzcxz	Loja	Loja	\N	\N	1	1	1	1	80.00	\N	t	apartment	2026-01-25 20:41:49.391-05	2026-01-25 21:58:19.658-05	\N	active	2026-01-25 20:44:10.573-05	2026-02-24 20:44:10.573-05
3	4	hola	aods	asdad	Loja	Loja	\N	\N	1	1	1	1	40.00	\N	t	apartment	2026-01-26 22:09:17.038-05	2026-01-26 22:09:17.038-05	\N	active	2026-01-26 22:10:26.738-05	2026-02-25 22:10:26.738-05
4	4	Hermosa cabaña 	Hermosa cabaña para rascarte los webos con toda la comodidad	calle españa	Loja	Loja	\N	\N	1	1	1	1	1050.00	\N	t	cabin	2026-01-27 13:49:47.581-05	2026-01-27 13:56:30.423-05	\N	active	2026-01-27 13:51:19.643-05	2026-02-26 13:51:19.643-05
5	4	hola	hola	dawdaw	Loja	Loja	\N	\N	1	1	1	1	50.00	\N	t	apartment	2026-01-29 15:27:04.396-05	2026-01-29 15:27:04.396-05	\N	active	2026-01-29 15:29:27.367-05	2026-02-28 15:29:27.367-05
7	6	hoola	hola	hola	piñas	El Oro	\N	\N	4	1	1	15	350.00	\N	t	apartment	2026-01-31 03:12:06.939-05	2026-01-31 03:12:06.939-05	\N	active	2026-01-31 03:15:04.12-05	2026-03-02 03:15:04.12-05
8	6	sadds	dassda	sdasad	piñas	El Oro	\N	\N	1	1	1	1	50.00	\N	f	apartment	2026-01-31 07:39:00.853-05	2026-01-31 07:39:00.853-05	\N	draft	\N	\N
\.


--
-- Data for Name: property_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_amenities (id, property_id, amenity_id, created_at) FROM stdin;
1	5	13	2026-01-29 15:27:04.429-05
2	5	12	2026-01-29 15:27:04.429-05
3	5	9	2026-01-29 15:27:04.429-05
4	5	20	2026-01-29 15:27:04.429-05
5	5	1	2026-01-29 15:27:04.429-05
6	5	7	2026-01-29 15:27:04.429-05
7	5	16	2026-01-29 15:27:04.429-05
8	5	17	2026-01-29 15:27:04.429-05
9	7	10	2026-01-31 03:12:06.968-05
10	7	9	2026-01-31 03:12:06.968-05
11	8	8	2026-01-31 07:39:00.872-05
\.


--
-- Data for Name: property_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_images (id, property_id, image_url, is_main, display_order, created_at) FROM stdin;
1	2	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769378297/arriendos-loja/properties/wihcqe4wuww9leg1ebig.webp	t	1	2026-01-25 21:58:19.67-05
2	2	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769378297/arriendos-loja/properties/fy5rkyvyritbj82ldmlh.jpg	f	2	2026-01-25 21:58:19.67-05
3	2	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769378297/arriendos-loja/properties/bcty2j5yjw3hgs7ppaof.jpg	f	3	2026-01-25 21:58:19.67-05
4	2	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769378297/arriendos-loja/properties/roubpew6r6yxz6silovw.jpg	f	4	2026-01-25 21:58:19.67-05
9	4	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769521786/arriendos-loja/properties/ng6dgjhxsbm1s1hyu7yr.webp	t	1	2026-01-27 13:56:30.455-05
10	4	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769521786/arriendos-loja/properties/nr4kews2mix1acdc2lka.jpg	f	2	2026-01-27 13:56:30.455-05
11	4	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769521786/arriendos-loja/properties/z7ffngiust3opxooptyx.jpg	f	3	2026-01-27 13:56:30.455-05
12	4	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769521786/arriendos-loja/properties/rkh0bztbwq2d564j9qba.jpg	f	4	2026-01-27 13:56:30.455-05
13	4	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769522187/arriendos-loja/properties/ebksobjwtckbvbapic3p.avif	f	5	2026-01-27 13:56:30.455-05
14	5	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769700422/arriendos-loja/properties/mudlwkwcnxnbinlvbfvy.avif	t	1	2026-01-29 15:27:04.421-05
15	5	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769700422/arriendos-loja/properties/ioaygniswqyz0odiiubt.webp	f	2	2026-01-29 15:27:04.421-05
16	5	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769700422/arriendos-loja/properties/gypsgebfckyah4nmumig.jpg	f	3	2026-01-29 15:27:04.421-05
17	5	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769700422/arriendos-loja/properties/irzjh9nglpqxjjdpuued.jpg	f	4	2026-01-29 15:27:04.421-05
18	5	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769700422/arriendos-loja/properties/ljk63wyqpz9rdx6jxpgo.jpg	f	5	2026-01-29 15:27:04.421-05
19	7	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769829125/arriendos-loja/properties/medbzby455ubesljzpmk.avif	t	1	2026-01-31 03:12:06.96-05
20	7	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769829125/arriendos-loja/properties/trujjaknkihqxd5vpijr.webp	f	2	2026-01-31 03:12:06.96-05
21	7	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769829125/arriendos-loja/properties/nsxgni3v9tlvydyifkyw.jpg	f	3	2026-01-31 03:12:06.96-05
22	7	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769829125/arriendos-loja/properties/uygkwhld3mesmoee5dq4.jpg	f	4	2026-01-31 03:12:06.96-05
23	7	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769829125/arriendos-loja/properties/fqa11nrqmwxafqbcwpzs.jpg	f	5	2026-01-31 03:12:06.96-05
24	8	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769845139/arriendos-loja/properties/y9hlokgsz4o7gusuwwap.avif	t	1	2026-01-31 07:39:00.867-05
25	8	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769845139/arriendos-loja/properties/kjf0w3b4eyslgctkmhrd.webp	f	2	2026-01-31 07:39:00.867-05
26	8	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769845139/arriendos-loja/properties/ucan8vxiuwfrpidbfrmm.jpg	f	3	2026-01-31 07:39:00.867-05
\.


--
-- Data for Name: property_phones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_phones (id, property_id, phone_number, is_primary, created_at) FROM stdin;
4	2	0997669770	t	2026-01-25 21:58:19.678-05
5	2	0987776886	f	2026-01-25 21:58:19.678-05
6	3	0997669770	t	2026-01-26 22:09:17.055-05
8	4	0997669770	t	2026-01-27 13:56:30.47-05
9	5	0997669770	t	2026-01-29 15:27:04.413-05
11	7	0997669770	t	2026-01-31 03:12:06.953-05
12	8	0997669770	t	2026-01-31 07:39:00.862-05
\.


--
-- Data for Name: property_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_subscriptions (id, property_id, user_id, status, plan_price, starts_at, expires_at, auto_renew, payment_method, created_at, updated_at, payment_transaction_id) FROM stdin;
1	1	4	active	3.00	2026-01-22 19:29:50.146-05	2026-02-21 19:29:50.146-05	f	paypal	2026-01-22 14:29:50.163274-05	2026-01-22 14:29:50.163274-05	9T6361408G002334M
2	2	4	active	3.00	2026-01-25 20:44:10.573-05	2026-02-24 20:44:10.573-05	f	paypal	2026-01-25 15:44:10.590312-05	2026-01-25 15:44:10.590312-05	35G02391H1778842H
3	3	4	active	3.00	2026-01-26 22:10:26.738-05	2026-02-25 22:10:26.738-05	f	paypal	2026-01-26 17:10:26.753962-05	2026-01-26 17:10:26.753962-05	5S883180TT3984353
4	4	4	active	3.00	2026-01-27 13:51:19.643-05	2026-02-26 13:51:19.643-05	f	paypal	2026-01-27 08:51:19.660601-05	2026-01-27 08:51:19.660601-05	2J0291644L249952N
5	5	4	active	3.00	2026-01-29 15:29:27.367-05	2026-02-28 15:29:27.367-05	f	paypal	2026-01-29 10:29:27.38161-05	2026-01-29 10:29:27.38161-05	8Y517389SV6596625
7	7	6	active	3.00	2026-01-31 03:15:04.12-05	2026-03-02 03:15:04.12-05	f	paypal	2026-01-30 22:15:04.128362-05	2026-01-30 22:15:04.128362-05	34V88612XL7112837
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, property_id, user_id, check_in, check_out, num_guests, total_price, status, cancellation_reason, cancelled_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, reservation_id, property_id, user_id, rating, comment, cleanliness, communication, location, value_for_money, host_response, host_response_date, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at) FROM stdin;
1	user	Usuario regular	2026-01-22 19:09:28.418-05
2	host	Anfitrión de propiedades	2026-01-22 19:09:28.428-05
3	admin	Administrador del sistema	2026-01-22 19:09:28.433-05
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (id, user_id, token, refresh_token, device_info, ip_address, user_agent, is_active, expires_at, last_activity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, surname, email, phone, password, avatar_url, auth_provider, is_active, role_id, created_at, updated_at, deleted_at, profile_image_url, accepted_terms) FROM stdin;
4	Andree “Andre878”	Negrón	andre878et@gmail.com	0997669770	$2b$10$8egKTXkKNbrcGXp6DSe8U./AEEWffI1bfgIAIr0ThgPwg2LigSlhC	\N	google	t	1	2026-01-22 19:11:48.489-05	2026-01-22 19:11:48.489-05	\N	https://res.cloudinary.com/dsj29v7xt/image/upload/v1769799256/arriendos-loja/properties/rtaolp63afboeb5sd369.png	t
6	Jeremy Negron	\N	jeremys.a.878@gmail.com	0997669770	\N	https://lh3.googleusercontent.com/a/ACg8ocLOQIRGZVSEPKGdaD4A_NvUU6jqJfiAlpesTFAbnAsYYB4zWw=s96-c	google	t	1	2026-01-30 19:00:00.22-05	2026-01-30 19:00:00.22-05	\N	\N	t
\.


--
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.amenities_id_seq', 20, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: calendar_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_availability_id_seq', 1, false);


--
-- Name: cancellation_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cancellation_rules_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_id_seq', 8, true);


--
-- Name: property_amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_amenities_id_seq', 11, true);


--
-- Name: property_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_images_id_seq', 26, true);


--
-- Name: property_phones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_phones_id_seq', 12, true);


--
-- Name: property_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_subscriptions_id_seq', 7, true);


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: calendar_availability calendar_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_availability
    ADD CONSTRAINT calendar_availability_pkey PRIMARY KEY (id);


--
-- Name: cancellation_rules cancellation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cancellation_rules
    ADD CONSTRAINT cancellation_rules_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_amenities property_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_pkey PRIMARY KEY (id);


--
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (id);


--
-- Name: property_phones property_phones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_phones
    ADD CONSTRAINT property_phones_pkey PRIMARY KEY (id);


--
-- Name: property_subscriptions property_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_subscriptions
    ADD CONSTRAINT property_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: amenities_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX amenities_name_key ON public.amenities USING btree (name);


--
-- Name: calendar_availability_property_id_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX calendar_availability_property_id_date_key ON public.calendar_availability USING btree (property_id, date);


--
-- Name: cancellation_rules_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cancellation_rules_name_key ON public.cancellation_rules USING btree (name);


--
-- Name: favorites_user_id_property_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_property_id_key ON public.favorites USING btree (user_id, property_id);


--
-- Name: idx_amenities_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_amenities_category ON public.amenities USING btree (category);


--
-- Name: idx_amenities_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_amenities_name ON public.amenities USING btree (name);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC);


--
-- Name: idx_audit_logs_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity_id ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_entity_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs USING btree (entity_type);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_calendar_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_calendar_available ON public.calendar_availability USING btree (property_id, available);


--
-- Name: idx_calendar_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_calendar_date ON public.calendar_availability USING btree (date);


--
-- Name: idx_calendar_property_date_range; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_calendar_property_date_range ON public.calendar_availability USING btree (property_id, date);


--
-- Name: idx_calendar_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_calendar_property_id ON public.calendar_availability USING btree (property_id);


--
-- Name: idx_cancellation_rules_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cancellation_rules_name ON public.cancellation_rules USING btree (name);


--
-- Name: idx_favorites_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_favorites_property_id ON public.favorites USING btree (property_id);


--
-- Name: idx_favorites_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_favorites_user_id ON public.favorites USING btree (user_id);


--
-- Name: idx_messages_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_property_id ON public.messages USING btree (property_id);


--
-- Name: idx_messages_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_read ON public.messages USING btree (receiver_id, read);


--
-- Name: idx_messages_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver_id ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_reservation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_reservation_id ON public.messages USING btree (reservation_id);


--
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);


--
-- Name: idx_messages_sent_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sent_at ON public.messages USING btree (sent_at);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (user_id, read);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (type);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_created_at ON public.payments USING btree (created_at);


--
-- Name: idx_payments_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_payment_status ON public.payments USING btree (payment_status);


--
-- Name: idx_payments_reservation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_reservation_id ON public.payments USING btree (reservation_id);


--
-- Name: idx_payments_transaction_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_transaction_number ON public.payments USING btree (transaction_number);


--
-- Name: idx_properties_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_city ON public.properties USING btree (city);


--
-- Name: idx_properties_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_is_active ON public.properties USING btree (is_active);


--
-- Name: idx_properties_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_location ON public.properties USING btree (latitude, longitude);


--
-- Name: idx_properties_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_price ON public.properties USING btree (price_per_night);


--
-- Name: idx_properties_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_province ON public.properties USING btree (province);


--
-- Name: idx_properties_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_user_id ON public.properties USING btree (user_id);


--
-- Name: idx_property_amenities_amenity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_amenities_amenity_id ON public.property_amenities USING btree (amenity_id);


--
-- Name: idx_property_amenities_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_amenities_property_id ON public.property_amenities USING btree (property_id);


--
-- Name: idx_property_images_is_main; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_images_is_main ON public.property_images USING btree (property_id, is_main);


--
-- Name: idx_property_images_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_images_property_id ON public.property_images USING btree (property_id);


--
-- Name: idx_property_phones_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_property_phones_property_id ON public.property_phones USING btree (property_id);


--
-- Name: idx_reservations_check_in; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_check_in ON public.reservations USING btree (check_in);


--
-- Name: idx_reservations_check_out; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_check_out ON public.reservations USING btree (check_out);


--
-- Name: idx_reservations_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_dates ON public.reservations USING btree (check_in, check_out);


--
-- Name: idx_reservations_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_property_id ON public.reservations USING btree (property_id);


--
-- Name: idx_reservations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_status ON public.reservations USING btree (status);


--
-- Name: idx_reservations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user_id ON public.reservations USING btree (user_id);


--
-- Name: idx_reviews_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_property_id ON public.reviews USING btree (property_id);


--
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- Name: idx_reviews_reservation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_reservation_id ON public.reviews USING btree (reservation_id);


--
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- Name: idx_user_sessions_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions USING btree (expires_at);


--
-- Name: idx_user_sessions_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_is_active ON public.user_sessions USING btree (is_active);


--
-- Name: idx_user_sessions_refresh_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_refresh_token ON public.user_sessions USING btree (refresh_token);


--
-- Name: idx_user_sessions_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_token ON public.user_sessions USING btree (token);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_users_auth_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_auth_provider ON public.users USING btree (auth_provider);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_id ON public.users USING btree (role_id);


--
-- Name: payments_transaction_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_transaction_number_key ON public.payments USING btree (transaction_number);


--
-- Name: property_amenities_property_id_amenity_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX property_amenities_property_id_amenity_id_key ON public.property_amenities USING btree (property_id, amenity_id);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: unique_property_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_property_phone ON public.property_phones USING btree (property_id, phone_number);


--
-- Name: user_sessions_refresh_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_sessions_refresh_token_key ON public.user_sessions USING btree (refresh_token);


--
-- Name: user_sessions_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_sessions_token_key ON public.user_sessions USING btree (token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: calendar_availability calendar_availability_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_availability
    ADD CONSTRAINT calendar_availability_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE SET NULL;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE CASCADE;


--
-- Name: properties properties_cancellation_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_cancellation_rule_id_fkey FOREIGN KEY (cancellation_rule_id) REFERENCES public.cancellation_rules(id) ON DELETE SET NULL;


--
-- Name: properties properties_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(id) ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_images property_images_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_phones property_phones_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_phones
    ADD CONSTRAINT property_phones_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_subscriptions property_subscriptions_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_subscriptions
    ADD CONSTRAINT property_subscriptions_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_subscriptions property_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_subscriptions
    ADD CONSTRAINT property_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict yCwopFnfqmk6VcqODhuOog18sp41qRmTJASETkX41gystlPRpfAW6K8SrKcjc43

