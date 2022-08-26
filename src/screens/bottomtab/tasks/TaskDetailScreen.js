import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import DetailView from '../../../components/view/DetailView'
import { useFetching } from '../../../hooks/useFetching'
import { TaskService } from '../../../services/API'
import LoadingScreen from '../../../components/LoadingScreen'
import Person from '../../../components/Person'
import { strings } from '../../../localization'
import TransactionButton from '../../../components/button/TransactionButton'

const TaskDetailScreen = (props) => {
    const id = props.route?.params?.id

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
          onPress={() => undefined}
          oldPrice={data?.has_subscribed ? 0 : data?.old_price}
          price={data?.has_subscribed ? 0 : data?.price}
        />
      </UniversalView>
    )
}

export default TaskDetailScreen