"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from api.models import db, Users, Favorites
from flask_sqlalchemy import SQLAlchemy
import requests
import os, json


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()

    # Todos estos campos han de estar presentes en los datos que envio
    title = data.get('title')
    imdb_rating = data.get('imdb_rating')
    platforms = data.get('platforms')
    poster_url = data.get('poster_url')
    duration = data.get('duration')
    description = data.get('description')

    #Lógica para crear y guardar el nuevo favorito
    new_favorite = Favorites(
        user_id=get_jwt_identity()['user_id'],
        title=title,
        imdb_rating=imdb_rating,
        platforms=platforms,
        poster_url=poster_url,
        duration=duration,
        description=description
    )
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify(new_favorite.serialize()), 201


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = get_jwt_identity()['user_id']
    favorites = Favorites.query.filter_by(user_id=current_user_id).all()
    return jsonify([fav.serialize() for fav in favorites]), 200


@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    current_user_id = get_jwt_identity()['user_id']
    favorite = Favorites.query.filter_by(id=id, user_id=current_user_id).first()

    if not favorite:
        return jsonify({"msg": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"msg": "Favorite deleted"}), 200



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Logica de validacion
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if user:
        access_token = create_access_token(identity={'user_id': user.id, 'user_is_admin': user.is_admin})
        response_body['message'] = 'User logged'
        response_body['access_token'] = access_token
        return response_body, 200
    response_body['message'] = 'Bad email or password'
    return response_body, 401


@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    response_body = {} 
    current_user = get_jwt_identity()
    response_body['message'] = f'User logeado: {current_user}'
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])  #El POST de users lo hare en el signup
def handle_users():
    response_body = {}
    if request.method == 'GET':
        # Aquí tengo que hacer la logica para mostrar los usuarios que tengo en mi DB.
        users = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in users]   # List compehension 
        response_body['results'] = results
        response_body['message'] = "Listado de Usuarios"
        return response_body, 200
    if request.method == 'POST':
        response_body['message'] = "Este endpoint no es valido. Debe hacer un /signup"
        return response_body, 200


@api.route('/signup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)
    first_name = data.get("first_name", None)
    last_name = data.get("last_name", None)
    if not email or not password:
        response_body['message'] = "Se necesita un email y una contraseña"
        return jsonify(response_body), 400
    user = Users(email=email, password=password, first_name=first_name, last_name=last_name, is_active=True)
    db.session.add(user)
    db.session.commit()
    response_body['message'] = "Usuario creado con exito"
    response_body['user'] = user.serialize()
    return jsonify(response_body), 201


@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(user_id):
    response_body = {}
    if request.method == 'GET':
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            response_body['results'] = user.serialize()
            response_body['message'] = 'Usuario encontrado'
            return response_body, 200
        response_body['message'] = 'Usuario inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        # Rutina de validacion de datos recibidos TODO
        print(data)
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            user.email = data['email']
            user.is_active = data['is_active']
            user.last_name = data['last_name']
            user.first_name = data['first_name']
            db.session.commit()  # Esto hace commit de los datos y los actualiza en la lista, para que se grabe en la base
            response_body['message'] = 'User updated'
            response_body['results'] = user.serialize()
            return response_body, 200
        response_body['message'] = 'Usuario inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            # db.session.delete(user)
            user.is_active = False
            db.session.commit()
            response_body['message'] = 'Usuario eliminado'
            response_body['results'] = {}
        response_body['message'] = 'Usuario inexistente'
        response_body['results'] = {}
        return response_body, 200




# @api.route('/request-password-reset', methods=['POST'])
# def request_password_reset():
#     response_body = {}
#     try:
#         email = request.json.get('email')
#         if not email:
#             response_body['message'] = "Email is required"
#             return jsonify(response_body), 400

#         user = db.session.query(Users).filter_by(email=email).first()
#         if not user:
#             response_body['message'] = "Email not found"
#             return jsonify(response_body), 404
        
#         token = user.generate_reset_password_token()
#         reset_link = url_for('api.reset_password', token=token, _external=True)
        
#         msg = Message(
#             "Reset Your Password",
#             sender=os.getenv("MAIL_USERNAME"),
#             recipients=[email]
#         )
#         msg.body = f"Please use the following link to reset your password: {reset_link}"
#         mail.send(msg)

#         response_body['message'] = "Email sent for password reset"
#         return jsonify(response_body), 200
#     except Exception as e:
#         response_body['message'] = f"Error processing request: {str(e)}"
#         return jsonify(response_body), 500


# @api.route('/reset-password/<token>', methods=['POST'])
# def reset_password(token):
#     response_body = {}



# @api.route('/reset-password/<token>', methods=['POST'])
# def reset_password(token):
#     user = Users.verify_reset_password_token(token)
#     if not user:
#         return jsonify({"message": "Invalid or expired token"}), 400

#     password = request.json.get('password')
#     user.set_password(password)
#     db.session.commit()
#     return jsonify({"message": "Password has been reset"}), 200


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

@api.route('/get-recommendations', methods=['POST'])
def get_recommendations():
    response_body = {}
    data = request.json
    prompt = data.get('prompt', 'Mi pregunta sobre cine')
    exclude = data.get('exclude', [])

    openai_url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    openai_prompt = f"""Genera múltiples recomendaciones de películas o series en castellano en el siguiente formato JSON:
    [
      {{
        "title": "Nombre de la película o serie",
        "imdb_rating": "Calificación de IMDb",
        "platforms": "Plataformas donde se puede ver",
        "poster_url": "URL del póster",
        "duration": "Duración total en minutos",
        "description": "Breve descripción"
      }},
      {{
        "title": "Nombre de la película o serie",
        "imdb_rating": "Calificación de IMDb",
        "platforms": "Plataformas donde se puede ver",
        "poster_url": "URL del póster",
        "duration": "Duración total en minutos",
        "description": "Breve descripción"
      }},
      {{
        "title": "Nombre de la película o serie",
        "imdb_rating": "Calificación de IMDb",
        "platforms": "Plataformas donde se puede ver",
        "poster_url": "URL del póster",
        "duration": "Duración total en minutos",
        "description": "Breve descripción"
      }}
    ]
    {prompt}
    No incluyas las siguientes películas o series: {', '.join(exclude)}"""

    openai_data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": openai_prompt}],
        "max_tokens": 1000  # Incrementamos el número de tokens
    }

    try:
        response = requests.post(openai_url, headers=headers, json=openai_data)
        response.raise_for_status()
        recommendations = response.json().get('choices', [])
        
        print("Response from OpenAI:", recommendations)  # Add this line to log the response

        # Procesar las recomendaciones y extraer el contenido JSON
        all_recommendations = json.loads(recommendations[0]['message']['content'])
        filtered_recommendations = [rec for rec in all_recommendations if rec['title'] not in exclude]

        print("Filtered Recommendations:", filtered_recommendations)  # Add this line to log the filtered recommendations

        response_body['recommendations'] = filtered_recommendations
        return jsonify(response_body), 200
    except requests.exceptions.HTTPError as e:
        response_body['message'] = f'Error fetching recommendations from OpenAI: {str(e)}'
        return jsonify(response_body), 500
    except ValueError as e:
        response_body['message'] = f'Error parsing recommendations: {str(e)}'
        return jsonify(response_body), 500


TMDB_API_KEY = os.getenv('TMDB_API_KEY')
@api.route('/search_movie', methods=['GET'])
def search_movie():
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error": "Tienes que poner el título de una peli."}), 400

 
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    
    response = requests.get(url)

    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({"error": "Error al contactar con la API."}), response.status_code