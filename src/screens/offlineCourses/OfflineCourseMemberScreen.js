import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, TextInput, View} from 'react-native';
import Empty from '../../components/Empty';
import MemberItem from '../../components/item/MemberItem';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS, WIDTH} from '../../constans/constants';
import {search} from '../../assets/icons';
import {useLocalization} from '../../components/context/LocalizationProvider';
import { lang } from '../../localization/lang';

const OfflineCourseMemberScreen = props => {
  const data = props.route.params;

  const {localization} = useLocalization();

  const [searches, setSearch] = useState('');
  const [fiteredDataSource, setFiteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFiteredDataSource(newData);
      setSearch(text);
    } else {
      setFiteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  useEffect(() => {
    console.log('members : ', data);
    setFiteredDataSource(data);
    setMasterDataSource(data);
  }, []);

  const keyExtractor = useCallback((_, index) => index, []);

  const renderItem = useCallback(
    ({item}) => (
      <MemberItem
        name={item?.name}
        surname={item?.surname}
        avatar={item?.avatar}
        phone={item?.phone}
        hide_phone={item?.hide_phone}
        category={item?.job?.category}
        company={item?.job?.company}
      />
    ),
    [],
  );

  return (
    <UniversalView>
      <View style={styles.searchIcon}>{search()}</View>
      <TextInput
        style={styles.searchContainer}
        placeholder={lang('Поиск среди участников', localization)}
        onChangeText={text => searchFilterFunction(text)}
        value={searches}></TextInput>

      <FlatList
        ListEmptyComponent={() => <Empty />}
        data={fiteredDataSource}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: WIDTH - 32,
    left: 16,
    marginTop: 13,
    marginBottom: 10,
    height: 36,
    paddingRight: 13,
    paddingLeft: 36,
    backgroundColor: APP_COLORS.gray,
    borderRadius: 10,
  },

  searchIcon: {
    zIndex: 1,
    position: 'absolute',
    left: 29,
    marginTop: 24,
  },
});

export default OfflineCourseMemberScreen;
