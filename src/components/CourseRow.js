import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {fileDownloader, setFontStyle} from '../utils/utils';
import {APP_COLORS, N_STATUS} from '../constans/constants';
import Price from './Price';
import ItemRating from './ItemRating';
import {useSettings} from './context/Provider';
import TextButton from './button/TextButton';
import Downloader from './Downloader';
import RNFS from 'react-native-fs';
import { lang } from '../localization/lang';
import { useLocalization } from './context/LocalizationProvider';

const CourseRow = ({
  id,
  poster,
  title,
  category_name,
  price,
  old_price,
  rating,
  reviewCount,
  onPress = () => undefined,
  disabled = false,
  certificate,
  containerStyle = {},
}) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const refJobId = useRef(null);
  const {settings, nstatus} = useSettings();
  const {localization} = useLocalization();


  const onProgress = useCallback(data => {
    console.log('progress: ', data);

    if (data) {
      refJobId.current = data?.jobId;
      let currentPercent = (data?.bytesWritten * 100) / data?.contentLength;
      setProgress(currentPercent);
    } else {
      refJobId.current = null;
      setProgress(0);
    }
  }, []);

  const downloader = useCallback(() => {
    setVisible(true);
    fileDownloader(
      certificate?.file,
      title,
      () => setVisible(false),
      onProgress,
    );
  }, []);

  const cancelDownloader = useCallback(() => {
    setVisible(false);
    if (refJobId.current) {
      RNFS.stopDownload(refJobId.current);
      setProgress(0);
    }
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
      disabled={disabled}>
      <FastImage
        source={{uri: poster, priority: 'high'}}
        style={styles.poster}
      />
      <View
        style={[
          nstatus === N_STATUS ? {height: 38} : {height: 64},
          styles.data,
        ]}>
        <Text style={setFontStyle(11, '400', APP_COLORS.placeholder)}>
          {category_name}
        </Text>
        <Text
          style={setFontStyle(17, '600', APP_COLORS.font)}
          numberOfLines={1}>
          {title}
        </Text>
        {nstatus === N_STATUS ? null : price === undefined ? (
          <View />
        ) : (
          <Price
            price={price}
            oldPrice={old_price}
            oldPriceStyle={styles.textOldPrice}
            priceStyle={styles.textPrice}
          />
        )}
      </View>
      <View style={styles.column}>
        <ItemRating rating={rating} reviewCount={reviewCount} starSize={16} />
        {settings?.modules_enabled_certificates && certificate ? (
          <TextButton
            style={styles.button}
            textStyle={{...styles.buttonText, color: settings?.color_app}}
            text={lang('Скачать', localization)}
            onPress={downloader}
          />
        ) : (
          <View />
        )}
      </View>
      <Downloader
        visible={visible}
        progress={progress}
        onPressCancel={cancelDownloader}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  poster: {
    width: 62,
    height: 62,
    borderRadius: 10,
    marginRight: 8,
  },
  data: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textPrice: {
    fontSize: 13,
    fontWeight: '500',
  },
  textOldPrice: {
    fontSize: 13,
    fontWeight: '500',
  },
  column: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  button: {
    // backgroundColor: "red"
  },
  buttonText: {
    ...setFontStyle(13, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default CourseRow;
