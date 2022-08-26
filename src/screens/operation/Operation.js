import React, {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Input from '../../components/Input';
import CheckButton from '../../components/button/CheckButton';
import {useSettings} from '../../components/context/Provider';
import Divider from '../../components/Divider';
import Loader from '../../components/Loader';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS} from '../../constans/constants';
import {useFetching} from '../../hooks/useFetching';
import {OperationService} from '../../services/API';
import {setFontStyle, wordLocalization} from '../../utils/utils';
import PromoRow from '../../components/view/PromoRow';
import MenuItem from '../../components/item/MenuItem';
import PacketItem from '../../components/item/PacketItem';
import SearchItem from '../../components/item/SearchItem';
import {strings} from '../../localization';

const {width} = Dimensions.get('screen');

const Operation = ({navigation, route}) => {
  const {settings} = useSettings();
  console.log('settings: ', settings);

  const {operation, type} = route.params;
  console.log('params operation: ', operation);

  const [dataSource, setDataSource] = useState({
    data: null,
    list: [],
    packets: [],
    periods: [],
    promocodeLoad: false,
    promocode: null,
    showPromoCode: false,
    total: 0,
    cost: 0,
    bonuses: 0,
    usedBonuses: false,
    itemPacketOrPeriod: null,
  });

  const refUsedBonuses = useRef(false);
  const refitemPacketOrPeriod = useRef(null);
  const refPromocode = useRef('');

  useLayoutEffect(() => {
    navigation.setOptions({title: strings.Купить, headerTitleAlign: 'center'});
  }, []);

  const [fetchOperation, loading, operationError] = useFetching(async () => {
    const res = await OperationService.fetchOperation(operation?.id, type);
    let convertTypes = Object.entries(res?.data?.data?.types)?.map(([k, v]) => {
      v.type = k;
      return v;
    });

    if (res?.data?.data?.entity?.periods?.length) {
      let singleItem = res?.data?.data?.entity?.periods[0];
      singleItem.selected = true;
      refitemPacketOrPeriod.current = singleItem;
      setDataSource(prev => ({
        ...prev,
        data: res?.data.data,
        packets: res?.data?.data?.entity?.packets,
        periods: res?.data?.data?.entity?.periods,
        total: singleItem?.price,
        cost: singleItem?.price,
        bonuses: singleItem?.bonuses,
        list: convertTypes,
        itemPacketOrPeriod: singleItem,
      }));
    } else if (res?.data?.data?.entity?.packets?.length) {
      let singleItem = res?.data?.data?.entity?.packets[0];
      singleItem.selected = true;
      refitemPacketOrPeriod.current = singleItem;
      setDataSource(prev => ({
        ...prev,
        data: res?.data.data,
        packets: res?.data?.data?.entity?.packets,
        periods: res?.data?.data?.entity?.periods,
        total: singleItem?.price,
        cost: singleItem?.price,
        bonuses: singleItem?.bonuses,
        list: convertTypes,
        itemPacketOrPeriod: singleItem,
      }));
    } else {
      setDataSource(prev => ({
        ...prev,
        data: res?.data.data,
        packets: res?.data?.data?.entity?.packets,
        periods: res?.data?.data?.entity?.periods,
        total: res?.data?.data?.cost,
        cost: res?.data?.data?.cost,
        bonuses: res?.data?.data?.bonuses,
        list: convertTypes,
      }));
    }
  });

  const getPromocode = async promocode => {
    console.log('prev', dataSource);

    setDataSource(prev => ({...prev, promocodeLoad: true}));
    console.log('id', dataSource?.data);

    let params = {
      id: dataSource?.data?.id,
      promocode,
    };

    try {
      const res = await axios.get(PROMOCODES_URL, {params});
      console.log('res getPromocode: ', res);

      const findItem = arr => {
        return arr?.find(e => {
          if (e?.id == refitemPacketOrPeriod.current?.id) {
            e.selected = true;
            return e;
          }
        });
      };

      const calculateBonus = item => {
        if (refUsedBonuses.current) {
          if (item?.total) {
            return item?.total - item?.bonuses;
          } else if (item?.price) {
            return item?.price - item?.bonuses;
          }
        } else {
          if (item?.total) {
            return item?.total;
          } else if (item?.price) {
            return item?.price;
          }
        }
      };

      if (res?.data?.data?.periods?.length) {
        const singleItem = findItem(res?.data?.data?.periods);
        refitemPacketOrPeriod.current = singleItem;

        setDataSource(prev => ({
          ...prev,
          promocode: singleItem,
          total: calculateBonus(singleItem),
          cost: singleItem?.price,
          bonuses: singleItem?.bonuses,
          periods: res?.data?.data?.periods,
          itemPacketOrPeriod: singleItem,
          showPromoCode: true,
          promocodeLoad: false,
        }));
      } else if (res?.data?.data?.packets?.length) {
        const singleItem = findItem(res?.data?.data?.packets);
        refitemPacketOrPeriod.current = singleItem;

        setDataSource(prev => ({
          ...prev,
          promocode: singleItem,
          total: calculateBonus(singleItem),
          cost: singleItem?.price,
          bonuses: singleItem?.bonuses,
          packets: res?.data?.data?.packets,
          itemPacketOrPeriod: singleItem,
          showPromoCode: true,
          promocodeLoad: false,
        }));
      } else {
        setDataSource(prev => ({
          ...prev,
          promocode: res?.data?.data,
          total: res?.data?.data?.total,
          cost: res?.data?.data?.price,
          bonuses: res?.data?.data?.bonuses,
          showPromoCode: true,
          promocodeLoad: false,
        }));
      }
    } catch (e) {
      console.log('catch getPromocode: ', e, e?.response);
      setDataSource(prev => ({
        ...prev,
        promocodeLoad: false,
        showPromoCode: false,
      }));
      handlerErrorRequest(e);
    }
  };

  useEffect(() => {
    fetchOperation();
  }, []);

  const keyExtractor = item => item?.type;

  const keyExtractorPackets = item => item?.id?.toString();

  const getItemLayout = (data, index) => {
    const length = width / 2.3 - 16;
    return {
      length,
      offset: length * index,
      index,
    };
  };

  const selectedPaket = item => {
    refitemPacketOrPeriod.current = item;

    const calculateBonus = () => {
      if (refUsedBonuses.current) {
        if (item?.total) {
          return item?.total - item?.bonuses;
        }
        return item?.price - item?.bonuses;
      } else {
        if (item.total) {
          return item?.total;
        }
        return item?.price;
      }
    };

    if (item?.hasOwnProperty('period')) {
      console.log('item period: ', item);

      setDataSource(prev => ({
        ...prev,
        total: calculateBonus(),
        cost: item?.price,
        promocode: item,
        periods: prev?.periods?.map(period => {
          if (item?.id == period?.id) {
            period.selected = true;
          } else {
            period.selected = false;
          }
          return period;
        }),
        bonuses: item?.bonuses ? item?.bonuses : dataSource?.data?.bonuses,
        itemPacketOrPeriod: item,
      }));
    } else {
      console.log('item packet: ', item);

      setDataSource(prev => ({
        ...prev,
        total: calculateBonus(),
        cost: item?.price,
        promocode: item,
        packets: prev?.packets?.map(packet => {
          if (item?.id == packet?.id) {
            packet.selected = true;
          } else {
            packet.selected = false;
          }
          return packet;
        }),
        bonuses: item?.bonuses ? item?.bonuses : dataSource?.data?.bonuses,
        itemPacketOrPeriod: item,
      }));
    }
  };

  const open = useCallback(
    item => {
      if (item.type == 'kaspi') {
        navigation.navigate(KASPI_BANK_SCREEN, {
          kaspiBank: dataSource?.data,
          type: item?.type,
          mode: {
            promocode: refPromocode.current,
            period_id: refitemPacketOrPeriod.current,
            packet_id: refitemPacketOrPeriod.current,
            useBonuses: refUsedBonuses.current,
          },
        });
      } else {
        navigation.navigate(WEB_VIEWER_SCREEN, {
          webViewer: dataSource?.data,
          type: item,
          mode: {
            promocode: refPromocode.current,
            period_id: refitemPacketOrPeriod.current,
            packet_id: refitemPacketOrPeriod.current,
            useBonuses: refUsedBonuses.current,
          },
        });
      }
    },
    [dataSource?.data],
  );

  const onSubmitEditing = useCallback(
    ({nativeEvent}) => {
      if (nativeEvent.text) {
        refPromocode.current = nativeEvent.text;
        getPromocode(nativeEvent.text);
      }
    },
    [dataSource?.data],
  );

  const onCheckedBonuses = useCallback(() => {
    setDataSource(prev => ({
      ...prev,
      usedBonuses: !prev?.usedBonuses,
    }));
    refUsedBonuses.current = !refUsedBonuses.current;
  }, []);

  const operationBonuses = () => {
    if (refUsedBonuses.current) {
      if (dataSource?.bonuses || dataSource?.data?.bonuses) {
        let result;

        result = dataSource?.total - dataSource?.bonuses;

        setDataSource(prev => ({
          ...prev,
          total: result,
        }));
      }
    } else {
      if (dataSource?.itemPacketOrPeriod?.total) {
        setDataSource(prev => ({
          ...prev,
          total: dataSource?.itemPacketOrPeriod?.total,
          cost: dataSource?.itemPacketOrPeriod?.total,
        }));
      } else if (dataSource?.itemPacketOrPeriod?.price) {
        setDataSource(prev => ({
          ...prev,
          total: dataSource?.itemPacketOrPeriod?.price,
          cost: dataSource?.itemPacketOrPeriod?.price,
        }));
      } else {
        setDataSource(prev => ({
          ...prev,
          total: dataSource?.data?.cost,
          cost: dataSource?.data?.cost,
        }));
      }
    }
  };

  useEffect(operationBonuses, [refUsedBonuses.current]);

  // Layout
  const renderItem = ({item, index}) => (
    <MenuItem
      poster={item?.logo}
      text={item?.title}
      onPress={() => open(item)}
    />
  );

  const renderItemPackets = ({item, index}) => (
    <PacketItem
      style={item?.selected ? styles.packetItemSelected : styles.packetItem}
      name={item?.period ? item?.period : item?.packet?.name}
      selected={item?.selected}
      onPress={() => selectedPaket(item)}
    />
  );

  const renderHeader = (
    <View>
      <SearchItem
        styleView={styles.info}
        poster={dataSource?.data?.entity?.poster}
        categoryStarRowProps={{
          category: dataSource?.data?.entity?.category_name,
          rating: dataSource?.data?.entity?.rating,
          reviews: dataSource?.data?.entity?.reviews_count,
        }}
        title={dataSource?.data?.entity?.title}
      />
      <Divider isAbsolute={false} style={styles.divider} />

      {dataSource?.periods?.length || dataSource?.packets?.length ? (
        <Text style={styles.labelPeriod}>
          {dataSource?.periods?.length
            ? strings['Выберите период подписки']
            : strings['Выберите пакет']}
        </Text>
      ) : null}

      <FlatList
        data={
          dataSource?.periods?.length
            ? dataSource?.periods
            : dataSource?.packets
        }
        renderItem={renderItemPackets}
        keyExtractor={keyExtractorPackets}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listHor}
        style={styles.packetList}
      />

      <Text style={styles.selectedType}>{strings['Выберите тип оплаты']}</Text>
    </View>
  );

  const renderFooter = (
    <View style={styles.footer}>
      {settings?.payload?.modules_enabled_promocodes ? (
        <Input
          style={styles.input}
          placeholder={strings['Введите промокод']}
          returnKeyType="send"
          onSubmitEditing={onSubmitEditing}
        />
      ) : null}

      <PromoRow
        text={strings['Мои бонусы']}
        price={dataSource?.data?.total_bonuses}
        showZero
      />

      <PromoRow
        text={wordLocalization(strings['Доступно (:percent% от стоимости)'], {
          percent: settings?.payload?.modules_bonus_percent,
        })}
        price={dataSource?.bonuses}
        showZero
      />

      {dataSource?.bonuses || dataSource?.data?.bonuses ? (
        <CheckButton
          onPress={onCheckedBonuses}
          checked={dataSource?.usedBonuses}
          text={strings['Использовать бонусы']}
        />
      ) : null}

      <PromoRow
        text={strings.Итого}
        textStyle={styles.totalLabel}
        price={dataSource?.total}
        priceStyle={styles.priceTotal}
      />

      <PromoRow text={strings.Стоимость} price={dataSource?.cost} />

      {dataSource?.promocodeLoad ? (
        <Loader />
      ) : (
        dataSource?.showPromoCode && (
          <Fragment>
            <PromoRow
              text={`${strings.Скидка} ${dataSource.promocode?.discount}%`}
              price={dataSource?.promocode?.promocode_price}
            />
          </Fragment>
        )
      )}

      {dataSource?.usedBonuses ? (
        <PromoRow text={`${strings.Бонусы}`} price={dataSource?.bonuses} />
      ) : null}
    </View>
  );

  return (
    <UniversalView haveLoader={loading}>
      <KeyboardAwareFlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  info: {
    margin: 16,
  },
  divider: {
    marginHorizontal: 16,
  },
  labelPeriod: {
    ...setFontStyle(20, '700'),
    marginHorizontal: 16,
    marginTop: 24,
  },
  listHor: {
    paddingHorizontal: 12,
  },
  packetList: {
    marginTop: 12,
    marginBottom: 24,
  },
  packetItem: {
    width: width / 2.3 - 16,
  },
  packetItemSelected: {
    width: width / 2.3 - 16,
    backgroundColor: '#F5F5F5',
  },
  footer: {
    padding: 16,
  },
  input: {
    marginBottom: 24,
  },
  totalLabel: {
    ...setFontStyle(28, '700'),
    marginRight: 16,
  },
  priceTotal: {
    ...setFontStyle(20, '700', APP_COLORS.primary),
  },
  promocodeLabel: {
    ...setFontStyle(16, '400', APP_COLORS.placeholder),
    marginRight: 16,
  },
  selectedType: {
    marginHorizontal: 16,
    marginBottom: 12,
    ...setFontStyle(20, '700'),
  },
});

export default Operation;
