import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { useFetching } from '../../../hooks/useFetching'
import { MyCourseService } from '../../../services/API'
import { ROUTE_NAMES } from '../../../components/navigation/routes'
import { APP_COLORS, WIDTH } from '../../../constans/constants'
import LoadingScreen from '../../../components/LoadingScreen'
import { setFontStyle, wordLocalization } from '../../../utils/utils'
import { strings } from '../../../localization'
import Divider from '../../../components/Divider'
import RowView from '../../../components/view/RowView'
import { check, PlayIcon } from '../../../assets/icons'
import TextButton from '../../../components/button/TextButton'
import Empty from '../../../components/Empty'

const MyTasksTab = (props) => {

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [fetchTasks, isFetching, fetchingError] = useFetching(async() => {
    const response = await MyCourseService.fetchMyTasks()
    setData(response.data?.data)
    setLastPage(response.data?.last_page)
  })
  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(async() => {
    const response = await MyCourseService.fetchMyTasks("", page)
    setData(prev => prev.concat(response.data?.data))
  })

  // fetchTest error handler
  useEffect(() => {
    if(fetchingError) {
      console.log(fetchingError)
    }
  }, [fetchingError])

  // fetchNext error handler
  useEffect(() => {
    if(fetchingNextError) {
      console.log(fetchingNextError)
    }
  })

  useEffect(() => {
    if(page === 1) {
      fetchTasks()
    } else {
      fetchNext()
    }
  }, [page])


  const taskItemTapped = (taskID) => {
    props.navigation.navigate(ROUTE_NAMES.moduleTask, {id: taskID})
  }

  const renderTask = ({ item, index }) => {
    return(
      <MyTask
        id={item?.id}
        index={index}
        title={item?.title}
        finished={item?.passing_task?.finished}
        score={item?.passing_task?.score}
        onPress={taskItemTapped}
      />
    )
  }

  const renderFooter = () => (
    <View
      style={styles.footer}
    >
      {
        isFetchingNext
        ?
        <ActivityIndicator color={APP_COLORS.primary}/>
        :
        null
      }
    </View>
  )

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1)
    }
  }

  const onRefresh = () => {
    if(page === 1) {
      fetchTasks()
    }
    setPage(1)
  }

  if (isFetching) {
    return <LoadingScreen/>
  }
  return (
    <UniversalView>
      <FlatList
        data={data}
        contentContainerStyle={styles.container}
        ListEmptyComponent={() => <Empty/>}
        renderItem={renderTask}
        ListFooterComponent={renderFooter}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={onRefresh}
      />
    </UniversalView>
  )
}


const MyTask = ({
  id,
  index,
  title,
  finished = false,
  score = 0,
  onPress = () => undefined
}) => {
  return(
    <View style={task.container}>
      <Text style={task.title}>{title}</Text>
      {
        finished ? 
        <Text style={task.score}>{wordLocalization(strings['Вы набрали :score баллов'], { score: score })}</Text>
        : null
      }
      <Divider isAbsolute={false} style={task.divider}/>
      <RowView>
        {
          finished ?
          <View style={[task.icon, { backgroundColor: "green" , paddingHorizontal: 5 }]}>
            {check()}
          </View> :
          <View style={task.icon}>
            <PlayIcon size={0.6}/>
          </View>
        }
        {
          finished ? 
          <TextButton
            onPress={() => onPress(id)}
            style={task.button}
            textStyle={[task.buttonText, { color: "green" }]}
            text={strings['Задание завершено']}
          /> :
          <TextButton
            onPress={() => onPress(id)}
            style={task.button}
            textStyle={task.buttonText}
            text={strings['Пройти задание']}
          />
        }
      </RowView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: "center",
    alignItems: 'center'
  }
})

const task = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.border
  },
  title: {
    ...setFontStyle(17, "600"),
    marginBottom: 5
  },
  score: {
    ...setFontStyle(13, "500", APP_COLORS.placeholder),
  },
  divider: {
    marginVertical: 8,
    height: 0.18,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    marginRight: 6
  },
  button: {
    marginTop: 0
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
})

export default MyTasksTab