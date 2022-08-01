
/*
* @author Parth Atara
* @description : config file for the application
*/
class Locals {
    static config() {
       const port = parseInt(process.env.PORT) || 3000;
       const secret = process.env.SECRET || "lkfhur3286eoaonc75420a";
       const mongooseUrl = process.env.MONGOOSE_URI || "mongodb+srv://parthatara:Complex.123@cluster0.zkrq5.mongodb.net/Neosoft-Assignment?retryWrites=true&w=majority";
       const ttl = parseInt(process.env.TTL) || 172800;
       const jwtExpiration = parseInt(process.env.JWT_EXPIRY) || 3600;
       const jwtSecret = process.env.JWT_SECRET || "Secreatafcnloiwfhlasnbv";

       return {
        port,
        secret,
        mongooseUrl,
        ttl,
        jwtExpiration,
        jwtSecret};
    };
}

export default Locals;