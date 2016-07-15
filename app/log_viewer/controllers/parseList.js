'use strict';

function returnNode(splitPath, tree, fullFilePath) {
    if (splitPath[0] !== undefined) {
        if (splitPath[0] !== '') {
            var node = splitPath[0];
            var match = false;
            var index = 0;
            for (var i in tree) {
                if (tree[i].roleName === node) {
                    match = true;
                    index = i;
                    break;
                }
            }
            if (!match) {
                var object = {};
                object.roleName = node;
                object.roleId = node;
                if (splitPath.length === 1) {
                    object.fullPath = fullFilePath;
                }
                object.children = [];
                tree.push(object);
                index = tree.length - 1;
            }
            splitPath.shift();
            returnNode(splitPath, tree[index].children, fullFilePath);
        } else {
            splitPath.shift();
            returnNode(splitPath, tree, fullFilePath);
        }
    }
}
export default function parseList(tree, data) {
    var files = data.split('\n');
    for (var i in files) {
        var file = files[i];
        var splitPath = file.split('/');
        returnNode(splitPath, tree, file);
    }
}
