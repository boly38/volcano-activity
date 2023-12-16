export default class AuthService {
    constructor() {
        this.moderatorToken = process.env.VOL_MODERATOR_TOKEN;
    }

    authModerator(token) {
        return this.moderatorToken === token;
    }
}