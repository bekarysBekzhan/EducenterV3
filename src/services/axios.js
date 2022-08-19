import axios from "axios";
import { DOMAIN, REQUEST_HEADERS } from "../constans/constants";

export const API_V2 = axios.create({
    baseURL: DOMAIN + "/api/v2/",
    headers: REQUEST_HEADERS
})

// API_V2.interceptors.request.use(function(response) {

// }, function(error) {
//     console.log(error)
//     Toast.show({
//         type: "error",
//         text1: error.response.data?.message
//     })
// })