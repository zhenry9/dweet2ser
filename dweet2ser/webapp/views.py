from flask import (Flask, Response, redirect, render_template, request,
                   stream_with_context)

from .. import __version__ as version
from .. import utils
from ..local_device import LocalDevice
from ..remote_device import RemoteDevice
from . import socketing, webapp

current_session = object()

def init(session):
    global current_session
    current_session = session

def stream_template(template_name, **context):
    webapp.update_template_context(context)
    t = webapp.jinja_env.get_template(template_name)
    rv = t.stream(context)
    rv.enable_buffering(5)
    return rv

@webapp.route("/")
def home():
    return render_template(
        "home.html",
        version=version,
        session=current_session,
        ports=utils.get_available_com_ports()
    )

@webapp.route("/add_local", methods=["GET", "POST"])
def add_local():
    if request.method == "POST":
        form = request.form
        mute = False
        if form.get("mute"):
            mute = True

        try:
            dev = LocalDevice(
                form["port"], 
                form["mode"], 
                form["name"], 
                mute=mute, 
                baudrate=form["baud"])
            current_session.bus.add_device(dev)
        except Exception as e:
            socketing.print_to_web_console(f"{utils.timestamp()}Failed to add device: {e}")
    
    return redirect("/")

@webapp.route("/add_remote", methods=["GET", "POST"])
def add_remote():
    if request.method == "POST":
        form = request.form
        mute = False
        if form.get("mute"):
            mute = True

        try:
            dev = RemoteDevice(
                form["thing_id"], 
                form["mode"], 
                name=form["name"], 
                mute=mute, 
                )
            current_session.bus.add_device(dev)
        except Exception as e:
            socketing.print_to_web_console(f"{utils.timestamp()}Failed to add device: {e}")
    
    return redirect("/")
