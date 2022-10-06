import express from 'express'

import api_v1 from './v1'

const api = express.Router()

api.use('/v1', api_v1)

export default api
