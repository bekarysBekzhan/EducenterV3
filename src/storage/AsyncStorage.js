import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeString = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

export const storeObject = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.log(e)
    }
}

export const getString = async (key) => {
    try {
      const string = await AsyncStorage.getItem(key)
      return string
    } catch(e) {
      console.log("error reading string value")
    }
}

export const getObject = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log("error reading object value")
    }
}