# NC News Seeding

-To ensure the project works correctly, you need to create .env files containing the environment variables required to connect to the databases.

.env.test (for the test database).
.env.development (for the development database).

-Add the following values to each file:
 for .env.development  -  PGDATABASE=nc_news
 for .env.test   -   PGDATABASE=nc_news_test


-These variables allow the application to connect to the correct database when working locally.