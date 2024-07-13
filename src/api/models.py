from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'first_name': self.first_name,
            'last_name': self.last_name
        }


class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    director = db.Column(db.String(), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    genre = db.Column(db.String(), nullable=False)
    imdb_rating = db.Column(db.Float, nullable=True)
    poster_url = db.Column(db.String(), nullable=True)

    def __repr__(self):
        return f'<Movie {self.title}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'duration': self.duration,
            'director': self.director,
            'year': self.year,
            'genre': self.genre,
            'imdb_rating': self.imdb_rating,
            'poster_url': self.poster_url
        }


class Series(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), nullable=False)
    seasons = db.Column(db.Integer, nullable=False)
    director = db.Column(db.String(), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    genre = db.Column(db.String(), nullable=False)
    imdb_rating = db.Column(db.Float, nullable=True)
    poster_url = db.Column(db.String(), nullable=True)

    def __repr__(self):
        return f'<Series {self.title}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'seasons': self.seasons,
            'director': self.director,
            'year': self.year,
            'genre': self.genre,
            'imdb_rating': self.imdb_rating,
            'poster_url': self.poster_url
        }
    

class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', foreign_keys=[user_id])
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'))
    movie = db.relationship('Movies', foreign_keys=[movie_id])
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'))
    series = db.relationship('Series', foreign_keys=[series_id])

    def __repr__(self):
        return f'<Favorite User: {self.user_id} Movie: {self.movie_id} Series: {self.series_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'series_id': self.series_id
        }