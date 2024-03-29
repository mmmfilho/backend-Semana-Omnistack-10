const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');


module.exports = {
    //Atualizar
    async update() {

    },

    //Delete
    async destroy() {

    },

    //Lista
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    //Insert
    async store(request, response) {
        console.log(request.body);
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const resp = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = resp.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };


            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            //Filtrar Conexões que estão no maximo 10 km de distancia e que tenha pelo menos uma das techs
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            console.log('socketMessageTO'+sendSocketMessageTo);
        }
        return response.json(dev);
    }
}