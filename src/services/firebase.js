import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const serviceAccount = {
	type: 'service_account',
	project_id: 'themorethemerrierapp',
	private_key_id: '1d4649887364b4b5e7c1deca9ca912060c7d10c5',
	private_key:
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEAz3EUMqKrbFE\nleRNz3SMXxmx1O8vOggvLBFwnwQ7GdLksE/rlcUlA/0WMLmhQ8Nj19t2j2kgBglH\n8Xut/og6lkA2Vw933WaGtnI4Qrjn6RazB8IxN/JTPmUke/Skt1Xkqxgl3XuE36Ac\nTCfc8oATiCX9JUQfvCCbzW655BlhYxmsfERiYC2/IEEsQcxflJvAn7XzKDGV3nT5\ndeqWOIZYTikBnEuyS3bSYY85F6Ryu9QsnqmqPIA4UsvxNqS5ifW9kJLmY4SxxN1b\nhGUmST/5QNDykluf1ZC4vFkHE7o6j3K9boO7kPA1qkNHa3g01gU0AyVOwXp3klB2\nLBLBICO1AgMBAAECggEAWhynW8ZMpx6c/UvvrnnuOc5KsL+UymBifNVEm0LvngAM\nPUh1JXgwLwk7Y+U4odPWUuNcqI/bo3ZC9Aknc+EtXcnPcWvq1484YDwmHIlIGo3E\n+r9ZXmk7BVwNAY3e9Y63dS3XJylAbOCl6fx04xW1HcWcuVlVjUVetGHoQpuDs4oe\nNBkj9oXNOG2qiaMofB3xrAPkHwjziw9HdLdzg2c/ztADZsEYAru0RAEgKfdHygaA\nX5i+LbgCzUNp8zqm3p1Egf0B36lv+p+QWJKEaLIwrAyYkKtqZXpqbX3A2yj/cWry\nzuamVg6Pl5otGWHJvTEUT+mypoj1qSGc+XEKG7kdjQKBgQDw3lN8JLLN/EV3bRZj\nOisyXPD4n5315A7VG94dFkqRIVCfNmYRZGYPQQ6a9n0nZ0gRU5xoxubF6efINCwr\nCrQKV+KrdovlfzFPZuyjbVrkgAYBf/lSfTt9lzHe431IUjPnWoQDKtctEfx+HYJt\nUoZQafVew0GDImGTOmOt4zPMRwKBgQDQU4oCsXk9akbIW/R+sRHp2CS1OsETOWeI\nydAvfpj4msC3Y7vO0j6hIs2JN3xi6hu48IkS9XuABkLqmXWv4+fLteBO57q8XdZj\n/RUPJLU2lkCkdcjFJzebLI0d3VIGC7fK0yNIxyGqASQqxaywURxzAdOivMjbxuI6\nVwPQ4VQaIwKBgELRKc+STpedl5edh0xXYoxCBAa0IJmJfiPX6zGecWj5GOhRqtbA\nRx+MKIUMQ4OevvsveoAGTRYx4L5E2svF2FPWNWbjJ8OuGPuxzYs4VrJ0YTYhTgR4\nAPzB6G+wI5zgUM2o6l4GkFJMXwKNJRU2g1PjUNHM0GuUKgUxeV1PXZsZAoGAZbeU\nWDJNTzZX7zYuz7knVPVLHw3b/cX2jmxzcO0wRZpR5HkW1yoCmGzEzG3CFw3VkVwo\noZAox97Gx4M8WjA+GlHofr5Yh+aNam7E3IsAy/FbCLHV4KWAWgzLrjxE81y/VZH3\n1W4dOsOp5BR2d/RynpjSu8/Phre59+BKpa+Pf98CgYEA5ZKbpaSFTlOvphjh4hEC\nrtlwOLRQf7QSvyeHr7goW312/7pDYAUS5xRurYhL2Zxmdq88IxBln3oh8xJ3OT31\ngSYphjFeh10p78zI5JhJCdm+leDQhZbuZQDsvWYvPLsPv2JBtcTLiWMINSb0Zml6\nOV0NuZlOF1lWAOkEZEmlV0A=\n-----END PRIVATE KEY-----\n',
	client_email:
		'firebase-adminsdk-4193v@themorethemerrierapp.iam.gserviceaccount.com',
	client_id: '109991081654215397416',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4193v%40themorethemerrierapp.iam.gserviceaccount.com',
}

const firebaseApp = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

export default firebaseApp
