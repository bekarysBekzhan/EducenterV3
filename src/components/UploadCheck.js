import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RowView from './view/RowView';
import {DeleteIcon, iconNext} from '../assets/icons';
import {APP_COLORS} from '../constans/constants';
import IconButton from './button/IconButton';
import { setFontStyle } from '../utils/utils';

const UploadCheck = ({
  text,
  textStyle,
  placeholder,
  placeholderStyle,
  style,
  onPress,
  file,
  fileStyle,
  remove,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <RowView style={{...styles.row, ...style}}>
        <RowView style={styles.rtp}>
          <Text style={{...styles.text, ...textStyle}}>{text}</Text>
          {file ? (
            <RowView style={styles.riv}>
              <View style={styles.imgView}>
                <FastImage
                  source={file}
                  style={{...styles.file, ...fileStyle}}
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                  onError={() => setLoading(false)}>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={APP_COLORS.primary}
                    />
                  ) : null}
                </FastImage>
              </View>
              <IconButton
                children={<DeleteIcon />}
                style={styles.iconButton}
                onPress={remove}
              />
            </RowView>
          ) : (
            <RowView style={styles.upload}>
              <Text style={{...styles.placeholder, ...placeholderStyle}}>
                {placeholder}
              </Text>
              {iconNext}
            </RowView>
          )}
        </RowView>
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: APP_COLORS.transparent,
    paddingVertical: 20,
    borderBottomColor: APP_COLORS.border,
    borderBottomWidth: 1,
  },
  rtp: {
    flex: 1,
    backgroundColor: APP_COLORS.transparent,
    justifyContent: 'space-between',
  },
  riv: {
    backgroundColor: APP_COLORS.transparent,
  },
  text: {
    ...setFontStyle(),
  },
  placeholder: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
  },
  upload: {
    backgroundColor: APP_COLORS.transparent,
  },
  imgView: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(172, 180, 190, 0.08)',
    backgroundColor: APP_COLORS.white,
  },
  file: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 4,
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default UploadCheck;
