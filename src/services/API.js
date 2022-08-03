import axios from "axios"
import { baseURL, URLS } from "../constans/constants"

export default class MobileSettingsService {

    static fetchData = async() => {
        const url = baseURL + URLS.mobileSettings
        try {
            const response  = await axios.get(url)
            if (response.status == 200) {
                return response.data
            }
        } catch (error) {
            console.error(error)
        }
    }

}