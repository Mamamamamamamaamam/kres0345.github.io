var doubleclick_interval = 500; //Windows standard according to https://ux.stackexchange.com/a/40366
var gridWidth = 8;
var gridHeight = 4;
var gridicons = {
    0: {
        "type": "shortcut",
        "launch": "",
        "name": "Recycle bin",
        "icon": "resources/Windows-icons/recycle_bin.ico"
    },
    3: {
        "type": "shortcut",
        "launch": "taskmanager.start_application('cmd')",
        "icon": "resources/Windows-icons/cmd.ico",
        "name": "Command Prompt"
    },
    2: {
        "type": "shortcut",
        "launch": "taskmanager.start_application('notepad')",
        "icon": "resources/Windows-icons/notepad.ico",
        "name": "Notepad"
    }
};
var doubleclick_pending = false;
var desktop = function () {
    var icon_array = [];
    function generate_shortcut(icon_href, icon_text, icon_launch, index) {
        return "<div ondrop=\"desktop_drop(event)\" ondragover=\"desktop_dragOver(event)\" class=\"icon-parent\"><div class=\"space desktop-icon\" data-index=\"" + index + "\" data-launch=\"" + icon_launch + "\" onclick=\"icon_click(this)\" draggable=\"true\" ondragstart=\"desktop_dragStart(event)\"><img class=\"desktop-icon-image\" src=\"" + icon_href + "\"><p class=\"desktop-icon-text\">" + icon_text + "</p></div></div>";
    }
    function empty_icon(index) {
        return "<div ondrop=\"desktop_drop(event)\" ondragover=\"desktop_dragOver(event)\" class=\"icon-parent\"><div class=\"space\" data-index=\"" + index + "\"></div></div>";
    }
    function refresh_desktop() {
        // @ts-ignore
        var desktop_directory = filesystem.get_directory("C:\\Users\\kress\\desktop");
        var icons = [];
        document.getElementById("desktop").innerHTML = "";
        for (var i = 0; i < gridHeight * gridWidth; i++) {
            var current_icon = gridicons[i];
            if (current_icon === undefined) {
                document.getElementById("desktop").innerHTML += empty_icon(i);
            }
            else if (current_icon["type"] === "shortcut") {
                document.getElementById("desktop").innerHTML += generate_shortcut(current_icon["icon"], current_icon["name"], current_icon["launch"], i);
            }
        }
    }
    return {
        refresh_desktop: refresh_desktop
    };
}();
function icon_click(element) {
    if (doubleclick_pending) {
        eval(element.dataset.launch);
        doubleclick_pending = false;
    }
    doubleclick_pending = true;
    doubleclick_timer_start();
}
// @ts-ignore
var doubleclick_timer_start = _.debounce(function () {
    doubleclick_pending = false;
}, doubleclick_interval);
var selectionProperties = {
    selected_icons: [],
    keyboardSelectionIndex: 0
};
function update_selected_icons() {
    var iconList = document.getElementsByClassName("desktop-icon");
    for (var i = 0; i < iconList.length; i++) {
        if (selectionProperties.selected_icons.indexOf(i) !== -1) {
            iconList[i].classList.add("selected");
        }
        else {
            try {
                iconList[i].classList.remove("selected");
            }
            catch (e) { }
        }
    }
}
function desktop_click(e) {
    var objectDiv;
    switch (e.target.tagName) {
        case "IMG":
            objectDiv = e.target.parentElement;
            break;
        case "P":
            objectDiv = e.target.parentElement;
            break;
        case "DIV":
            objectDiv = e.target;
            break;
        default:
            selectionProperties.selected_icons = [];
    }
    if (objectDiv.getAttribute("class") === "desktop-icon") {
        var iconList = document.getElementsByClassName("desktop-icon");
        for (var i = 0; i < iconList.length; i++) {
            if (iconList[i] === objectDiv && selectionProperties.selected_icons.indexOf(i) === -1) {
                if (e.ctrlKey || e.shiftKey) {
                    selectionProperties.selected_icons.push(i);
                }
                else {
                    selectionProperties.selected_icons = [i];
                }
            }
        }
    }
    else {
        selectionProperties.selected_icons = [];
    }
    update_selected_icons();
}
function desktop_dragStart(e) {
    var targetElement = e.target;
    if (!targetElement.classList.contains("space")) {
        if (targetElement.classList.contains("icon-parent")) {
            targetElement = targetElement.children[0];
        }
        else {
            targetElement = targetElement.parentElement;
        }
    }
    draggingIndex = parseInt(targetElement.dataset.index);
}
var draggingIndex = 0;
function desktop_drop(e) {
    e.preventDefault();
    var targetElement = e.target;
    if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === "file") {
                var file = e.dataTransfer.items[i].getAsFile();
                // @ts-ignore
                filesystem.make_file("C:\\Users\\kress\\desktop", file.name, file, file.text);
            }
        }
    }
    var fromIndex = draggingIndex;
    if (!targetElement.classList.contains("space")) {
        if (targetElement.classList.contains("icon-parent")) {
            targetElement = targetElement.children[0];
        }
        else {
            targetElement = targetElement.parentElement;
        }
    }
    var toIndex = parseInt(targetElement.dataset.index);
    if (targetElement.classList.contains("desktop-icon")) { // Not empty
        // Launch icon with dragged icon as parameter to mimic default windows behavior.
    }
    else {
        var tempObj = gridicons[fromIndex];
        gridicons[fromIndex] = gridicons[toIndex];
        gridicons[toIndex] = tempObj;
        desktop.refresh_desktop();
    }
    console.log(e);
}
function desktop_dragOver(e) {
    e.preventDefault();
}
function desktop_keydown(e) {
    var iconList = document.getElementsByClassName("desktop-icon");
    if (e.srcElement === document.body) {
        var lastIndex = selectionProperties.keyboardSelectionIndex;
        switch (e.code) {
            case "ArrowUp":
                //selection = index - width
                selectionProperties.keyboardSelectionIndex -= gridWidth;
                if (selectionProperties.keyboardSelectionIndex < 0) {
                    selectionProperties.keyboardSelectionIndex += gridWidth;
                }
                if (e.shiftKey) {
                    //selectionProperties.selected_icons = [... range(lastIndex, dawdwa)]
                }
                else {
                    selectionProperties.selected_icons = [selectionProperties.keyboardSelectionIndex];
                }
                break;
            case "ArrowDown":
                //selection = index + width
                selectionProperties.keyboardSelectionIndex += gridWidth;
                if (selectionProperties.keyboardSelectionIndex >= gridWidth * gridHeight) {
                    selectionProperties.keyboardSelectionIndex -= gridWidth;
                }
                break;
            case "ArrowLeft":
                //selection = index - 1
                selectionProperties.keyboardSelectionIndex -= 1;
                if (selectionProperties.keyboardSelectionIndex < 0) {
                    selectionProperties.keyboardSelectionIndex += 1;
                }
                break;
            case "ArrowRight":
                //selection = index + 1
                selectionProperties.keyboardSelectionIndex += 1;
                if (selectionProperties.keyboardSelectionIndex >= gridWidth * gridHeight) {
                    selectionProperties.keyboardSelectionIndex -= 1;
                }
                break;
            case "Enter":
                for (var i = 0; i < selectionProperties.selected_icons.length; i++) {
                    eval(iconList[selectionProperties.selected_icons[i]].dataset.launch);
                }
                break;
        }
    }
}
document.getElementById("desktop").addEventListener("click", desktop_click);
document.addEventListener("keydown", desktop_keydown);
/*
function doubleclick_timer() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 500);
    });
}

async function doubleclick_timer_start() {
    var result = await doubleclick_timer();
    console.log(result);
}*/ 
