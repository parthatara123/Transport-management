
class Locals {
    static config() {
       const port = parseInt(process.env.PORT) || 8000;
       const secret = process.env.SESSION_SECRET || "Sefnelanvliehvz";
       const mongooseUrl = process.env.MONGODB_URI || "mongodb+srv://parthatara:Complex.123@cluster0.zkrq5.mongodb.net/Project-internship?retryWrites=true&w=majority";
       const ttl = parseInt(process.env.TTL) || 172800;
       const jwtExpiration = parseInt(process.env.JWT_EXPIRATION) || 3600;
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