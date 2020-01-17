const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
module.exports = {
    async index(request, response) {
        //Buscar todos os devs num raio de 10Km
        //Filtrar por tecnologia
        console.log(request.query);
        const { techs, latitude, longitude } = request.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }

        })

        //console.log(techsArray);
        return response.json({ devs });
    }
}