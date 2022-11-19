from flask import Flask, render_template, request, redirect, url_for, session
import ibm_db
from flask_mail import Mail, Message
import re
from werkzeug.utils import secure_filename
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2, resources_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2

app = Flask(__name__)
mail = Mail(app) # instantiate the mail class

# configuration of mail
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'derinjose886@gmail.com'
app.config['MAIL_PASSWORD'] = 'lhmjtfrjwblfbgeq'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
app.secret_key = 'a'
conn = ibm_db.connect("DATABASE=bludb;HOSTNAME=ba99a9e6-d59e-4883-8fc0-d6a8c9f7a08f.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud;PORT=31321;SECURITY=SSL;SSLServerCertificate=DigiCertGlobalRootCA.crt;UID=ksm24043;PWD=ZXsdfH0rppztWofo",'','')
@app.route('/')
def home():
    return render_template('register.html')

@app.route('/login', methods =['GET', 'POST'])
def login():
    global userid
    msg = ''
    if request.method == 'POST'and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        stmt = ibm_db.prepare(conn,'SELECT * FROM accounts WHERE username = ?AND password = ?')
        ibm_db.bind_param(stmt,1,username)
        ibm_db.bind_param(stmt,2,password)
        ibm_db.execute(stmt)
        account = ibm_db.fetch_assoc(stmt)
        if account:
            session['loggedin'] = True
            session['username'] = account['USERNAME']
            msg = 'Logged in successfully !'
            return render_template('index.html', msg = msg)
        else:
            msg = 'Incorrect username / password !'
    return render_template('login.html', a = msg)

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/register', methods =['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        sql = "SELECT * FROM accounts WHERE username = ? "
        stmt = ibm_db.prepare(conn,sql)
        ibm_db.bind_param(stmt,1,username)
        ibm_db.execute(stmt)
        account = ibm_db.fetch_assoc(stmt)
        msgg = Message(
                'Hello',
                sender ='derinjose886@gmail.com',
                recipients = [email]
               )
        msgg.body = ' Welcome to NUTRI LITE!! Thanks for registering.  '
        mail.send(msgg) 
        
        if account:
            msg = 'Account already exists !'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Invalid email address !'
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only characters and numbers !'
        elif not username or not password or not email:
            msg = 'Please fill out the form !'
        else:
            insert_sql = "INSERT INTO accounts (username,email,password) VALUES (?, ?, ?)"
            stmt = ibm_db.prepare(conn,insert_sql)
            ibm_db.bind_param(stmt, 1, username)
            ibm_db.bind_param(stmt, 2, email)
            ibm_db.bind_param(stmt, 3, password)
            ibm_db.execute(stmt)
            msg = 'You have successfully registered !'
    elif request.method == 'POST':
        msg = 'Please fill out the form !'
    return render_template('register.html', msg = msg)

@app.route('/bmi', methods =['GET', 'POST'])
def bmi():
    if request.method == 'POST':
        height = request.form['height']
        weight= request.form['weight']
    return render_template('bmi.html')


@app.route('/img',  methods =['GET', 'POST'])
def img():
    print(request.form)
    return render_template('image.html')

@app.route('/food')
def food():
    return render_template('food.html')

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
  global request
  if flask.request.method == "POST" and session['LoggedIn']:
    if 'file' not in flask.request.files:
      flash('No file part')
      return redirect(flask.request.url)
    file = flask.request.files['file']
    if file.filename == '':
      flash('No image selected')
      return redirect(flask.request.url)
    if file and allowed_file(file.filename):
      filename = secure_filename(file.filename)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      flash('Image successfully uploaded')

      with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), "rb") as f:
        file_bytes = f.read()

      request = service_pb2.PostModelOutputsRequest(
          model_id="food-item-v1-recognition",
          user_app_id=resources_pb2.UserAppIDSet(app_id=YOUR_APPLICATION_ID),
          inputs=[
            resources_pb2.Input(
              data=resources_pb2.Data(image=resources_pb2.Image(
                    base64=file_bytes
                )
              )
            )
          ],
      )
      response = stub.PostModelOutputs(request, metadata=metadata)

      if response.status.code != status_code_pb2.SUCCESS:
          print(response)
          raise Exception(f"Request failed, status code: {response.status}")

      foodname = response.outputs[0].data.concepts[0].name

      ingredients = ''
      for concept in response.outputs[0].data.concepts:
        ingredients += f"{concept.name}: {round(concept.value, 2)}, "

      nutritionValues = ''
    #headers = {'X-RapidAPI-Key': "e90a2b1101msh8a9c2a55215e6b8p1b6838jsn26de2538dc24",
    #'X-RapidAPI-Host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"}
      nutritions = {
        "recipesUsed": 10,
        "calories": {
          "value": 470,
          "unit": "calories",
          "confidenceRange95Percent": {
            "min": 408.93,
            "max": 582.22
          },
          "standardDeviation": 139.8
        },
        "fat": {
          "value": 17,
          "unit": "g",
          "confidenceRange95Percent": {
            "min": 12.81,
            "max": 21.36
          },
          "standardDeviation": 6.9
        },
        "protein": {
          "value": 15,
          "unit": "g",
          "confidenceRange95Percent": {
            "min": 9.06,
            "max": 29.78
          },
          "standardDeviation": 16.71
        },
        "carbs": {
          "value": 65,
          "unit": "g",
          "confidenceRange95Percent": {
            "min": 57.05,
            "max": 77.9
          },
          "standardDeviation": 16.81
        }
      }
      nutritions.pop('recipesUsed')
      for i in nutritions:
        nutritionValues += f"{i}: {nutritions[i]['value']} {nutritions[i]['unit']}, "
      

      sql = "INSERT INTO foods VALUES(?,?,?,?,?)"
      stmt=ibm_db.prepare(conn, sql)
      ibm_db.bind_param(stmt, 1, session['userid'])
      ibm_db.bind_param(stmt, 2, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
      ibm_db.bind_param(stmt, 3, foodname)
      ibm_db.bind_param(stmt, 4, ingredients)
      ibm_db.bind_param(stmt, 5, nutritionValues)
      ibm_db.execute(stmt)

      
      return render_template("dashboard.html", 
        filename = filename,
        username = session['username'],
        foodname = foodname, 
        ingredients = ingredients, 
        nutritionValues = nutritionValues,
      )
    else:
      flash('Allowed image formats - png, jpg, jpeg')
      return redirect(flask.request.url)

if __name__ == '__main__':
 app.run(debug = True)
