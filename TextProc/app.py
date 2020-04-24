from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_marshmallow import Marshmallow
from api_functions import finalbow, wordvec

# Init app
app = Flask(__name__)
api = Api(app)

# SQLalchemy setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///TextProc.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Initialize db
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), unique=True)
  content = db.Column(db.String(), nullable=False)

  def __init__(self, name, content):
    self.name = name
    self.content = content

  def __repr__(self):
    return str(self.name)
    return str(self.content)

# User Schema
class UserSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name', 'content')

# Init schema
user_schema = UserSchema()
users_schema = UserSchema(many=True) 

# The following resource creates and gets the whole db

class createandseeDatabase(Resource):
  
    def post(self):
      name = request.json['name']
      content = request.json['content']

      new_user = User(name, content)

      db.session.add(new_user)
      db.session.commit()

      return user_schema.jsonify(new_user)
    
    def get(self):
      all_users = User.query.all()
      result = users_schema.dump(all_users)
      return jsonify(result)

'''
The following resource gets single users from the db,
can update user info on the db and also delete users.
'''
class singleUserOperations(Resource):

  def get(self, id):
    user = User.query.get(id)
    return user_schema.jsonify(user)
    
  def put(self, id):
    user = User.query.get(id)

    newname = request.json['name']
    newcontent = request.json['content']

    user.name = newname
    user.content = newcontent

    db.session.commit()
    return user_schema.jsonify(user)

  def delete(self, id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

class BoWGet(Resource):

  def get(self, id):
    user = User.query.get(id)
    text = user.content
    return jsonify(finalbow(text))

class WordVec(Resource):

  def post(self, id):
    user = User.query.get(id)
    text = user.content
    word = request.json['word']

    return jsonify(wordvec(text, word))

api.add_resource(WordVec, '/users/<id>/wordvec')
api.add_resource(BoWGet, '/users/<id>/getbow')
api.add_resource(singleUserOperations, '/users/<id>')
api.add_resource(createandseeDatabase, '/users')


if __name__=='__main__':
  app.run(debug=True)