import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Empty from '../../components/Empty';
import FileItem from '../../components/FileItem';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS, WIDTH} from '../../constans/constants';

const CourseMaterialScreen = props => {
  const data = props.route.params;

  const keyExtractor = useCallback((_, index) => index, []);

  const renderItem = useCallback(
    ({item}) => (
      <View>
        <FileItem
          urlFile={item?.link}
          fileName={item?.file_name}
          style={{width: WIDTH, paddingHorizontal: 16}}
        />
      </View>
    ),
    [],
  );

  return (
    <UniversalView>
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={() => <Empty />}
          data={data}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </UniversalView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    paddingTop: 16,
    borderColor: APP_COLORS.border,
  },
});

export default CourseMaterialScreen;
