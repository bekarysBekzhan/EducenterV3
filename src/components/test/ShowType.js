import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import SelectOption from '../SelectOption';
import {APP_COLORS, SHOW_TYPE} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const ShowType = ({
  visible = false,
  onHide = () => undefined,
  onSelect = () => undefined,
}) => {
  const {localization} = useLocalization();

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
            {lang(
              'Вы уже прошли этот тест. Хотите пройти еще раз?',
              localization,
            )}
          </Text>
          <SelectOption
            value={SHOW_TYPE.test}
            selectKeyPressed={selectKeyPressed}
            label={lang('Пройти тест', localization)}
            currentKey={currentKey}
          />
          <SelectOption
            value={SHOW_TYPE.result}
            selectKeyPressed={selectKeyPressed}
            label={lang('Посмотреть результаты', localization)}
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
