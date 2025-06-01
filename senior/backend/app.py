import json
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Welcome to the Book API. Use /api/v1/ for API access."}), 200


@app.route("/api/v1/", methods=["GET"])
def health_check():
    try:
        conn = sqlite3.connect('db.sqlite')
        conn.execute('SELECT 1')
        conn.close()

        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"status": "error", "db": "disconnected", "error": str(e)}), 500


@app.route('/api/v1/books', methods=['GET'])
def get_books():
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    query_filters = {
        'author': request.args.get('author', default="", type=str),
        'title': request.args.get('title', default="", type=str),
        'subjects': request.args.get('subjects', default="", type=str),
        'publisher': request.args.get('publisher', default="", type=str),
    }

    books = get_all_books(page=page, page_size=page_size, query_filters=query_filters)

    return jsonify(books)


@app.route('/api/v1/books/author/<author_slug>', methods=['GET'])
def get_books_by_author(author_slug):
    query_filters = {
        'name': request.args.get('name', default="", type=str),
        'subject': request.args.get('subject', default="", type=str)
    }

    return jsonify(get_books_by_author_name(author_slug, query_filters=query_filters))


@app.route('/api/v1/books/subjects', methods=['GET'])
def get_books_by_subject():
    return jsonify(get_books_by_subject())


@app.route('/api/v1/books/subjects/<subject>', methods=['GET'])
def books_by_subject_slug(subject):
    return jsonify(get_books_by_subject_slug(subject))


@app.route('/api/v1/authors', methods=['GET'])
def get_all_authors():
    return jsonify(get_authors())


@app.route('/api/v1/books', methods=['POST'])
def create_book():

    # Get the book data from the request body
    book_data = request.get_json()

    return jsonify(create_new_book(book_data))


def get_all_books(page=1, page_size=10, query_filters=None):
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    # Calculate the offset based on the page number and page size
    offset = (page - 1) * page_size

    # Prepare the base query - Pick fields to turn performatic queries
    query = '''
    SELECT
        b.id,
        b.author,
        b.title,
        b.subjects,
        b.publisher,
        b.author_slug,
        COUNT(*) OVER() as total_count
    FROM book b
    '''
    conditions = []

    # Add filters to the query if provided
    if query_filters:
        if query_filters.get('author'):
            conditions.append(f"b.author LIKE '{query_filters['author']}%'")
        if query_filters.get('title'):
            conditions.append(f"b.title LIKE '{query_filters['title']}%'")
        if query_filters.get('subjects'):
            conditions.append(f"b.subjects LIKE '{query_filters['subjects']}%'")
        if query_filters.get('publisher'):
            conditions.append(f"b.publisher LIKE '{query_filters['publisher']}%'")

    # If there are conditions, append them to the query
    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)

    # Execute a SELECT query with pagination
    cursor.execute(f'{query} LIMIT {page_size} OFFSET {offset};')
    books = cursor.fetchall()

    # Convert the books data to a list of dictionaries
    book_list = []
    total_books = books[0][6] if books else 0

    for book in books:
        book_dict = {
            'id': book[0],
            'author': book[1],
            'title': book[2],
            'subjects': book[3],
            'publisher': book[4],
            'author_slug': book[5],
        }
        book_list.append(book_dict)

    # Close the database connection
    conn.close()

    response = {
        'page': page,
        'page_size': page_size,
        'total_books': total_books,
        'data': book_list
    }

    # Return the books as a JSON response
    return response


def get_authors():
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    # Execute a SELECT query to fetch all authors
    cursor.execute('SELECT * FROM author;')
    authors = cursor.fetchall()

    author_list = []

    for author in authors:
        author_dict = {
            'id': author[0],
            'title': author[1],
            'slug': author[2],
            'biography': author[3]
        }
        author_list.append(author_dict)

    # Close the database connection
    conn.close()

    # Return the authors as a JSON response
    return author_list


def get_books_by_author_name(author_slug, query_filters=None):
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    # Prepare the base query
    query = f"SELECT * FROM book WHERE author_slug = '{author_slug}'"
    conditions = []

    if query_filters:
        if query_filters.get('name'):
            conditions.append(f"title LIKE '%{query_filters['name']}%'")
        if query_filters.get('subject'):
            conditions.append(f"subjects LIKE '%{query_filters['subject']}%'")

    if conditions:
        query += ' AND ' + ' AND '.join(conditions)

    # Execute a SELECT query to fetch all books by the given author
    cursor.execute(query)
    books = cursor.fetchall()

    # Convert the books data to a list of dictionaries
    book_list = []

    for book in books:
        book_dict = {
            'id': book[0],
            'title': book[1],
            'author': book[2],
            'biography': book[4],
            'authors': book[5],
            'publisher': book[12],
            'synopsis': book[21],
        }
        book_list.append(book_dict)

    # Close the database connection
    conn.close()

    # Return the books as a JSON response
    return book_list


def get_books_by_subject():
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT subjects FROM book;")
    subjects = cursor.fetchall()

    conn.close()

    return subjects


def get_books_by_subject_slug(subject):
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    # @TODO: Query are fixed, but the entries in the database are not stored correctly in book_subjects table.
    query = '''
    SELECT book.title, book.author, book.author_slug, book.author_bio, book.authors, book.publisher, book.synopsis
    FROM book
    INNER JOIN book_subjects ON book.id = book_subjects.book
    INNER JOIN subject ON book_subjects.sub_subject = subject.id
    WHERE subject.slug = ?
    '''

    # Execute a SELECT query to fetch all books by the given subject
    cursor.execute(query, (subject,))
    books = cursor.fetchall()

    # Convert the books data to a list of dictionaries
    book_list = []

    for book in books:
        book_dict = {
            'title': book[0],
            'author': book[1],
            'slug': book[2],
            'biography': book[3],
            'authors': book[4],
            'publisher': book[5],
            'synopsis': book[6],
        }
        book_list.append(book_dict)

    # Close the database connection
    conn.close()

    # Return the books as a JSON response
    return book_list


def create_new_book(book_data):
    conn = sqlite3.connect('db.sqlite')
    cursor = conn.cursor()

    # Get the book data from the request body
    title = book_data['title']
    author = book_data['author']
    author_slug = book_data['author_slug']
    author_bio = book_data['author_bio']
    authors = book_data['authors']
    publisher = book_data['publisher']
    synopsis = book_data['synopsis']

    # Execute a query to create a new book
    cursor.execute('INSERT INTO book (title, author, author_slug, author_bio, authors, publisher, synopsis) VALUES (?, ?, ?, ?, ?, ?, ?);',
                   (title, author, author_slug, author_bio, authors, publisher, synopsis))

    # Commit the changes to the database
    conn.commit()

    # Close the database connection
    conn.close()

    # Return a message to the user
    return {'message': 'Book created successfully.'}, 201
