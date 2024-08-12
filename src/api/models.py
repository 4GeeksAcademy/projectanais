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


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', backref=db.backref('favorites', lazy=True))
    title = db.Column(db.String(120), nullable=False)
    imdb_rating = db.Column(db.String(10))
    platforms = db.Column(db.String(120))
    poster_url = db.Column(db.String(250))
    duration = db.Column(db.String(50))
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<Favorite {self.title}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'imdb_rating': self.imdb_rating,
            'platforms': self.platforms,
            'poster_url': self.poster_url,
            'duration': self.duration,
            'description': self.description
        }