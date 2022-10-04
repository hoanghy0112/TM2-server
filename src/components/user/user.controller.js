import { getAllGivenName, getUserInfo, updateUserInfo } from './user.model'

export async function httpGetUserInfo(req, res) {
	if (req.user) {
		return res.status(200).json({
         ...req.user
      })
	}
   return res.status(401).json({
      error: 'Unauthenticated'
   })
}