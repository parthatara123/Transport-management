import express from 'express'
import session from 'express-session'
import * as dotenv from 'dotenv';
import MongoStore from "connect-mongo";
import createError from 'http-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import multer from 'multer'
import locals from './config/config.js';
import Database from '../src/db/db.js';
import userRouter from '../src/routes/userRoute.js';
import orderRouter from '../src/routes/orderRoute.js';
import checklistRouter from '../src/routes/checklistRoute.js';

dotenv.config()
//App Initialization 
const app = express()

const port = process.env.PORT || 3000

// app.set('port', port)
app.use(helmet());
app.use(morgan('dev'));
app.use(multer().any())

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        maxAge: 2 * 24 * 60 * 60 * 1000,
    },
    store:  MongoStore.create({
        mongoUrl : process.env.MONGOOSE_URI,
        ttl: locals.config().ttl
    })
}));


//Global middleware for data parsing
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//connecting database
Database.init();

// diverting incoming request to router
app.use('/user', userRouter)
app.use('/order', orderRouter)
app.use('/checklist', checklistRouter)

// checking invalid route
app.use(async (req, res, next) => {
    next(createError.NotFound('This route does not exits'))
})

// Initializing error-handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({status: err.status || 500, msg: err.message})
})


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

export default app
