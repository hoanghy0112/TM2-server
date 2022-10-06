import express from 'express'

export function authorizeRouteMiddleware(req, res, next) {
	if (!req.user) {
		return res.status(401).send('Unauthorized')
	}

	next()
}
