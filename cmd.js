
let cmd = function () { //_namespace
    /*
    function list_functions() {
        var temp_func = [];
        for (var l in this) {
            if (this.hasOwnProperty(l) && this[l] instanceof Function && !/temp_func/i.test(l)) {
                temp_func.push(this[l]);
            }
        }
        return temp_func;
    }*/

    let env = {"errorlevel": 0};

    function echo(s) {
        console.log("cmd: " + s);

        var cmdline_last = document.getElementById("cmdline_last");

        cmdline_last.readOnly = true; //Makes it readonly
        cmdline_last.value = s;
        cmdline_last.removeAttribute("id"); //Removes "cmdline_last" id

        document.getElementById("cmd-text").appendChild(cmdline_last); //Moves element to div

        document.getElementById("cmd-box").innerHTML += lastline_cmd_element; //Adds new last line

        return 0;
    }

    function exit(args = []) {

        return 0;
    }

    function cls(args = []) {

        return 0;
    }
    
    function set(args = []) {
        if (args.length === 0){
            var env_keys = Object.keys(env);
            var env_values = Object.values(env);
            for (var i in env_keys){
                echo(env_keys[i] + '=' + env_values[i]);
            }
            return 0;
        }else {

        }
    }

    return {
        /*list_functions: list_functions,*/
        echo: echo,
        exit: exit,
        cls: cls
    };
}();

//let cmd_function_list = cmd_namespace.list_functions();