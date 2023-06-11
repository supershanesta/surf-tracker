/** @type {import('next').NextConfig} */
const nextConfig = {
	api: {
		bodyParser: {
			sizeLimit: "1mb", // Maximum size of the request body
		},
	},
};

module.exports = nextConfig;
