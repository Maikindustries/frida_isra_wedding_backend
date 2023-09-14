from decouple import config # read env vars

import requests
# from html.parser import HTMLParser
from flask import Flask, session, render_template, redirect, request, url_for, g

ADMIN = "/admin"

app = Flask(__name__)
app.secret_key =  config('WEB_KEY') # checar 
app.static_folder = 'static'

# Variable que simula DOM local storage
# session["loggedIn"] = False

#Pagina web invitado
@app.route("/")
def index():
    return render_template("index.html")

# Inicio (Botton de subir excel y lista de invitados) - Frida Isra 
@app.route(f"{ADMIN}/get_session")
def get_session():
    return render_template("admin_inicio.html")

@app.route(ADMIN)
def admin_index():
    if g.email:
      return redirect(url_for("admin_main"))
    return redirect(url_for("admin_login"))

# login - Frida Isra
@app.route(f"{ADMIN}/login", methods=["GET", "POST"])
def admin_login():
    if g.email:
       return redirect(url_for("admin_main"))
    if request.method == "POST":
      session.pop("email", None)
      email = request.form["email"]
      password = request.form["password"]
      if [email, password] == [config("EMAIL_1"), config("PASSWORD_1")] or [email, password ] == [config("EMAIL_2"), config("PASSWORD_2")]:
        session["loggedIn"] = True
        session["email"] = email
        return redirect(url_for("admin_main"))
      return redirect(url_for("admin_login"))
    else:
      return render_template("admin_login.html")

# Inicio (Botton de subir excel y lista de invitados) - Frida Isra 
@app.route(f"{ADMIN}/inicio")
def admin_main():
    if g.email:
      return render_template("admin_inicio.html")
    return redirect(url_for("admin_index"))

# Inicio (Botton de subir excel y lista de invitados) - Frida Isra 
@app.route(f"{ADMIN}/logout")
def admin_logout():
    session.pop("email", None)
    return redirect(url_for("admin_index"))

@app.before_request
def before_request():
   g.email = None
   if "email" in session:
      g.email = session["email"]


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)