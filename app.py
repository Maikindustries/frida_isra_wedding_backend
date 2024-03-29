from decouple import config  # read env vars
from MySqlConnection import ConnectionFactory
from flask import (
    Flask,
    session,
    render_template,
    redirect,
    request,
    url_for,
    g,
)
# CORS
from flask_cors import CORS

ADMIN = "/admin"

app = Flask(__name__)
# CORS, srive para que pueda usar un backend local
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = config("WEB_KEY")  # checar
app.static_folder = "static"


# Pagina web invitado sin id
@app.route("/")
def index():
    return render_template("index.html")

# GET_INFO_BY_ID - BACKEND # no borrar
@app.route("/guest/updateConfirmation", methods=["POST"])
def post_update_confirmation():
    response = request.json
    print(response)
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    guest_id = response.get("id")
    confirmacion = response.get("confirmacion")
    cursor.execute(
        "update invitados1 set asistencia = %s where id_invitado = %s",
        [confirmacion, guest_id]
    )
    conn.commit()
    conn.close()
    return {"Success": 201}

# GET_INFO_BY_ID - BACKEND # no borrar
@app.route("/guest/<guest_id>", methods=["GET"])
def get_info_by_id(guest_id):
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    cursor.execute(
        "select * from invitados1 where id_invitado = %s",
        [guest_id]
    )
    invitado = cursor.fetchone()
    invitado_dict = dict()
    keys = [
        "id_invitado",
        "nombre",
        "mesa",
        "asistencia"
    ]
    for i, key in enumerate(keys):
        invitado_dict[key] = invitado[i]
    print(invitado_dict)
    conn.close()
    return invitado_dict

# Ver invitados seguro- App # no borrar
@app.route("/verinvitados")
def admin_without_password():
    return render_template("admin_inicio_safe.html")

# Mesa de regalos - App # no borrar
@app.route("/mesa-de-regalos")
def mesa_de_regalos():
    return render_template("mesa_de_regalos.html")

# /ADMIN - App # no borrar
@app.route(ADMIN)
def admin_index():
    if g.email:
        return redirect(url_for("admin_main"))
    return redirect(url_for("admin_login"))


# LOGIN - App # no borrar
@app.route(f"{ADMIN}/login", methods=["GET", "POST"])
def admin_login():
    if g.email:
        return redirect(url_for("admin_main"))
    if request.method == "POST":
        session.pop("email", None)
        email = request.form["email"]
        password = request.form["password"]
        if [email, password] == [config("EMAIL_1"), config("PASSWORD_1")] or [
            email,
            password,
        ] == [config("EMAIL_2"), config("PASSWORD_2")]:
            session["email"] = email
            return redirect(url_for("admin_main"))
    return render_template("admin_login.html")


# INICIO - App # no borrar
@app.route(f"{ADMIN}/inicio", methods=["GET", "POST"])
def admin_main():
    if g.email:
        return render_template("admin_inicio.html")
    return render_template("admin_login.html")

# EXCEL - Webpage # no borrar
@app.route(f"{ADMIN}/excel", methods=["GET", "POST"])
def read_process_excel():
    # Read the File using Flask request
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    file = request.files["uploaded-file"]
    if file.filename != "":
        # save file in local directory
        file.save(file.filename)
        invitados = pd.read_excel(file)
        invitados_list = []
        for _, row in invitados.iterrows():
            invitados_list.append(
                [row["Nombre"], int(row["Mesa"]), int(row["Celular"])]
            )
        cursor.executemany(
            """
            insert into invitados1 (nombre, celular, mesa)
            values(%s, %s, %s)
            """,
            invitados_list,
        )
        conn.commit()
        conn.close()
    return redirect(url_for("admin_main"))

# GET_USERS - BACKEND # no borrar
@app.route(f"{ADMIN}/get_users", methods=["GET", "POST"])
def get_users():
    # MySql Database
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    cursor.execute("select * from invitados1 order by nombre")
    invitados = cursor.fetchall()
    conn.close()
    data = []
    for invitado in invitados:
        invitado_dict = dict()
        keys = [
            "id_invitado",
            "nombre",
            "mesa",
            "asistencia"
        ]
        for i, key in enumerate(keys):
            invitado_dict[key] = invitado[i]
        data.append(invitado_dict)
    return data


# DELETE - BACKEND # no borrar
@app.route(f"{ADMIN}/delete", methods=["GET", "POST"])
def delete_user():
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    response = request.json
    if response.get("id_invitado", None) == None:
        return {"status": "fail"}

    cursor.execute(
        "delete from invitados1 where id_invitado = %s",
        [response["id_invitado"]],
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}

# UPDATE - BACKEND # no borrar
@app.route(f"{ADMIN}/update2", methods=["GET", "POST"])
def update_users2():
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()

    sqls = []
    response = request.json
    if response.get("guestName", None):
        sqls.append(f"nombre='{response['guestName']}'")
    if response.get("tableNumber", None):
        sqls.append(f"mesa={response['tableNumber']}")
    update_sql = "update invitados1 set "
    update_sql += ", ".join(sqls)
    update_sql += f" where id_invitado='{response['idInvitado']}'"
    print(update_sql)
    try:
        cursor.execute(update_sql)
        conn.commit()
        conn.close()
        return {"status": "ok"}
    except:
        return {"status": "fail"}

# UPDATE - BACKEND # no borrar
@app.route(f"{ADMIN}/update", methods=["POST"])
def update_users():
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    response = request.json
    print(response.get("updateSql", None))
    if response.get("updateSql", None):
        cursor.execute(response["updateSql"])
        conn.commit()
        conn.close()
        return {"status": "ok"}
    return {"status": "fail"}

# GET_NUMBERS - BACKEND # no borrar
@app.route(f"{ADMIN}/get_numbers", methods=["GET"])
def get_numbers():
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    asistencias = ["confirmada", "no confirmada", "no vendra", "no revisada"]
    data = {"confirmada": 0, "no confirmada":0 , "no vendra": 0}
    for asistencia in asistencias:
        cursor.execute(
            "select count(*) from invitados1 where asistencia = %s",
            [asistencia],
        )
        res = cursor.fetchone()
        if asistencia == "no revisada":
            data["no confirmada"] += res[0]
        elif asistencia != "no revisada":
            data[asistencia] = res[0]
    conn.close()
    return data

# Insert guest - BACKEND # no borrar
@app.route(f"{ADMIN}/insert_guest", methods=["POST"])
def insert_guest():
    conn_factory = ConnectionFactory()
    conn, cursor = conn_factory.get_connection()
    data = request.json

    name = data["name"]
    phone = data["phone"]
    try:
        if phone != "":
            phone = int(phone)
        else:
            phone = -1

    except ValueError as err:
        print("Phone:", err)
        phone = -1
    
    table = data["table"]
    try:
        if table != "":
            table = int(table)
        else:
            table = -1

    except ValueError as err:
        print("Table:", err)
        table = -1
        
    # num_guests = data["numGuests"]
    # try:
    #     if num_guests != "":
    #         num_guests = int(num_guests)
    #     else:
    #         num_guests = -1

    # except ValueError as err:
    #     print("Num guests:", err)
    #     num_guests = -1

    try:
        cursor.execute(
            """
            insert into invitados1
            (nombre, celular, mesa)
            values( %s, %s, %s)
            """,
            [name, phone, table],
        )
        conn.commit()
        conn.close()
        return {"Success": True}
    except Exception as err:
        print(err)
    return {"Success": False}

# LOGOUT - App # no borrar
@app.route(f"{ADMIN}/logout")
def admin_logout():
    session.pop("email", None)
    return redirect(url_for("admin_index"))

# Keep Login - App
@app.before_request
def before_request():
    g.email = None
    if "email" in session:
        g.email = session["email"]


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
