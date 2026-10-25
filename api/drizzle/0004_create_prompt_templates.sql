CREATE TABLE "prompt_templates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prompt_templates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flow_name" varchar(128) NOT NULL,
	"node_name" varchar(128) NOT NULL,
	"agent_name" varchar(128),
	"template" jsonb,
	"hexdigest" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
