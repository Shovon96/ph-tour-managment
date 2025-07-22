import cors from 'cors'
import express, { Request, Response } from 'express'
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalError';

const app = express();

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to the tour management server'
    })
})

app.use(globalErrorHandler)

export default app