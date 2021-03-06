import React, { useState, useEffect, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/sass/styles.scss'
import ImageGallery from 'react-image-gallery'
import '../../node_modules/react-image-gallery/styles/css/image-gallery.css'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Columns from 'react-bulma-components/lib/components/columns'
import Heading from 'react-bulma-components/lib/components/heading'
import CommunityNavbar from '../components/communityNavbar'
import Button from 'react-bulma-components/lib/components/button'
import { Select, Control } from 'react-bulma-components/lib/components/form'
import Image from 'react-bulma-components/lib/components/image'
import Message from 'react-bulma-components/lib/components/message'
import Card from 'react-bulma-components/lib/components/card'
import Media from 'react-bulma-components/lib/components/media'
import Content from 'react-bulma-components/lib/components/content'
import Modal from 'react-bulma-components/lib/components/modal'
import Section from 'react-bulma-components/lib/components/section'

import {
  Edit,
  Home,
  Users,
  Mail,
  Phone,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  CreditCard,
  RefreshCw,
  Coffee
} from 'react-feather'

export default function CommunityHome(props) {
  let history = useHistory()
  const [description, setDescription] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const token = localStorage.getItem('token')
  const [coordinators, setCoordinators] = useState([])

  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'))
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'))
  const [date, setDate] = useState()
  const localizer = momentLocalizer(moment)

  const [events, setEvents] = useState([])

  const [showWelcomeCard, setShowWelcomeCard] = useState(true)
  const [showLeaders, setShowLeaders] = useState(true)

  const [displayCalendar, setDisplayCalendar] = useState(false)
  const [displayFamilyUpdates, setDisplayFamilyUpdates] = useState(false)
  const [displayWaysToHelp, setDisplayWaystoHelp] = useState(false)
  const [displayMessageBoard, setDisplayMessageBoard] = useState(false)
  const [displayPhotoGallery, setDisplayPhotoGallery] = useState(false)
  const [displayWellWishes, setDisplayWellWishes] = useState(false)

  const [wellWishes, setWellWishes] = useState([])
  const [familyUpdates, setFamilyUpdates] = useState([])
  const [messageBoard, setMessageBoard] = useState([])
  const [waystoHelp, setWaysToHelp] = useState('')
  const [photoGallery, setPhotoGallery] = useState('')

  const [userRole, setUserRole] = useState('')
  const [showLeaveCommunityModal, setShowLeaveCommunityModal] = useState(false)

  const years = [...Array(15).keys()].map((i) => i + 2020)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  var linkStyle = {
    fontSize: '0.8em',
  }

  var containerStyle = {
    margin: '5% 5%',
    maxWidth: '100%',
  }

  var noteStyle = {
    fontSize: '0.75rem',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'hsl(0, 0%, 96%)',
    borderRadius: '10px',
  }

  //adds volunteer to activity
  const removeCommunityMember = useCallback(() => {
    const param = JSON.stringify({
      community: localStorage.getItem('community-id'),
      user: localStorage.getItem('email'),
    })

    axios
      .post('/remove-user-from-community/', param, {
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(
        (response) => {
          history.push('/my-communities')
        },
        (error) => {
          console.log(error)
        }
      )
  }, [token])

  function updateDate() {
    setDate(moment(`${selectedMonth} ${selectedYear}`, 'MMMM YYYY').toDate())
  }

  // function processEvents(data) {
  //   let tempData = [];
  //   data.forEach((activity) => {
  //     if (activity['is_active'] && typeof activity['start_time'] === 'string') {
  //       activity['start_time'] = new Date(activity['start_time'])
  //       activity['end_time'] = new Date(activity['end_time'])
  //       tempData.push(activity)
  //     }
  //   })
  //   setEvents(tempData)
  // }
  function processEvents(data) {
    let tempData = [];
    data.forEach((activity) => {
      if (activity['is_active']) {
        if (typeof activity['start_time'] === 'string') {
        var timezone_offset = new Date(
          activity['start_time']
        ).getTimezoneOffset()
        activity['start_time'] = moment(activity['start_time'])
          .add(timezone_offset, 'm')
          .toDate()
        activity['end_time'] = moment(activity['end_time'])
          .add(timezone_offset, 'm')
          .toDate()
       }
      tempData.push(activity)
      }
    })
    setEvents(tempData)
  }

  useEffect(() => {
    axios
      .get('/one-community/', {
        headers: {
          Authorization: `JWT ${token}`,
        },
        params: {
          pk: localStorage.getItem('community-id'),
        },
      })
      .then(
        (response) => {
          setDescription(response.data[0].description)
          setShowLeaders(response.data[0].display_leaders_on_home_page)
          setProfilePhoto(response.data[0].photo_file)
          if (response.data[0].home_page_highlight === 'Calendar') {
            setDisplayCalendar(true)
          } else if (
            response.data[0].home_page_highlight === 'Family Updates'
          ) {
            setDisplayFamilyUpdates(true)
            axios
              .get('/announcement', {
                headers: {
                  Authorization: `JWT ${token}`,
                },
                params: {
                  name: localStorage.getItem('community-name'),
                  zipcode: localStorage.getItem('community-zipcode'),
                  is_closed: localStorage.getItem('community-is-closed'),
                },
              })
              .then(
                (response) => {
                  setFamilyUpdates(response.data)
                },
                (error) => {
                  console.log(error)
                }
              )
          } else if (response.data[0].home_page_highlight === 'Ways to Help') {
            setDisplayWaystoHelp(true)
            setWaysToHelp(response.data[0].ways_to_help)
          } else if (response.data[0].home_page_highlight === 'Message Board') {
            setDisplayMessageBoard(true)
            axios
              .get('/messages/', {
                headers: {
                  Authorization: `JWT ${token}`,
                },
                params: {
                  name: localStorage.getItem('community-name'),
                  zipcode: localStorage.getItem('community-zipcode'),
                  is_closed: localStorage.getItem('community-is-closed'),
                },
              })
              .then(
                (response) => {
                  setMessageBoard(response.data)
                },
                (error) => {
                  console.log(error)
                }
              )
          } else if (response.data[0].home_page_highlight === 'Photo Gallery') {
            setDisplayPhotoGallery(true)
            axios
              .get('/photos', {
                headers: {
                  Authorization: `JWT ${token}`,
                },
                params: {
                  name: localStorage.getItem('community-name'),
                  zipcode: localStorage.getItem('community-zipcode'),
                  is_closed: localStorage.getItem('community-is-closed'),
                },
              })
              .then(
                (response) => {
                  var gallery = []

                  response.data.forEach((p) => {
                    gallery.push({
                      original: p.photo.split('?')[0],
                      thumbnail: p.photo.split('?')[0],
                      originalTitle: p.title,
                      thumbnailTitle: p.title,
                      description: p.description,
                    })
                  })
                  setPhotoGallery(gallery)
                },
                (error) => {
                  console.log(error)
                }
              )
          } else if (response.data[0].home_page_highlight === 'Well Wishes') {
            setDisplayWellWishes(true)
            axios
              .get('/well-wishes', {
                headers: {
                  Authorization: `JWT ${token}`,
                },
                params: {
                  name: localStorage.getItem('community-name'),
                  zipcode: localStorage.getItem('community-zipcode'),
                  is_closed: localStorage.getItem('community-is-closed'),
                },
              })
              .then(
                (response) => {
                  setWellWishes(response.data)
                },
                (error) => {
                  console.log(error)
                }
              )
          }
        },
        (error) => {
          console.log(error)
        }
      )
  }, [token])

  useEffect(() => {
    axios
      .get(`/community-coordinators/${localStorage.getItem('community-id')}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then(
        (response) => {
          const options = response.data.map((item) => ({
            label: `${item['first_name']} ${item['last_name']}`,
            value: item['id'],
            email: item['email'],
            phone: item['phone_number_1'],
          }))
          setCoordinators(options)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [token])

  useEffect(() => {
    axios
      .get(`/activities/${localStorage.getItem('community-id')}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`,
        },
      })
      .then(
        (response) => {
          processEvents(response.data)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  useEffect(() => {
    axios
      .get('/community-people/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        params: JSON.stringify({
          user: localStorage.getItem('email'),
          community: localStorage.getItem('community-name'),
        }),
      })
      .then(
        (response) => {
          localStorage.setItem('user-role', response.data.user_role)
          setUserRole(response.data.user_role)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  const WelcomeCardStaff = (
    <Message color='primary'>
      <Message.Header>
        Welcome!
        <Button remove onClick={() => setShowWelcomeCard(false)} />
      </Message.Header>
      <Message.Body>
        Here are our top <b>3 tips</b> for getting started:
        <br />
        1. <Link to='/add-people'>Invite</Link> members to join this community
        <br />
        2. Create a <Link to='/create-new-activity'>Calendar Activity</Link> to
        let members volunteer
        <br />
        3. Add an <Link to='/create-announcement'>Update</Link> to keep friends
        and family in the loop
      </Message.Body>
    </Message>
  )

  const WelcomeCardMember = (
    <Message color='primary'>
      <Message.Header>
        Welcome!
        <Button remove onClick={() => setShowWelcomeCard(false)} />
      </Message.Header>
      <Message.Body>
        Here are our top <strong>3 tips</strong> for getting started:
        <br />
        1. <Link to='/add-people'>Tell your friends</Link> to join this
        community
        <br />
        2. View your <Link to='/calendar'>calendar</Link> activities
        <br />
        3. View <Link to='/announcements'>updates</Link> recently made to this
        care community
      </Message.Body>
    </Message>
  )

  const calendar = (
    <div>
      <Control>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {months.map((month, index) => (
            <option value={month} key={index}>
              {month}
            </option>
          ))}
        </Select>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {years.map((year, index) => (
            <option value={year} key={index}>
              {year}
            </option>
          ))}
        </Select>
        <Button
          onClick={updateDate}
          style={{ color: 'white', backgroundColor: '#2C8595' }}
        >
          <RefreshCw size={12} style={{ marginRight: '5px' }} /> Go
        </Button>
      </Control>
      <br />
      <div
        className='rbc-calendar'
        style={{ height: '50%', marginBottom: '3%' }}
      >
        <Calendar
          localizer={localizer}
          style={{ height: 450 }}
          toolbar={false}
          date={date}
          onNavigate={(date) => setDate(date)}
          events={events}
          startAccessor='start_time'
          endAccessor='end_time'
          allDayAccessor='all_day'
          popup={true}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
        />
      </div>
    </div>
  )

  const wellWishesContainer = (
    <div>
      {wellWishes
        .slice()
        .reverse()
        .map((a, index) => {
          return (
            <Card key={index} style={{ marginBottom: '5%' }}>
              <Card.Content>
                <Media.Item style={{ marginBottom: '2%' }}>
                  <Heading subtitle size={6}>
                    <b>{a.author_name}</b> posted in{' '}
                    <b className='has-theme-color'>Well Wishes</b>
                  </Heading>
                  <Heading size={4}>{a.subject}</Heading>
                </Media.Item>
                <Content>
                  <div dangerouslySetInnerHTML={{ __html: a.message }}></div>
                </Content>
                <p style={{ fontSize: '80%' }} className='has-text-grey'>
                  {a.date_time}
                </p>
              </Card.Content>
            </Card>
          )
        })}
    </div>
  )

  const waysToHelpContainer = (
    <Card style={{ marginBottom: '5%' }}>
      <Card.Content>
        <Media.Item style={{ marginBottom: '2%' }}>
          <Heading size={4}>Ways to Help</Heading>
        </Media.Item>
        <Content>
          <div dangerouslySetInnerHTML={{ __html: waystoHelp }}></div>
        </Content>
      </Card.Content>
    </Card>
  )

  const familyUpdatesContainer = (
    <div>
      {familyUpdates
        .slice()
        .reverse()
        .map((a, index) => {
          return (
            <Card key={index} style={{ marginBottom: '5%' }}>
              <Card.Content>
                <Media.Item style={{ marginBottom: '2%' }}>
                  <Heading subtitle size={6}>
                    <b>{a.author_name}</b> posted in{' '}
                    <b className='has-theme-color'>Family Updates</b>
                  </Heading>
                  <Heading size={4}>{a.subject}</Heading>
                </Media.Item>
                <Content>
                  <div dangerouslySetInnerHTML={{ __html: a.message }}></div>
                </Content>
                <p style={{ fontSize: '80%' }} className='has-text-grey'>
                  {a.date_time}
                </p>
              </Card.Content>
            </Card>
          )
        })}
    </div>
  )

  const messageBoardContainer = (
    <div>
      {messageBoard.length > 0 ? (
        messageBoard
          .slice()
          .reverse()
          .map((a, index) => {
            return (
              <Card key={index} style={{ marginBottom: '5%' }}>
                <Card.Content>
                  <Media.Item style={{ marginBottom: '2%' }}>
                    <Heading subtitle size={6}>
                      <b>{a.author_name}</b> posted in{' '}
                      <b className='has-theme-color'>Message Board</b>
                    </Heading>
                    <Heading size={4}>{a.subject}</Heading>
                  </Media.Item>
                  <Content>
                    <div dangerouslySetInnerHTML={{ __html: a.message }}></div>
                  </Content>
                  <p style={{ fontSize: '80%' }} className='has-text-grey'>
                    {a.date_time}
                  </p>
                </Card.Content>
              </Card>
            )
          })
      ) : (
        <p style={noteStyle}>
          <Coffee size={100} color='#E5E5E5' />
          <br />
          <br />
          Sit tight! Nothing has been posted on the Message Board yet.
        </p>
      )}
  </div>
  )

  const photoGalleryContainer = (
    <div>
      {photoGallery.length === 0 ? (
        <p style={noteStyle}>No photos have been added to this gallery.</p>
      ) : (
        <ImageGallery
          items={photoGallery}
          thumbnailPosition='right'
          autoPlay={true}
        />
      )}
    </div>
  )

  return (
    <div>
      <CommunityNavbar />
      <Container style={containerStyle}>
        <Columns isMultiline={true}>
          <Columns.Column size={3}>
            <Box>
              <Image src={profilePhoto} style={{ marginBottom: '7%' }} />
              <br />
              <Heading size={6}>
                <Home size={12} /> About Community
              </Heading>
              <p style={{ fontSize: '0.8em' }}>{description}</p>
              <hr />
              {showLeaders && coordinators.length !== 0 ? (
                <div>
                  <Heading size={6}>
                    <Users size={12} /> Community Heads
                  </Heading>
                  {coordinators.map((c, index) => (
                    <div style={{ marginBottom: '10px' }} key={index}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.8em' }}>
                        {c.label}
                      </p>
                      <p style={linkStyle}>
                        <Mail size={10} style={{ margin: '0 5px' }} />
                        <a
                          href={'mailto:' + c.email}
                          className='has-theme-color'
                        >
                          {c.email}
                        </a>
                      </p>
                      <p style={{ fontSize: '0.8em' }}>
                        {' '}
                        <Phone size={10} style={{ margin: '0 5px' }} />
                        {c.phone}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
              {localStorage.getItem('user-role') === 'Administrator' ? (
                <div>
                  <hr />
                  <Button color='primary'>
                    <Link to='/edit-community' style={{ color: 'white' }}>
                      <Edit size={12} /> Edit Community
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <hr />
                  <Button
                    onClick={() => setShowLeaveCommunityModal(true)}
                    style={{
                      boxShadow: '1px 1px 3px 2px rgba(0,0,0,0.1)',
                    }}
                    color='primary'
                  >
                    Leave community
                  </Button>
                  <Modal
                    show={showLeaveCommunityModal}
                    onClose={() => setShowLeaveCommunityModal(false)}
                    closeOnBlur={true}
                  >
                    <Modal.Card>
                      <Modal.Card.Head
                        onClose={() => setShowLeaveCommunityModal(false)}
                      >
                        <Modal.Card.Title>Leave Community</Modal.Card.Title>
                      </Modal.Card.Head>
                      <Section style={{ backgroundColor: 'white' }}>
                        Are you sure you want to leave this community? You can't
                        undo this action.
                      </Section>
                      <Modal.Card.Foot
                        style={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Button
                          onClick={() => setShowLeaveCommunityModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          color='primary'
                          onClick={() => removeCommunityMember()}
                        >
                          Leave Community
                        </Button>
                      </Modal.Card.Foot>
                    </Modal.Card>
                  </Modal>
                </div>
              )}
            </Box>
          </Columns.Column>
          <Columns.Column size={7}>
            {showWelcomeCard &&
              (localStorage.getItem('is-staff') === 'true'
                ? WelcomeCardStaff
                : WelcomeCardMember)}
            {/* What to show depends on what the user specified for homepage highlight in edit community */}
            {displayCalendar && calendar}
            {displayWellWishes && wellWishesContainer}
            {displayFamilyUpdates && familyUpdatesContainer}
            {displayMessageBoard && messageBoardContainer}
            {displayWaysToHelp && waysToHelpContainer}
            {displayPhotoGallery && photoGalleryContainer}
          </Columns.Column>
          <Columns.Column size={2}>
            {userRole === 'Administrator' ? (
              <Link to='/create-new-activity' style={{ color: 'white' }}>
                <Button color='primary' className='is-fullwidth'>
                  <div>
                    <CalendarIcon size={12} style={{ marginRight: '5px' }} />
                    Create Activity
                  </div>
                </Button>
              </Link>
            ) : (
              <Link to='#' style={{ color: 'white' }}>
                <div>
                  <Button color='primary' className='is-fullwidth'>
                    My Activities
                  </Button>
                </div>
              </Link>
            )}
            <a
              href='https://www.heretoserve.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                className='is-primary is-inverted'
                style={{
                  marginTop: '1rem',
                  boxShadow: '1px 1px 3px 2px rgba(0,0,0,0.1)',
                }}
                fullwidth={true}
              >
                <div>
                  <LinkIcon size={12} style={{ marginRight: '5px' }} />
                  Here to Serve
                </div>
              </Button>
            </a>
            <a
              href='https://heretoserve.salsalabs.org/secureonlinedonationform/index.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                className='is-primary is-inverted'
                style={{
                  marginTop: '1rem',
                  boxShadow: '1px 1px 3px 2px rgba(0,0,0,0.1)',
                }}
                fullwidth={true}
              >
                <div>
                  <CreditCard size={12} style={{ marginRight: '5px' }} />
                  Donate Now!
                </div>
              </Button>
            </a>
            <br />
          </Columns.Column>
        </Columns>
      </Container>
    </div>
  )
}
