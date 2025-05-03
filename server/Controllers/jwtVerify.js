

class checkJwt {
    async getRequest(req, res) {
        res.status(200).send({ username: req.userDetails.username, email: req.userDetails.email, uuid: req.userDetails.uuid });
    }
}

module.exports = checkJwt;