import express from 'express'

import v1API from './v1'
import v2API from './v2'

const api = express.Router()

api.use('/v1', v1API)
api.use('/v2', v2API)

export default api
