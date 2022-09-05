import React from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import { emptyStar, halfStar, starIcon } from '../assets/icons';


const StarButton = ({
  disabled,
  halfStarEnabled,
  rating,
  starIconName,
  starSize,
  activeOpacity,
  onStarButtonPress,
}) => {

  const renderIcon = () => {
    return starIconName == 'emptyStar'
      ? emptyStar(starSize)
      : starIconName == 'halfStar'
        ? halfStar(starSize)
        : starIcon(starSize);
  }

  const onButtonPress = (event) => {
    console.log('aaaaa', 'aaaa')

    let addition = 0;

    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }

    onStarButtonPress(rating + addition);
  }

  console.log('disabled', disabled)
  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onButtonPress}>
      {renderIcon()}
    </TouchableWithoutFeedback>
  );
};

export default StarButton;
