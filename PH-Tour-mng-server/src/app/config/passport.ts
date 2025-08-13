import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/users/user.model";
import { IsActive, Role } from "../modules/users/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs'
import statusCode from 'http-status-codes'

// For User Login Creadential
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email })
            if (!isUserExist) {
                return done(null, false, { message: "User dose not exist!" })
            }

            if (!isUserExist.isVerified) {
                return done(null, false, { message: "This user are not verified!" })
            }

            if (isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED) {
                return done(null, false, { message: `This use is ${isUserExist.isActive}` })
            }

            if (isUserExist.isDeleted) {
                return done(null, false, { message: "This user already deleted!" })
            }

            const isGoogleAuthentic = isUserExist.auth.some(providerObject => providerObject.provider === "google")
            if (isGoogleAuthentic && !isUserExist.password) {
                return done(null, false, { message: "You are authenticated by Google!" })
            }

            const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
            if (!isPasswordMatched) {
                return done(null, false, { message: "Password dose not matched!!" })
            }

            return done(null, isUserExist)
        } catch (error) {
            done(error)
        }
    })
)

// For Google authentication
passport.use(
    new GoogleStrategy({
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        clientID: envVars.GOOGLE_CLIENT_ID,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) {
                return done(null, false, { message: "No Email Found" })
            }

            let user = await User.findOne({ email })

            if (user && !user.isVerified) {
                return done(null, false, { message: "This user are not verified!" })
            }

            if (user && (user.isActive === IsActive.INACTIVE || user.isActive === IsActive.BLOCKED)) {
                return done(null, false, { message: `This use is ${user.isActive}` })
            }

            if (user && user.isDeleted) {
                return done(null, false, { message: "This user already deleted!" })
            }

            if (!user) {
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


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        done(error)
    }
})