import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { View as AnimatableView } from 'react-native-animatable';
import StarButton from './StarButton';

const starRef = [];

const ANIMATION_TYPES = [
  'bounce',
  'flash',
  'jello',
  'pulse',
  'rotate',
  'rubberBand',
  'shake',
  'swing',
  'tada',
  'wobble',
  'bounceIn',
];

const propTypes = {
  animation: PropTypes.oneOf(ANIMATION_TYPES),
  disabled: PropTypes.bool,
  emptyStar: PropTypes.string,
  fullStar: PropTypes.string,
  halfStar: PropTypes.string,
  halfStarEnabled: PropTypes.bool,
  maxStars: PropTypes.number,
  rating: PropTypes.number,
  starSize: PropTypes.number,
  selectedStar: PropTypes.func,
};

const defaultProps = {
  animation: 'bounce',
  disabled: false,
  emptyStar: 'emptyStar',
  fullStar: 'fullStar',
  halfStar: 'halfStar',
  halfStarEnabled: false,
  maxStars: 5,
  rating: 0,
  starSize: 24,
  selectedStar: () => { },
};

const RatingStar = ({
  animation,
  disabled,
  emptyStar,
  fullStar,
  halfStar,
  halfStarEnabled,
  maxStars = 5,
  rating,
  starSize,
  selectedStar,
}) => {
  const onStarButtonPress = rating => {
    selectedStar(rating);
  };

  let starsLeft = Math.round(rating * 2) / 2;
  const starButtons = [];

  for (let i = 0; i < maxStars; i++) {
    let starIconName = emptyStar;

    if (starsLeft >= 1) {
      starIconName = fullStar;
    } else if (starsLeft === 0.5) {
      starIconName = halfStar;
    }

    const starButtonElement = (
      <AnimatableView
        key={i}
        ref={node => {
          starRef.push(node);
        }}>
        <StarButton
          disabled={disabled}
          halfStarEnabled={halfStarEnabled}
          onStarButtonPress={event => {
            if (animation && ANIMATION_TYPES.includes(animation)) {
              for (let s = 0; s <= i; s++) {
                !disabled && starRef[s][animation](1000 + s * 200);
              }
            }
            onStarButtonPress(event);
          }}
          rating={i + 1}
          starIconName={starIconName}
          starSize={starSize}
        />
      </AnimatableView>
    );

    starButtons.push(starButtonElement);
    starsLeft -= 1;
  }

  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'center', margin: 7 }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      {starButtons}
    </View>
  );
};

RatingStar.propTypes = propTypes;
RatingStar.defaultProps = defaultProps;

export default RatingStar;
