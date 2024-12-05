import jwt from "jsonwebtoken";
export const generateJwtToken = ({username,role}:any) : string => {
    const options = {expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer:"donedeal_app"};
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        return jwt.sign({username,role},process.env.JWT_SECRET, options);
    } catch (error) {
        console.log(error);
        throw new Error("Error generating JWT toke, see server log for details.")
    }
};