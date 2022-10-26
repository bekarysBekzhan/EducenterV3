import React, {useState, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CallCenterIcon, x} from '../../assets/icons';
import {APP_COLORS, HEIGHT, WIDTH} from '../../constans/constants';
import {strings} from '../../localization';
import {getWhatsappNumber} from '../../utils/utils';
import OutlineButton from '../button/OutlineButton';
import SimpleButton from '../button/SimpleButton';
import Divider from '../Divider';
import RowView from '../view/RowView';

const MemberItem = ({
  name,
  surname,
  avatar,
  phone,
  hide_phone,
  company,
  category,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const callNumber = () => {
    Linking.openURL(`tel:${phone}`);
    console.log('call number: ', phone);
  };

  const whatsappLink = () => {
    Linking.openURL(
      'http://api.whatsapp.com/send?phone=' + getWhatsappNumber(phone),
    );
  };

  const info = (
    <View style={styles.infoContaiber}>
      <FastImage
        style={{width: 48, height: 48, borderRadius: 24}}
        source={{
          uri: avatar,
          priority: 'high',
        }}
      />
      <View style={styles.info}>
        <Text style={styles.category}>{category}</Text>
        <View style={styles.name}>
          <Text style={styles.caption}>{name} </Text>
          <Text style={styles.caption}>{surname}</Text>
        </View>
        <Text style={styles.company}>{company}</Text>
      </View>
      <View style={styles.border} />
    </View>
  );

  const modal = (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modal}>
        <View style={styles.modalSpaceContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{width: WIDTH, height: HEIGHT / 2}}></TouchableOpacity>
        </View>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.hideModal} />

          <View style={styles.modalTopContainer}>
            <View
              style={{
                width: WIDTH,
                width: WIDTH - 48,
                alignItems: 'center',
              }}>
              <Text style={styles.title}>{strings.Детали}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              {x(16, APP_COLORS.border)}
            </TouchableOpacity>
          </View>
          {info}
          {hide_phone ? null : (
            <View>
              <RowView style={styles.phoneContainer}>
                <CallCenterIcon />
                <Text style={styles.title}>{phone}</Text>
              </RowView>
              <Divider isAbsolute style={styles.divider} />
            </View>
          )}
          {hide_phone ? null : (
            <View style={styles.buttonContainer}>
              <SimpleButton
                text={strings['Позвонить']}
                style={{marginBottom: 8}}
                onPress={callNumber}
              />
              <OutlineButton
                text={strings['Написать в WhatsApp']}
                onPress={whatsappLink}
              />
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      {info}
      {modal}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  border: {
    top: 10,
    borderBottomWidth: 1,
    borderColor: APP_COLORS.border,
    width: WIDTH,
  },
  name: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  category: {
    fontSize: 13,
    color: APP_COLORS.font,
  },
  company: {
    fontSize: 13,
    color: APP_COLORS.primary,
  },
  infoContaiber: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    // backgroundColor: 'gray',
    justifyContent: 'center',
    width: WIDTH - 32,
    marginHorizontal: 16,
    height: 64,
    // justifyContent: 'center',
  },
  info: {
    marginHorizontal: 16,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: WIDTH,
    paddingVertical: 0,
    height: HEIGHT / 1.8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalSpaceContainer: {
    height: HEIGHT,
    position: 'absolute',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  modalTopContainer: {
    flexDirection: 'row',
    marginTop: 32,
    height: 40,
    marginHorizontal: 16,
  },
  hideModal: {
    position: 'absolute',
    marginTop: 5,
    width: 48,
    height: 4,
    backgroundColor: '#aaa',
    borderRadius: 10,
    left: WIDTH / 2 - 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginHorizontal: 16,
  },
  caption: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    width: WIDTH - 32,
    left: 16,
    bottom: 32,
  },
  divider: {
    left: '15%',
  },
});

export default memo(MemberItem);
