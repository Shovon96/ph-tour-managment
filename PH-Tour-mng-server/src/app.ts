import cors from 'cors'
import express, { Request, Response } from 'express'
import { UserRouters } from './app/modules/users/user.routers';

const app = express();

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/v1/user', UserRouters)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to the tour management server'
    })
})

export default app