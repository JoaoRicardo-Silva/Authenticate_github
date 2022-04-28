import axios from "../../node_modules/axios/index";
import prismaClient from "../prisma/index";
import { sign} from "jsonwebtoken"
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

        const { login, id, avatar_url, name} = response.data;

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if(!user){
           user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        },
        process.env.JNT_SECRET,
        {
            subject: user.id,
            expiresIn: "1d"
        }
        )

        return {token, user};
    }
}


export { AuthenticateUserService }