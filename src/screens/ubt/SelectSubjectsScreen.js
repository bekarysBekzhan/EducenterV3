import React, { useEffect, useRef, useState } from 'react';
import UniversalView from '../../components/view/UniversalView';
import { useFetching } from '../../hooks/useFetching';
import { UBTService } from '../../services/API';
import LoadingScreen from '../../components/LoadingScreen';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Empty from '../../components/Empty';
import { setFontStyle } from '../../utils/utils';
import {
  APP_COLORS,
  HEIGHT,
  TYPE_SUBCRIBES,
} from '../../constants/constants';
import ModuleTestItem from '../../components/test/ModuleTestItem';
import SimpleButton from '../../components/button/SimpleButton';
import { down } from '../../assets/icons';
import SelectOption from '../../components/SelectOption';
import { useSettings } from '../../components/context/Provider';
import { ROUTE_NAMES } from '../../components/navigation/routes';
import { useLocalization } from '../../components/context/LocalizationProvider';
import { lang } from '../../localization/lang';
import SmallHeaderBar from '../../components/SmallHeaderBar';

const SelectSubjectsScreen = props => {
  const category = useRef(null);
  const category2 = useRef(null);

  const { isAuth } = useSettings();

  const { localization } = useLocalization();

  const [dataSource, setDataSource] = useState({
    categories: [],
    categories2: [],
    tests: [],
  });

  const [fetchCategories, isFetchingCategories] = useFetching(async () => {
    const response = await UBTService.fetchCategories();
    setDataSource(prev => ({
      ...prev,
      categories: response.data?.data,
    }));
  });

  const [fetchTests, isFetchingTests] = useFetching(async () => {
    const response = await UBTService.fetchTests(
      category.current?.id,
      category2.current?.id,
    );
    if (category2.current) {
      setDataSource(prev => ({
        ...prev,
        tests: response.data?.data,
      }));
    } else {
      const newCategories2 = getCategories2(response.data?.data);
      setDataSource(prev => ({
        ...prev,
        categories2: newCategories2,
      }));
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (props.route?.params?.reloadSubjects) {
      fetchTests();
    }
  }, [props.route?.params?.reloadSubjects]);

  const getCategories2 = categories => {
    if (categories.length === 0) {
      return [];
    }

    let subjects = {};

    categories.forEach(element => {
      if (category.current.id === element?.category_id) {
        subjects[element?.category_id2] = true;
      } else {
        subjects[element?.category_id] = true;
      }
    });

    return dataSource.categories.filter(element =>
      subjects.hasOwnProperty(element.id),
    );
  };

  const onFirstSelect = value => {
    if (category.current === value) {
      return;
    }
    category.current = value;
    if (category2.current) {
      category2.current = null;
    }
    fetchTests();
  };

  const onSecondSelect = value => {
    if (category2.current === value) {
      return;
    }
    category2.current = value;
  };

  const testItemTapped = item => {
    if (isAuth) {
      if (item?.has_subscribed) {
        props.navigation.navigate(ROUTE_NAMES.testPreview, {
          id: item?.id,
          type: 'ubt',
        });
      } else {
        props.navigation.navigate(ROUTE_NAMES.operation, {
          operation: item,
          type: TYPE_SUBCRIBES.TEST_SUBCRIBE,
          previousScreen: ROUTE_NAMES.selectSubjects,
        });
      }
    } else {
      props.navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const renderHeader = () => {
    return (
      <View>
        <Text style={{ color: APP_COLORS.font }}>
          {lang(
            'Выберите вопросы первого и второго урока чтобы начать тест',
            localization,
          )}
        </Text>
        <SelectButton
          categories={dataSource.categories}
          placeholder={lang('Выберите первый урок', localization)}
          action={onFirstSelect}
          localization={localization}
        />
        <SelectButton
          categories={dataSource.categories2}
          placeholder={lang('Выберите второй урок', localization)}
          action={onSecondSelect}
        />
        <SimpleButton
          text={lang('Выбрать', localization)}
          onPress={fetchTests}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <ModuleTestItem
        id={item?.id}
        index={index}
        categoryName={item?.category?.name}
        time={item?.timer}
        title={item?.title}
        attempts={item?.attempts}
        price={item?.price}
        oldPrice={item?.old_price}
        onPress={() => testItemTapped(item)}
        hasSubscribed={item?.has_subscribed}
      />
    );
  };

  const renderFooter = () => {
    return <View />;
  };

  const renderEmptyComponent = () => {
    if (category.current && category2.current) {
      return <Empty />;
    }
    return null;
  };

  if (isFetchingCategories) {
    return <LoadingScreen />;
  }
  return (
    <UniversalView>
      <View style={styles.container}>
        <FlatList
          data={category2.current ? dataSource.tests : []}
          ListHeaderComponent={renderHeader()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </UniversalView>
  );
};

const SelectButton = ({
  categories = [],
  placeholder = '',
  localization,
  action = () => undefined,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const onPress = () => {
    setVisible(true);
  };

  const onBackDrop = () => {
    if (currentCategory) {
      setCurrentCategory(null);
    }
    setVisible(false);
  };

  const onSelect = value => {
    setCurrentCategory(value);
  };

  const onApply = () => {
    setVisible(false);
    action(currentCategory);
  };

  const renderCategory = ({ item, index }) => {
    return (
      <SelectOption
        selectKeyPressed={onSelect}
        label={item?.name}
        value={item}
        currentKey={currentCategory}
      />
    );
  };

  return (
    <View>
      <TouchableOpacity style={styles.select} onPress={onPress}>
        <Text
          style={[
            styles.selectText,
            { color: currentCategory ? APP_COLORS.font : APP_COLORS.placeholder },
          ]}>
          {currentCategory ? currentCategory?.name : placeholder}
        </Text>
        {down}
      </TouchableOpacity>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity style={styles.backDrop} onPress={onBackDrop} />
          <View style={styles.categoriesContainer}>
            <Text style={styles.headerTitle}>{placeholder}</Text>
            <FlatList
              data={categories}
              ListEmptyComponent={() => <Empty />}
              renderItem={renderCategory}
              keyExtractor={(_, index) => index.toString()}
            />
            <SimpleButton
              text={lang('Выбрать', localization)}
              onPress={onApply}
              style={{ margin: 16, marginBottom: 32 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.input,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  selectText: {
    ...setFontStyle(17, '400', APP_COLORS.placeholder),
  },
  modal: {
    flex: 1,
  },
  backDrop: {
    flex: 1,
    backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.2)',
  },
  categoriesContainer: {
    maxHeight: HEIGHT / 2,
    minHeight: 200,
    backgroundColor: 'white',
  },
  headerTitle: {
    ...setFontStyle(17, '600'),
    alignSelf: 'center',
    margin: 16,
  },
});

export default SelectSubjectsScreen;
