import axios from "axios";
import { DOMAIN, REQUEST_HEADERS } from "../constans/constants";

const API_V2 = axios.create({
    baseURL: DOMAIN + "/api/v2",
    timeout : 1000,
    headers: REQUEST_HEADERS
})

export { API_V2 }