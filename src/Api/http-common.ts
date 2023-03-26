import axios from 'axios'

export default axios.create({
  // import base url from config file
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_CROSS_ORIGIN

  }
})