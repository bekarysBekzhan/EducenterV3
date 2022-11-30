import React from 'react';
import {TouchableOpacity} from 'react-native';
import {emptyStar, halfStar, starIcon} from '../assets/icons';

const StarButton = ({
  disabled,
  halfStarEnabled,
  rating,
  starIconName,
  starSize,
  activeOpacity,
  onStarButtonPress = () => undefined,
}) => {
  const renderIcon = () => {
    return starIconName == 'emptyStar'
      ? emptyStar(starSize)
      : starIconName == 'halfStar'
      ? halfStar(starSize)
      : starIcon(starSize);
  };

  const onButtonPress = event => {
    console.log('aaaaa', 'aaaa');

    let addition = 0;

    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }

    onStarButtonPress(rating + addition);
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={onButtonPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
};

export default StarButton;
