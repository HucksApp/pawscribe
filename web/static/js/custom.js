document.addEventListener("DOMContentLoaded", function() {
    var editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
        lineNumbers: true,
        mode: "python", // Default mode
        theme: "default"
    });

    document.querySelector('select[name="file_type"]').addEventListener('change', function() {
        var mode = "python"; // Default mode
        switch (this.value) {
            case 'py': mode = "python"; break;
            case 'js': mode = "javascript"; break;
            case 'c': mode = "text/x-csrc"; break;
            case 'html': mode = "xml"; break;
            case 'css': mode = "css"; break;
        }
        editor.setOption("mode", mode);
    });