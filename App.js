import React, { useState } from 'react';
import { View, Text, Alert, TextInput } from 'react-native';
import UniversalView from './src/components/view/UniversalView';
import OutlineButton from './src/components/button/OutlineButton';
import SimpleButton from './src/components/button/SimpleButton';
import TransactionButton from './src/components/button/TransactionButton';
import RowView from './src/components/view/RowView';
import HeaderView from './src/components/view/HeaderView';
import ReviewItem from './src/components/view/ReviewItem';
import RatingStar from './src/components/RatingStar';
import { left_icon, right_icon } from './src/assets/icons';
import NavButtonRow from './src/components/view/NavButtonRow';

const viewstyle = { padding: 16 };

const App = () => {
  const [rating, setRating] = useState(0);

  return (
    <UniversalView>
      <HeaderView
        leftIcon={left_icon}
        onLeftPress={() => Alert.alert('onLeftPress')}
        rightIcon={right_icon}
        onRightPress={() => Alert.alert('onRightPress')}
        haveBottomLine
        // title or component
        // title={'titleText'}
        component={
          <TextInput
            style={{
              width: '100%',
              height: 36,
              borderRadius: 12,
              backgroundColor: '#F5F5F5',
            }}
          />
        }
      />
      <View style={viewstyle}>
        <OutlineButton text={'Outline Button'} />

        <View style={viewstyle} />

        <SimpleButton text={'Simple Button'} />

        <View style={viewstyle} />

        <TransactionButton
          text={'Transaction Button'}
          price={990}
          oldPrice={1000}
        />

        <View style={viewstyle} />

        <RowView style={{ justifyContent: 'space-between' }}>
          <Text>RowView text 1</Text>
          <Text>RowView text 2</Text>
        </RowView>

        <View style={viewstyle} />

        <ReviewItem
          avatar="https://edukey.kz/custom/img/illustration1.png"
          name="Devon Lane"
          date="25 августа"
          rating="4.5 из 5"
          startRating={4.5}
          review="As a developer, I really appreciated the chapter on Color Theory. It was just the right balance of theory combined with examples."
        />
        <View style={viewstyle} />

        {/* <RatingStar
          halfStarEnabled={true}
          maxStars={5}
          disabled={false}
          rating={rating}
          starSize={50}
          selectedStar={rating => setRating(rating)} /> */}
        <View style={viewstyle} />

        <NavButtonRow
          leftIcon={right_icon}
          title="Журнал"
          onPress={() => Alert.alert('fff')}
        />

      </View>
    </UniversalView>
  );
};

export default App;
