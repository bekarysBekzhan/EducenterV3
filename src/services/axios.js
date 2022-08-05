import axios from "axios";
import { DOMAIN, REQUEST_HEADERS } from "../constans/constants";

export const API_V2 = axios.create({
    baseURL: DOMAIN + "/api/v2/",
    headers: REQUEST_HEADERS
})