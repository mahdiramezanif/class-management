from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import delete
from sqlalchemy.orm import Session
from DataBase import get_db, Base, engine, user, note, UserBaseModel, NoteBaseModel, QueryModel
from ManagerBase import UserActionModel
from fastapi.middleware.cors import CORSMiddleware
import http

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)

def create_user(db: Session, userbase: UserBaseModel):
    new_user = user()
    new_user.name = userbase.name # type: ignore
    new_user.password = userbase.password # type: ignore
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

@app.post("/user/report")
async def report(query: QueryModel, db: Session = Depends(get_db)):
    try:
        if query.message == '' and query.good != -1:
            result = (
                db.query(note)
                .filter(
                    note.name == query.name,
                    note.good == query.good,
                    note.data >= query.start,
                    note.data <= query.end,
                ).all()
            )
        elif query.good == -1 and query.message != '':
            result = (
                db.query(note)
                .filter(
                    note.name == query.name,
                    note.message == query.message,
                    note.data >= query.start,
                    note.data <= query.end,
                ).all()
            )
        elif query.good == -1 and query.message == '':
            result = (
                db.query(note)
                .filter(note.name == query.name, note.data >= query.start, note.data <= query.end)
                .all()
            )
        else:
            result = (
                db.query(note)
                .filter(
                    note.message == query.message,
                    note.name == query.name,
                    note.good == query.good,
                    note.data >= query.start,
                    note.data <= query.end,
                ).all()
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/user/notation")
async def funcnote(mynote: NoteBaseModel, db: Session = Depends(get_db)):
    try:
        new_note = note(message=mynote.message, good=mynote.good, data=mynote.data, name=mynote.name)
        db.add(new_note)
        db.commit()
        return{"mes": "null"} # type: ignore
    except:
        return{"mes": "error"} # type: ignore


@app.get("/manager/GetAllUsers")
async def getAllUsers(db: Session = Depends(get_db)):
    users = db.query(user).all()
    if users:
        return users
    else:
        return {"There Is No Users In Your Website"}



@app.post("/login")
async def login(userbasre: UserBaseModel, db: Session = Depends(get_db)):
    if userbasre.name == "null" and userbasre.password == "null":
        return {"mes": "fill the blanks"}

    if userbasre.name == "manager" :
        if userbasre.password=="14034":
          return {"mes": "Welcome To Manager Part :) "}
        return {"mes": "manager part password is incorrect"}



    loged_user = db.query(user).filter(user.name == userbasre.name).first()
    if loged_user:
        if loged_user.password == userbasre.password: # type: ignore
            return {"mes": "null"}
        return {"mes": "This username exist with different password"}
    create_user(db, userbasre)
    return {"mes": "null"}


@app.post("/manager")
async def manager(managerbase: UserActionModel, db: Session = Depends(get_db)):
    if managerbase.username == "":
        return {"mes": "Please fill name field "}
    if managerbase.dateS != "1000-01-01":
        if managerbase.dateE != "9000-01-01":
            if managerbase.dateE == managerbase.dateS:
                if managerbase.message == "":
                    if managerbase.good == -1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.dateS == note.data)).all() # type: ignore

                        for tsk in tasks:
                            db.delete(tsk)
                            db.commit()
                        return {"mes": "null"}
                    elif managerbase.good == 0 or 1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.good == note.good)).all() # type: ignore
                        for tsk in tasks:
                            db.delete(tsk)
                            db.commit()
                        return {"mes": "null"}
                    else:
                        return {"Something error"}

                elif managerbase.message != "":
                    if managerbase.good == -1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.message == note.message)).all() # type: ignore
                        for tsk in tasks:
                            db.delete(tsk)
                            db.commit()
                        return {"mes": "null"}
                    elif managerbase.good == 0 or 1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.good == note.good) & (
                                    managerbase.message == note.message)).all() # type: ignore
                        for tsk in tasks:
                            db.delete(tsk)
                            db.commit()
                        return {"mes": "null"}

            if managerbase.message == "":
                if managerbase.good == -1:
                    tasks = db.query(note).filter(note.data.between(managerbase.dateS, managerbase.dateE) & (
                            managerbase.username == note.name)).all()
                    for tsk in tasks:
                        db.delete(tsk)
                        db.commit()
                    return {"mes": "null"}
                elif managerbase.good == 0 or 1:
                    tasks = db.query(note).filter(
                        (managerbase.username == note.name) & note.data.between(managerbase.dateS,
                                                                                managerbase.dateE) & ( # type: ignore
                                managerbase.good == note.good)).all()
                    for tsk in tasks:
                        db.delete(tsk)
                        db.commit()
                    return {"mes": "null"}


            elif managerbase.message != "":
                if managerbase.good == -1:
                    tasks = db.query(note).filter(
                        (managerbase.username == note.name) & (managerbase.message == note.message) & note.data.between(
                            managerbase.dateS, managerbase.dateE)).all() # type: ignore
                    for tsk in tasks:
                        db.delete(tsk)
                        db.commit()
                    return {"mes": "null"}
                elif managerbase.good == 0 or 1:
                    tasks = db.query(note).filter(
                        (managerbase.username == note.name) & (managerbase.good == note.good) & (
                                managerbase.message == note.message) & note.data.between(managerbase.dateS,
                                                                                         managerbase.dateE)).all() # type: ignore
                    for tsk in tasks:
                        db.delete(tsk)
                        db.commit()
                    return {"mes": "null"}

        if managerbase.message == "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (note.data > managerbase.dateS) & (managerbase.username == note.name)).all()
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (note.data > managerbase.dateS) & ( # type: ignore
                            managerbase.good == note.good)).all()
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
        elif managerbase.message != "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.message == note.message) & (
                            note.data > managerbase.dateS)).all() # type: ignore
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.good == note.good) & (
                            managerbase.message == note.message) & (note.data > managerbase.dateS)).all() # type: ignore
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}

    if managerbase.dateE != "9000-01-01":
        if managerbase.message == "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (note.data < managerbase.dateE) & (managerbase.username == note.name)).all()
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (note.data < managerbase.dateE) & ( # type: ignore
                            managerbase.good == note.good)).all()
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
        elif managerbase.message != "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.message == note.message) & (
                            note.data < managerbase.dateE)).all() # type: ignore
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.good == note.good) & (
                            managerbase.message == note.message) & (note.data < managerbase.dateE)).all() # type: ignore
                for tsk in tasks:
                    db.delete(tsk)
                    db.commit()
                return {"mes": "null"}

    # Next Part...

    if managerbase.start != "1000-01-01":
        if managerbase.end != "9000-01-01":
            if managerbase.start == managerbase.end:

                if managerbase.message == "":
                    if managerbase.good == -1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.start == note.data)).all() # type: ignore
                        return tasks
                    elif managerbase.good == 0 or 1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.good == note.good) & (
                                    managerbase.start == note.data)).all() # type: ignore
                        return tasks
                    else:
                        return {"Something error"}

                elif managerbase.message != "":
                    if managerbase.good == -1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.message == note.message) & (
                                    managerbase.start == note.data)).all() # type: ignore
                        return tasks
                    elif managerbase.good == 0 or 1:
                        tasks = db.query(note).filter(
                            (managerbase.username == note.name) & (managerbase.good == note.good) & (
                                    managerbase.message == note.message) & (managerbase.start == note.data)).all() # type: ignore
                        return tasks

        if managerbase.message == "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (note.data > managerbase.start) & (managerbase.username == note.name)).all()
                return tasks
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (note.data > managerbase.start) & ( # type: ignore
                            managerbase.good == note.good)).all()
                return tasks
        elif managerbase.message != "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.message == note.message) & (
                            note.data > managerbase.start)).all() # type: ignore
                return tasks
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.good == note.good) & (
                            managerbase.message == note.message) & (note.data > managerbase.start)).all() # type: ignore
                return tasks
    if managerbase.end != "9000-01-01":
        if managerbase.message == "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (note.data > managerbase.end) & (managerbase.username == note.name)).all()
                return tasks
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (note.data < managerbase.end) & ( # type: ignore
                            managerbase.good == note.good)).all()
                return tasks
        elif managerbase.message != "":
            if managerbase.good == -1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.message == note.message) & (
                            note.data < managerbase.end)).all() # type: ignore
                return tasks
            elif managerbase.good == 0 or 1:
                tasks = db.query(note).filter(
                    (managerbase.username == note.name) & (managerbase.good == note.good) & (
                            managerbase.message == note.message) & (note.data < managerbase.end)).all() # type: ignore
                return tasks
