import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/users/user.model";
import { Role } from "../modules/users/user.interface";

passport.use(
    new GoogleStrategy({
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        clientID: envVars.GOOGLE_CLIENT_ID,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null, false, {message: "No Email Found"})
            }

            let user = await User.findOne({email})
            if(!user){
                user = await User.create({
                    email,
                    name: profile.displayName,
                    photo: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auth: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    })
)