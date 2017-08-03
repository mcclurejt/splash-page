const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

exports.helloWorld = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.send("Hello from Firebase!");
    });
});
