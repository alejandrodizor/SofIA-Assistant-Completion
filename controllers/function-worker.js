
function worker(function_name, args) {
    console.log('worker', function_name, args);
}

module.exports = { worker };