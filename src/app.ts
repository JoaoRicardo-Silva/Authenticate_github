import "dotenv/config";
import * as express from "express";

import { router } from "./services/routes";

const app = express();

app.get("/github", (request, response) => {
    response.redirect(
        'https://github.com/login/oauth/authorize?client_id=bfa20511618d37124f5c');
});

app.get("/signin/callback", (request, response) => {
    const { code } = request.query;

    return response.json(code);
})

app.listen(4000, () => console.log('Server os running on PORT 4000'));
