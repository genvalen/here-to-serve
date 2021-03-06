import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  Field,
  Input,
  Control,
} from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Container from 'react-bulma-components/lib/components/container'
import Heading from 'react-bulma-components/lib/components/heading'
import Notification from 'react-bulma-components/lib/components/notification'

import CheckboxField from '../components/checkboxfield'

export default function Login(props) {
  // Non-bulma styles
  var containerStyle = {
    margin: '5% auto',
    maxWidth: '450px',
    padding: '4rem',
    border: '0.1rem solid #E5E5E5',
    borderRadius: '1rem',
  }
  var notifStyle = {
    backgroundColor: 'white',
    padding: '.25rem .5rem .25rem .5rem',
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [validForm, setValidForm] = useState(false)
  const [invalid, setInvalid] = useState(false)

  let history = useHistory()
  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('token') !== 'undefined' &&
      localStorage.getItem('token') !== undefined
    ) {
      history.push('/my-communities')
    }
  })

  function handleRememberMe() {
    setRememberMe(!rememberMe)
  }

  useEffect(() => {
    const formValues = [email, password]
    const notValidForm = formValues.some((formVal) => {
      return formVal === ''
    })
    setValidForm(notValidForm)
  }, [email, password])

  return (
    <Container style={containerStyle}>
      <Heading size={4}>Log in to Here to Serve</Heading>
      <Field>
        <Control>
          <Input
            value={email}
            type='email'
            placeholder='Email Address'
            onChange={(e) => setEmail(e.target.value)}
          />
        </Control>
      </Field>

      <Field>
        <Input
          value={password}
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Field>
        <CheckboxField text={'Remember me'} onChange={handleRememberMe} />
      </Field>
      <Button
        style={{ marginBottom: '1rem' }}
        color='primary'
        fullwidth={true}
        onClick={() => props.handle_login(email, password, rememberMe)}
        disabled={validForm}
      >
        LOGIN
      </Button>
      <div class='notification is-danger' hidden={!invalid}>
        Incorrect username or password.
      </div>
      <Notification style={notifStyle}>
        <Link to='/forgot-password'>Forgot Password?</Link> or{' '}
        <Link to='/register'>Create Account</Link>
      </Notification>
    </Container>
  )
}

Login.propTypes = {
  handle_login: PropTypes.func.isRequired,
  logged_in: PropTypes.bool.isRequired,
}
