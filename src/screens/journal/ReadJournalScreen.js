import React, {useLayoutEffect, useMemo, useState} from 'react';
import {Alert, Dimensions, Linking, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS} from '../../constans/constants';
import {strings} from '../../localization';
import {setFontStyle} from '../../utils/utils';

const {width, height} = Dimensions.get('screen');

const ReadJournalScreen = ({navigation, route}) => {
  const {readJournal} = route.params;

  console.log('readJournal', readJournal);

  const [dataSource, setDataSource] = useState({
    error: false,
  });

  const source = useMemo(
    () => ({
      uri: readJournal?.file,
      cache: true,
    }),
    [],
  );

  const onPressLink = uri => {
    Linking.openURL(uri);
  };

  const onError = error => {
    if (error) {
      if (!dataSource?.error) {
        Alert.alert(strings['Внимание!'], strings['Ошибка!'], [
          {
            text: 'OK',
            onPress: navigation.goBack,
          },
        ]);
      }

      setDataSource(prev => ({...prev, error: true}));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: readJournal?.title,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        ...setFontStyle(17, '600'),
      },
    });
  }, []);

  return (
    <UniversalView>
      <Pdf
        source={source}
        onPressLink={onPressLink}
        onError={onError}
        style={styles.pdf}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width,
    height,
    backgroundColor: APP_COLORS.white,
  },
});

export default ReadJournalScreen;
