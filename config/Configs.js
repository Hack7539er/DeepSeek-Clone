export default class Configs {

    static getMongoDBUrl = () => process.env.MONGO_DB_URL;
    static getClerkSigninSecretKey = () => process.env.CLERK_SIGNIN_SECRET_KEY;
    static getDeepSeekAPIKey = () => process.env.DEEPSEEK_API_KEY;
    
}