const Response = require('../../services/response');
const { tokenHandler } = require('../../services/authentication');
const blacklistedTokensCache = require('../../services/blacklistedTokensCache');

const {
    MissingAuthException,
    InvalidAuthException,
} = require('../../services/error');

module.exports = (req, res, next) => {
    const response = new Response(res);

    if (req.headers && req.headers.authorization) {
        let authParts = req.headers.authorization.split(' ');
        if (authParts.length === 2) {
            let scheme = authParts[0];
            let token = authParts[1];

            if (!/^Bearer$/i.test(scheme)) {
                response.error(new InvalidAuthException());
                return response.send();
            }

            try {
                const tokenData = tokenHandler.validateAccessToken(token);
                const bannedToken = blacklistedTokensCache.get({ jti: tokenData.jti });

                if (bannedToken) {
                    response.error(new InvalidAuthException());
                    return response.send();
                }

                req.user = tokenData;
                return next();
            } catch (err) {
                response.error(err);
                return response.send();
            }
        } else {
            response.error(new InvalidAuthException());
            return response.send();
        }
    } else {
        response.error(new MissingAuthException());
        return response.send();
    }
};
