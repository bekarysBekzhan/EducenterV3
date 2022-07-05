import {View, Text, Alert, TextInput} from 'react-native';
import React from 'react';
import UniversalView from './src/components/view/UniversalView';
import OutlineButton from './src/components/button/OutlineButton';
import SimpleButton from './src/components/button/SimpleButton';
import TransactionButton from './src/components/button/TransactionButton';
import RowView from './src/components/view/RowView';
import HeaderView from './src/components/view/HeaderView';
import Svg, {Path} from 'react-native-svg';

const left_icon = (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7 12C7 11.7901 7.08554 11.5889 7.23753 11.4413L13.6375 5.22697C13.9517 4.9219 14.4582 4.92472 14.7689 5.23327C15.0795 5.54182 15.0767 6.03926 14.7625 6.34433L8.93784 12L14.7625 17.6557C15.0767 17.9607 15.0795 18.4582 14.7689 18.7667C14.4582 19.0753 13.9517 19.0781 13.6375 18.773L7.23753 12.5587C7.08554 12.4111 7 12.2099 7 12Z"
      fill="#5559F4"
    />
  </Svg>
);

const right_icon = (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.425 6H22.5V7.5H19.425C19.05 9.225 17.55 10.5 15.75 10.5C13.95 10.5 12.45 9.225 12.075 7.5H1.5V6H12.075C12.45 4.275 13.95 3 15.75 3C17.55 3 19.05 4.275 19.425 6ZM13.5 6.75C13.5 8.025 14.475 9 15.75 9C17.025 9 18 8.025 18 6.75C18 5.475 17.025 4.5 15.75 4.5C14.475 4.5 13.5 5.475 13.5 6.75ZM4.575 18H1.5V16.5H4.575C4.95 14.775 6.45 13.5 8.25 13.5C10.05 13.5 11.55 14.775 11.925 16.5H22.5V18H11.925C11.55 19.725 10.05 21 8.25 21C6.45 21 4.95 19.725 4.575 18ZM10.5 17.25C10.5 15.975 9.525 15 8.25 15C6.975 15 6 15.975 6 17.25C6 18.525 6.975 19.5 8.25 19.5C9.525 19.5 10.5 18.525 10.5 17.25Z"
      fill="#5559F4"
    />
  </Svg>
);

const viewstyle = {padding: 16};

const App = () => {
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

        <RowView style={{justifyContent: 'space-between'}}>
          <Text>RowView text 1</Text>
          <Text>RowView text 2</Text>
        </RowView>

        <View style={viewstyle} />
      </View>
    </UniversalView>
  );
};

export default App;
