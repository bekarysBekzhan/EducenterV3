import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import DetailView from '../../../components/view/DetailView'
import { useFetching } from '../../../hooks/useFetching'
import { TestService } from '../../../services/API'
import LoadingScreen from '../../../components/LoadingScreen'
import Person from '../../../components/Person'
import { strings } from '../../../localization'
import TransactionButton from '../../../components/button/TransactionButton'
import { useSettings } from '../../../components/context/Provider'
import { ROUTE_NAMES } from '../../../components/navigation/routes'
import { N_STATUS, TYPE_SUBCRIBES } from '../../../constans/constants'

const TestDetailScreen = (props) => {

  const id = props.route?.params?.id

  const { isAuth, nstatus } = useSettings()
  const [data, setData] = useState(null)
  const [fetchTest, isFetching, fetchingError] = useFetching(async() => {
    const response = await TestService.fetchTestByID(id)
    setData(response.data?.data)
  })

  useEffect(() => {
    fetchTest()
  }, [])

  useEffect(() => {
    if(fetchingError) {
      console.log(fetchingError)
    }
  }, [fetchingError])

  const onNavigation = () => {
    if (isAuth) {
      if (data?.has_subscribed) {
        props.navigation.navigate(ROUTE_NAMES.testPreview, { id: data?.id, title: data?.title, type: "module" })
      } else {
        props.navigation.navigate(ROUTE_NAMES.operation, { operation: data, type: TYPE_SUBCRIBES.TEST_SUBCRIBE })
      }
    } else {
      props.navigation.navigate(ROUTE_NAMES.login)
    }
  }

  const getTransactionText = () => {
    if (nstatus === N_STATUS) {
      return strings['Пройти тест'];
    }

    if (data?.has_subscribed) {
      return strings['Пройти тест'];
    }
    if (data?.price) {
      return strings['Купить тест'];
    }
    return strings.Бесплатно;
  }

  if (isFetching) {
    return <LoadingScreen/>
  }

  if (isFetching) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView>
      <UniversalView haveScroll>
        <DetailView
          title={data?.title}
          poster={data?.poster}
          category={data?.category?.name}
          duration={data?.timer}
          description={data?.description}
        />
        <Person
          name={(data?.author?.name ? data?.author?.name : "") + " " + (data?.author?.surname ? data?.author?.surname : "")}
          image={data?.author?.avatar}
          status={strings['Автор теста']}
          description={data?.author?.description}
          extraStyles={{
            margin: 16,
            marginTop: 32
          }}
        />
      </UniversalView>
      <TransactionButton
        text={getTransactionText()}
        onPress={onNavigation}
        oldPrice={data?.has_subscribed ? 0 : data?.old_price}
        price={data?.has_subscribed ? 0 : data?.price}
      />
    </UniversalView>
  )
}

export default TestDetailScreen