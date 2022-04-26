import axios from "axios";
/**
 * Receber code(string)
 * Recuperar o acess_token no github
 * verificar se o usuario existe no BD
 * ---SIM = Gera um token
 * ---NAO = Cria no bd, gera um token
 * Retornar o token e infos
 */


class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const response = await axios.post(url, null, {
            params: {
                client_id: process.env.GTIHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            Headers: {
                "accept": "application/json"
            }
        })

        return response.data;
    }
}


export { AuthenticateUserService }