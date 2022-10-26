import { StyleSheet } from "react-native";

export const shadowStyle = (
    shadowColor = '#000',
    width = 0,
    height = 0,
    shadowOpacity = 0.05,
    shadowRadius = 8,
    elevation = 1
) => {
    return StyleSheet.create({
        shadow: {
            shadowColor,
            shadowOffset: { width, height },
            shadowOpacity,
            shadowRadius,
            elevation
        }
    }).shadow
};