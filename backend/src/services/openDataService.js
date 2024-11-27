const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/config');

// Cache pour stocker les résultats pendant 1 heure
const cache = new NodeCache({ stdTTL: 3600 });

class OpenDataService {
    constructor() {
        this.educationAPI = axios.create({
            baseURL: 'https://data.education.gouv.fr/api/v2',
            params: {
                apikey: config.API_KEYS.EDUCATION_NATIONALE
            }
        });

        this.sireneAPI = axios.create({
            baseURL: 'https://api.insee.fr/entreprises/sirene/V3',
            headers: {
                'Authorization': `Bearer ${config.API_KEYS.SIRENE}`
            }
        });
    }

    async getEtablissementsScolaires(lat, lng, radius = 1000) {
        const cacheKey = `education_${lat}_${lng}_${radius}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const query = `SELECT * WHERE distance(geo_point_2d, geom'POINT(${lng} ${lat})') < ${radius}`;
            const response = await this.educationAPI.get('/catalog/datasets/fr-en-annuaire-education/records', {
                params: {
                    where: query,
                    limit: 10
                }
            });

            const results = response.data.records.map(record => ({
                type: 'education',
                nom: record.fields.nom_etablissement,
                type_etablissement: record.fields.type_etablissement,
                adresse: record.fields.adresse_1,
                distance: record.fields.distance,
                coordinates: {
                    lat: record.fields.latitude,
                    lng: record.fields.longitude
                }
            }));

            cache.set(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Erreur API Education:', error);
            return [];
        }
    }

    async getCommerces(lat, lng, radius = 1000) {
        const cacheKey = `commerces_${lat}_${lng}_${radius}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.sireneAPI.get('/siret', {
                params: {
                    lat,
                    lng,
                    radius,
                    activitePrincipale: '47' // Code NAF pour le commerce de détail
                }
            });

            const results = response.data.etablissements.map(etab => ({
                type: 'commerce',
                nom: etab.uniteLegale.denominationUniteLegale,
                type_commerce: etab.activitePrincipaleEtablissement,
                adresse: `${etab.adresseEtablissement.numeroVoieEtablissement} ${etab.adresseEtablissement.typeVoieEtablissement} ${etab.adresseEtablissement.libelleVoieEtablissement}`,
                coordinates: {
                    lat: etab.adresseEtablissement.latitude,
                    lng: etab.adresseEtablissement.longitude
                }
            }));

            cache.set(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Erreur API SIRENE:', error);
            return [];
        }
    }

    async getTransports(lat, lng) {
        // Exemple avec l'API NaviTia (transport en commun)
        // Vous devrez adapter selon l'API de transport que vous utilisez
        const cacheKey = `transport_${lat}_${lng}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            // Exemple fictif - à adapter selon votre API
            const response = await axios.get(`https://api.navitia.io/v1/coverage/fr-idf/coords/${lng};${lat}/places_nearby`, {
                headers: {
                    'Authorization': config.API_KEYS.TRANSPORT
                },
                params: {
                    type: ['stop_area', 'stop_point'],
                    distance: 500
                }
            });

            const results = response.data.places_nearby.map(place => ({
                type: 'transport',
                nom: place.name,
                type_transport: place.embedded_type,
                distance: place.distance,
                coordinates: {
                    lat: place.coord.lat,
                    lng: place.coord.lon
                }
            }));

            cache.set(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Erreur API Transport:', error);
            return [];
        }
    }
}

// Ajoutez un rate limiter
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

app.use('/api/', apiLimiter);

module.exports = new OpenDataService();