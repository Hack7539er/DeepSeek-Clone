export default class Configs {
    static getMongoDBUrl = () => process.env.MONGO_DB_URL;
    static getClerkSigninSecretKey = () => process.env.CLERK_SIGNIN_SECRET_KEY;
    static getAIProvider = () => {
        if (
            process.env.DEEPSEEK_API_KEY === null ||
            process.env.DEEPSEEK_API_KEY === undefined ||
            process.env.DEEPSEEK_API_KEY === ""
        ) {
            if (
                process.env.GEMINI_API_KEY === null ||
                process.env.GEMINI_API_KEY === undefined ||
                process.env.GEMINI_API_KEY === ""
            ) {
                console.log(
                    "Error: The AI Provider Key Not Found In Enviorment Variable : DEEPSEEK_API_KEY or GEMINI_API_KEY Add 1 Key",
                );
                process.exit(404);
            } else return process.env.GEMINI_API_KEY;
        } else return process.env.DEEPSEEK_API_KEY;
    };
}
