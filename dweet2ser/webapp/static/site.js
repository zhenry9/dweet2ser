var socket = io.connect('http://' + document.domain + ':' + location.port);
            
function openMenuBar() {
    document.getElementById("config_button").style.display = "none";
    document.getElementById("config_menu").style.display = "flex";
}

function closeMenuBar() {
    document.getElementById("config_menu").style.display = "none";
    document.getElementById("config_button").style.display = "flex";
    document.getElementById("config_button").style.textAlign = "center";
}

function openTab(evt, tabName) {
    var i, devicetab, tablinks;
    devicetab = document.getElementsByClassName("devices");
    for (i = 0; i < devicetab.length; i++) {
        devicetab[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

$("#console_tab").click(function() {
    var console = document.getElementById("console");
    var current_style = window.getComputedStyle(console).display
    if( current_style == "none"){
        console.style.display = "flex";
        console.scrollTop = console.scrollHeight;
        $("#console_tab").textContent = "Console";
    }
    if(current_style == "flex"){
        console.style.display = "none";
        $("#console_tab").textContent = "^^ Console ^^";
    }
    
});

function saveConfig(){
    socket.emit('save_config')
    alert("Configuration saved to " + config_file)
}

function openForm(id) {
    var elements = document.getElementsByClassName("form-popup");
    var caller = document.getElementById(id)
    var current_style = window.getComputedStyle(caller).display
    for(var i=0; i<elements.length; i=i+1){
        elements[i].style.display = "none";
    }
    if(current_style == "none"){
        caller.style.display = "flex";
    }
}

function closeForm(id) {
    document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
    if (event.target.className == "modal") {
      event.target.style.display = "none";
    }
}

function openAdvancedMenu(id){
    $("#"+id).load(window.location.href = " #"+id+" > *", function(){
        document.getElementById(id).getElementsByClassName("modal")[0].style.display = "flex";
    })
}

function closeAdvancedMenu(id){
    document.getElementById(id).getElementsByClassName("modal")[0].style.display = "none";
}

function submitAdvancedMenu(id){
    var device_data = $("#" + id + " form:eq(0)").serializeArray();
    var translation_data = $("#" + id + " form:eq(1)").serializeArray();
    translation_data = JSON.stringify(translation_data)
    device_data = JSON.stringify(device_data)
    socket.emit('update_translation', id, translation_data);
    socket.emit('update_device', id, device_data);
    closeAdvancedMenu(id);
}

socket.on("console", function(buffer){
    $("#console").text(buffer);
    var element = document.getElementById("console");
    element.scrollTop = element.scrollHeight;
})

socket.on("tape_feed", function(data){
    var tape_cell = document.getElementById(data["target"]).getElementsByClassName("timing_tape")[0];
    tape_cell.textContent = data["buffer"];
    tape_cell.scrollTop = tape_cell.scrollHeight;
})

socket.on("update_online_dot", function(data){
    var dot = document.getElementById(data["target"]).getElementsByClassName("online_dot")[0];
    if (data["online"] == "True") {
        dot.style.backgroundColor = "green";
    }
    else {
        dot.style.backgroundColor = "red";
    }
})

socket.on("update_client_status", function(data){
    var status = document.getElementById("client_status");
    if (data["online"] == "True") {
        status.style.color = "darkgreen";
        status.textContent = "Online";
    }
    else {
        status.style.color = "darkred";
        status.textContent = "Offline";
    }
})