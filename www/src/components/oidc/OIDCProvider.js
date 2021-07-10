import React, { useState } from 'react'
import { Button } from 'forge-core'
import { Box, Text, TextInput } from 'grommet'
import { useMutation } from 'react-apollo'
import { BindingInput, sanitize } from '../accounts/Role'
import { fetchGroups, fetchUsers } from '../accounts/Typeaheads'
import { CREATE_PROVIDER } from './queries'
import { SectionPortal } from '../Explore'
import { GqlError } from '../utils/Alert'

function UrlTab({url, onClick}) {
  return (
    <Box background='light-3' round='xsmall'  pad={{vertical: '2px', horizontal: 'small'}} 
        hoverIndicator='light-5' onClick={onClick}>
      <Text size='small' weight={500}>{url}</Text>
    </Box>
  )
}

function UrlsInput({urls, setUrls}) {
  const [value, setValue] = useState('')

  return (
    <Box flex={false} fill='horizontal'>
      <Box flex={false} fill='horizontal' direction='row' gap='small' align='center'>
        <TextInput
          plain
          value={value}
          placeholder='add a redirect url'
          onChange={({target: {value}}) => setValue(value)} />
        <Button label='Add' onClick={() => setUrls([...urls, value])} />
      </Box>
      <Box flex={false} direction='row' gap='xxsmall' align='center' wrap>
        {urls.map((url) => (
          <UrlTab 
            key={url} 
            url={url} 
            onClick={() => setUrls(urls.filter((u) => u !== url))} />
        ))}
      </Box>
    </Box>
  )
}

export function ProviderForm({attributes, setAttributes, bindings, setBindings}) {
  return (
    <Box fill gap='small'>
      <UrlsInput 
        urls={attributes.redirectUris} 
        setUrls={(redirectUris) => setAttributes({...attributes, redirectUris})} />
      <Box flex={false} gap='xsmall'>
        <BindingInput
          label='user bindings'
          placeholder='search for users to add'
          bindings={bindings.filter(({user}) => !!user).map(({user: {email}}) => email)}
          fetcher={fetchUsers}
          add={(user) => setBindings([...bindings, {user}])}
          remove={(email) => setBindings(bindings.filter(({user}) => !user || user.email !== email))} />
        <BindingInput
          label='group bindings'
          placeholder='search for groups to add'
          bindings={bindings.filter(({group}) => !!group).map(({group: {name}}) => name)}
          fetcher={fetchGroups}
          add={(group) => setBindings([...bindings, {group}])}
          remove={(name) => setBindings(bindings.filter(({group}) => !group || group.name !== name))} />
      </Box>
    </Box>
  )
}

export function CreateProvider({installation}) {
  const [attributes, setAttributes] = useState({redirectUris: []})
  const [bindings, setBindings] = useState([])
  const [mutation, {loading, error}] = useMutation(CREATE_PROVIDER, {
    variables: {id: installation.id, attributes: {
      ...attributes,
      bindings: bindings.map(sanitize)
    }}
  })

  return (
    <Box fill pad='small' gap='small'>
      {error && <GqlError error={error} header='Could not create provider' />}
      <ProviderForm 
        attributes={attributes} 
        setAttributes={setAttributes}
        bindings={bindings}
        setBindings={setBindings} />
      <SectionPortal>
        <Button label='Create' loading={loading} onClick={mutation} />
      </SectionPortal>
    </Box>
  )
}

export function UpdateProvider({installation}) {
  const provider = installation.oidcProvider
  const [attributes, setAttributes] = useState({redirectUris: provider.redirectUris})
  const [bindings, setBindings] = useState(provider.bindings)

  return (
    <Box fill pad='small' gap='small'>
      {/* {error && <GqlError error={error} header='Could not update provider' />} */}
      <ProviderForm
        attributes={attributes} 
        setAttributes={setAttributes}
        bindings={bindings}
        setBindings={setBindings} />
      <SectionPortal>
        <Button label='Update' />
      </SectionPortal>
    </Box>
  )
}

export function OIDCProvider({installation}) {
  if (installation.provider) return <UpdateProvider installation={installation} />
  return <CreateProvider installation={installation} />
}