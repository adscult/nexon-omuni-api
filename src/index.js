require('dotenv').config()
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const axios = require("axios");
const cipher = require("./cipher.js");
const cors = require("@fastify/cors");

// const API_URL = "https://api-preprod.ailiens.com/b/namo/api";
const API_URL = "https://mplace.omuni.com/api";
const STYLE_UNION_SHOPIFY_URL = "https://style-union-staging.myshopify.com/admin/api/2023-01/orders.json";
const PORT = 3000;

fastify.register(cors, {
  origin: ["https://style-union-staging.myshopify.com","https://styleunion.in","https://ethnicity-staging.myshopify.com","https://ethnicity.in"]
})

fastify.addHook('preHandler',function (request, reply, done) {
  const key = request.body.key || null;
  if(key){
    let response = cipher.decryptedText(key)
    if(response.status === 200){
      let AUTH = JSON.parse(response.message)
      if(AUTH instanceof Object){
        let {username,password} = AUTH
        if(username === process.env.AUTH_USER && password === process.env.AUTH_PWD){
          done()
        }else{
          reply.code(404)
          done(new Error("Invalid Details"))
        }
      }
      else {
        reply.code(401)
        done(new Error("Invalid Key"))
      }
    }
    else if (response.status === 500){
      reply.code(500)
      done(new Error(response.message))
    }
  }
})

// Routes
fastify.post('/api/style-union/order/checkServiceability', function handler (request, reply) {
  let REQUEST_DATA = request.body
  if(REQUEST_DATA.key){
    delete REQUEST_DATA.key
  }
  axios.post(`${API_URL}/v1/order/checkServiceability`,REQUEST_DATA,{
    headers: {
      "Authorization": `Bearer ${process.env.SU_BEARER}`,
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    reply.send(response.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      reply.send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
})

fastify.post('/api/style-union/order/tracking', function handler (request, reply) {
  let REQUEST_DATA = request.body
  if(REQUEST_DATA.key){
    delete REQUEST_DATA.key
  }
  axios.get(`${API_URL}/orders/status/tracking`,{
    params: REQUEST_DATA,
    headers: {
      "Authorization": `Bearer ${process.env.SU_BEARER}`,
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    reply.send(response.data.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response)
      reply.send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
})

fastify.post('/api/shopify/style-union/order', function handler (request, reply) {
  let REQUEST_DATA = request.body
  if(REQUEST_DATA.key){
    delete REQUEST_DATA.key
  }
  axios.get(STYLE_UNION_SHOPIFY_URL,{
    params: REQUEST_DATA,
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
    }
  })
  .then((response) => {
    reply.send(response?.data?.orders)
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response)
      reply.send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
})

fastify.post('/api/ethnicity/order/checkServiceability', function handler (request, reply) {
  let REQUEST_DATA = request.body
  if(REQUEST_DATA.key){
    delete REQUEST_DATA.key
  }
  axios.post(`${API_URL}/v1/order/checkServiceability`,REQUEST_DATA,{
    headers: {
      "Authorization": `Bearer ${process.env.EC_BEARER}`,
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    reply.send(response.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      reply.send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
})

fastify.post('/api/ethnicity/order/tracking', function handler (request, reply) {
  let REQUEST_DATA = request.body
  if(REQUEST_DATA.key){
    delete REQUEST_DATA.key
  }
  axios.get(`${API_URL}/orders/status/tracking`,{
    params: REQUEST_DATA,
    headers: {
      "Authorization": `Bearer ${process.env.EC_BEARER}`,
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    reply.send(response.data.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response);
      reply.send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
})

// Run the server!
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})