import cors from 'cors'
import express, { Request, Response } from 'express'
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalError';
import notFound from './app/middlewares/notFound.route';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

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