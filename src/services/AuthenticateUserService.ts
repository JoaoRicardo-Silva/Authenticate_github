import axios from "../../node_modules/axios/index";
/**
 * Receber code(string)
 * Recuperar o acess_token no github
 * Recuperar infos do user no github
 * verificar se o usuario existe no BD
 * ---SIM = Gera um token
 * ---NAO = Cria no bd, gera um token
 * Retornar o token e infos
 */

interface IAccessTokenReponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: IAccessTokenReponse } = await axios.post<IAccessTokenReponse>(url, null, {
            params: {
                client_id: process.env.GTIHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "accept": "application/json"
            },
        });

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: 'Bearer ${accessTokenResponse.access_token}'
            }
        })

        return response.data;
    }
}


export { AuthenticateUserService }