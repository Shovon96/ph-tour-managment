import cors from 'cors'
import express, { Request, Response } from 'express'
import { router } from './app/routes';

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

export default app