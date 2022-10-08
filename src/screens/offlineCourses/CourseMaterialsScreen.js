import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Empty from '../../components/Empty';
import FileItem from '../../components/FileItem';
import UniversalView from '../../components/view/UniversalView';
import {WIDTH} from '../../constans/constants';

const CourseMaterialScreen = props => {
  const data = props.route.params;

  const keyExtractor = useCallback((_, index) => index, []);

  const renderItem = useCallback(
    ({item}) => (
      <FileItem
        urlFile={item?.link}
        fileName={item?.file_name}
        style={{width: WIDTH, paddingHorizontal: 16}}
      />
    ),
    [],
  );

  const renderEmpty = () => <Empty />;

  return (
    <UniversalView>
      <FlatList
        ListEmptyComponent={renderEmpty}
        data={data}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
      />
    </UniversalView>
  );
};
const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default CourseMaterialScreen;
