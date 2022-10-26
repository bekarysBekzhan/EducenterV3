import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import {strings} from '../../localization';
import SelectOption from '../SelectOption';
import {APP_COLORS, SHOW_TYPE} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';

const ShowType = ({
  visible = false,
  onHide = () => undefined,
  onSelect = () => undefined,
}) => {
  const [currentKey, setCurrentKey] = useState(null);

  const selectKeyPressed = key => {
    setCurrentKey(key);
    onHide();
    onSelect(key);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} onPress={onHide} />
        <View style={styles.modal}>
          <Text style={styles.text}>
            {strings['Вы уже прошли этот тест. Хотите пройти еще раз?']}
          </Text>
          <SelectOption
            value={SHOW_TYPE.test}
            selectKeyPressed={selectKeyPressed}
            label={strings['Пройти тест']}
            currentKey={currentKey}
          />
          <SelectOption
            value={SHOW_TYPE.result}
            selectKeyPressed={selectKeyPressed}
            label={strings['Посмотреть результаты']}
            currentKey={currentKey}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: APP_COLORS.white,
    padding: 16,
    paddingBottom: 32,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  text: {
    ...setFontStyle(17, '600', APP_COLORS.font),
    marginBottom: 32,
  },
});

export default ShowType;
