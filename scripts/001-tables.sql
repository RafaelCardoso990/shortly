CREATE TABLE "users" (
	"id" serial NOT NULL PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE "urls" (
	"id" serial NOT NULL PRIMARY KEY,
	"url" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL,
	"visitCount" numeric NOT NULL DEFAULT 0,
	"userId" serial NOT NULL REFERENCES "users"(id),
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL PRIMARY KEY,
	"token" TEXT NOT NULL,
	"userId" INTEGER NOT NULL REFERENCES "users"(id),
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);









