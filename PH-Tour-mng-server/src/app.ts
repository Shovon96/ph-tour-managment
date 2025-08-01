import cors from 'cors'
import express, { Request, Response } from 'express'
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalError';
import notFound from './app/middlewares/notFound.route';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from 'express-session'
import { envVars } from './app/config/env';

const app = express();

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
     resave: false,
     saveUninitialized: false
}))

// Routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to the tour management server'
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app