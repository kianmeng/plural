import React, { useContext, useEffect } from 'react'
import { Loading } from 'forge-core'
import { useQuery } from 'react-apollo'
import { QUEUES, UPGRADE_QUEUE_SUB } from './queries'
import { useHistory } from 'react-router'
import { Box, Text } from 'grommet'
import { Provider } from '../repos/misc'

import { Github, Upgrade } from 'grommet-icons'
import { BreadcrumbsContext } from '../Breadcrumbs'
import { QueueHealth } from './QueueHealth'

function Queue({q}) {
  let hist = useHistory()
  return (
    <Box flex={false} pad='small' onClick={() => hist.push(`/upgrades/${q.id}`)} hoverIndicator='light-2'
         border={{side: 'bottom', color: 'light-4'}} direction='row' gap='small' align='center' fill='horizontal'>
      <Provider provider={q.provider} width={40} />
      <Box fill='horizontal' gap='xsmall'>
        <Box direction='row' gap='xsmall' align='center'>
          <Text size='small' weight={500}>{q.name || 'default'}</Text>
          <Text size='small' color='dark-3'>{q.domain}</Text>
        </Box>
        {q.git && (
          <Box direction='row' gap='xsmall' align='center'>
            <Github size='14px' />
            <Text size='small' color='dark-3'>{q.git}</Text>
          </Box>
        )}
      </Box>
      <QueueHealth queue={q} />
    </Box>
  )
}

export function UpgradeQueues() {
  const {data, subscribeToMore} = useQuery(QUEUES, {fetchPolicy: 'cache-and-network'})

  useEffect(() => subscribeToMore({
    document: UPGRADE_QUEUE_SUB,
    updateQuery: ({upgradeQueues, ...prev}, {subscriptionData: {data: {upgradeQueueDelta: {delta, payload}}}}) => {
      return delta === 'CREATE' ? {...prev, upgradeQueues: [payload, ...upgradeQueues]} :  prev
    }
  }), [])


  const {setBreadcrumbs} = useContext(BreadcrumbsContext)
  useEffect(() => {
    setBreadcrumbs([{url: `/upgrades`, text: 'upgrades'}])
  }, [setBreadcrumbs])

  if (!data) return <Loading />

  return (
    <Box fill>
      <Box flex={false} pad='small' direction='row' align='center' gap='xsmall' border={{side: 'bottom', color: 'light-5'}}>
        <Upgrade size='15px' />
        <Text size='small' weight={500}>Upgrade Queues</Text>
      </Box>
      <Box fill>
        {data.upgradeQueues.map((q) => <Queue key={q.id} q={q} />)}
      </Box>
    </Box>
  )

}