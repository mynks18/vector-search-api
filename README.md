# Take-home Assignment Documentation

## Setup Instructions

Follow these steps to set up and run the project:

1. **Install PostgreSQL**
   - Download and install Postgres.app with PostgreSQL 16 from [Postgres App](https://postgresapp.com/).
   - Open Postgres.app, initialize PostgreSQL, and go to server settings.
   - Select the user with your system name and change the password to `admin`.
   - Start the PostgreSQL server.

2. **Configure the Project**
   - Navigate to the `config` folder in the project directory.
   - Open `db.js` and update line 3:
     - Change the username and database name from `mayanksharma` to your system username.

3. **Set Up the Database**
   - In the Postgres app, double-click on the database with your username to open a terminal.
   - Run the following command in the terminal:
     ```sql
     CREATE EXTENSION vector;
     ```

4. **Install Ollama**
   - Download and install Ollama from [Ollama Download](https://ollama.com/download).
   - After installation, do **not** run any model as prompted.
   - Open a terminal or command prompt and run:
     ```bash
     ollama pull snowflake-arctic-embed
     ```
   - Again, do **not** run any model as prompted after the installation.

5. **Install Project Dependencies**
   - In the project terminal, run the following commands to install dependencies and start the server:
     ```bash
     npm install
     node server.js
     ```

6. **Install REST Client Extension**
   - Download and install the "REST Client" extension (blue icon) for your code editor.

7. **Test the API**
   - In the root directory of the project, open the `api.http` file to test the API endpoints.

## Additional Resources

- [Postgres App](https://postgresapp.com/)
- [Ollama Download](https://ollama.com/download)

---

# API documentation and usage examples

- **POST: /api/v1/magazine/hybridsearch/[*page_number*]**
  *Returns the hybrid search results*
   - 1. Search endpoint content-type: application/json
        ```json
        {
           "query": "your_search_query
        }
        ```
### Only for adding data, not a part of task submission
- **POST: /api/v1/magazine**
  *Add magazine endpoint*
   - 1. Search endpoint content-type: application/json
        ```json
        {
           "title": "magazine_title",
           "author": "author_name",
           "category": "magazine_category",
           "content": "magazine_content"
         }
        ```
---

# Performance Report

I have used PostgreSQL with pgvector (storing embedding vectors) and tsvector (storing content text).

## Performance considerations
*Requirement: search from 1 million records*
  - Added Hierarchical Navigable Small Worlds (HNSW) indexes for vector search on content embeddings
    **Reason:** Search requires high recall, which makes hnsw better than ivfflat [Reference](https://tembo.io/blog/vector-indexes-in-pgvector)
      - vector_ip_ops
      - vector_cosine_ops
      - vector_l1_ops
   - Added indexes for title, author and content
      - GIN indexing is used for content in TSVECTOR datatype
   - Pagination added for reduce load times
      - limit and offset in queries

---

## Hybrid search implementation explained

**Two individual services for text search and vector search is used**
Embeddings are generated by Meta llama "snowflake-arctic-embed" model, being lightweight.

- **STEP 1:** Common objects from both vector and full text search results are shown first,
- **STEP 2:** followed by objects from only text search,
- **STEP 3:** rest of the objects from vector search.

---
