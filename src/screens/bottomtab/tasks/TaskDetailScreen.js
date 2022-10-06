import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import DetailView from '../../../components/view/DetailView'
import { useFetching } from '../../../hooks/useFetching'
import { TaskService } from '../../../services/API'
import LoadingScreen from '../../../components/LoadingScreen'
import Person from '../../../components/Person'
import { strings } from '../../../localization'
import TransactionButton from '../../../components/button/TransactionButton'
import { useSettings } from '../../../components/context/Provider'
import { ROUTE_NAMES } from '../../../components/navigation/routes'
import { TYPE_SUBCRIBES } from '../../../constans/constants'

const TaskDetailScreen = (props) => {
    const id = props.route?.params?.id

    const { isAuth } = useSettings()
    const [data, setData] = useState(null)
    const [fetchTask, isFetching, fetchingError] = useFetching(async() => {
      const response = await TaskService.fetchTaskByID(id)
      setData(response.data?.data)
    })
  
    useEffect(() => {
      fetchTask()
    }, [])
  
    useEffect(() => {
      if(fetchingError) {
        console.log(fetchingError)
      }
    }, [fetchingError])

    const onNavigation = () => {
      if (isAuth) {
        if (data?.has_subscribed) {
          props.navigation.navigate(ROUTE_NAMES.moduleTask, { id: data?.id, title: data?.title })
        } else {
          props.navigation.navigate(ROUTE_NAMES.payment, { operation: data, type: TYPE_SUBCRIBES.TASK_SUBSCRIBE })
        }
      } else {
        props.navigation.navigate(ROUTE_NAMES.login)
      }
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
            status={strings['Автор задания']}
            description={data?.author?.description}
            extraStyles={{
              margin: 16,
              marginTop: 32
            }}
          />
        </UniversalView>
        <TransactionButton
          text={data?.has_subscribed ? strings['Пройти задание']  : data?.price ? strings['Купить задание'] : strings.Бесплатно }
          onPress={onNavigation}
          oldPrice={data?.has_subscribed ? 0 : data?.old_price}
          price={data?.has_subscribed ? 0 : data?.price}
        />
      </UniversalView>
    )
}

export default TaskDetailScreen