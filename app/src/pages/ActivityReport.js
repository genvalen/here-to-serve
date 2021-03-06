import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { Input, Select, Field, Label, Control } from 'react-bulma-components/lib/components/form'
import Container from 'react-bulma-components/lib/components/container'
import Heading from 'react-bulma-components/lib/components/heading'
import Table from 'react-bulma-components/lib/components/table'
import Columns from 'react-bulma-components/lib/components/columns'
import Button from 'react-bulma-components/lib/components/button'

import CommunityNavbar from '../components/communityNavbar'
import SideBar from '../components/sidebar'
import generatePDF from "../components/generateActivityPDFDetailed"
import generatePDFSummary from "../components/generateActivityPDFSummary"


export default function ActivityReport() {
    // Create styles
    var containerStyle = {
        margin: '5% 5%',
        maxWidth: '100%',
    }

    var formContainerStyle = {
        padding: '5%',
        border: '1px solid hsl(0, 0%, 86%)',
        borderRadius: '10px',
    }

    var noteStyle = {
        color: '#E5E5E5',
        fontStyle: 'italic',
        margin: '15px',
    }

    const activityTypes = [
        'Filter by Activity Type',
        'Giving Rides',
        'Preparing Meals',
        'Shopping',
        'Childcare',
        'Pet Care',
        'House Cleaning',
        'Laundry',
        'Visits',
        'Miscellaneous',
        'Occasion'
    ]

    const years = Array.from(Array(5).keys()).map((y) => (y + (new Date().getFullYear())))
    const count = Array.from(Array(51).keys()).slice(1, 51)

    const monthMap = new Map()
    monthMap['January'] = 1
    monthMap['February'] = 2
    monthMap['March'] = 3
    monthMap['April'] = 4
    monthMap['May'] = 5
    monthMap['June'] = 6
    monthMap['July'] = 7
    monthMap['August'] = 8
    monthMap['September'] = 9
    monthMap['October'] = 10
    monthMap['November'] = 11
    monthMap['December'] = 12

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

    // Date range
    const [startMonth, setStartMonth] = useState(months[new Date().getMonth()])
    const [startDay, setStartDay] = useState(new Date().getDate())
    const [startYear, setStartYear] = useState(new Date().getFullYear() - 1)
    const [endMonth, setEndMonth] = useState(months[new Date().getMonth()])
    const [endDay, setEndDay] = useState(new Date().getDate())
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 1)

    const [activities, setActivities] = useState([])
    const [search, setSearch] = useState('')
    const [selectedActivityType, setSelectedActivityType] = useState('Filter by Activity Type')
    const moment = extendMoment(Moment);

    const [activitySummaries, setActivitySummaries] = useState([])

    useEffect(() => {
        axios
            .get(`/activities/${localStorage.getItem('community-id')}`, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                },
            })
            .then(
                (response) => {
                    setActivities(response.data)
                },
                (error) => {
                    console.log(error)
                }
            )
    }, [])

    const isDateWithinRange = useCallback((date) => {
        // Might need to offset date from UTC to actual timezone
        var dateFormatted = moment(date.substr(0, 10), 'YYYY-MM-DD')
        var startDate = moment(startYear + '-' + monthMap[startMonth] + '-' + startDay, 'YYYY-MM-DD')
        var endDate = moment(endYear + '-' + monthMap[endMonth] + '-' + endDay, 'YYYY-MM-DD')
        var range = moment().range(startDate, endDate)
        return range.contains(dateFormatted)
    }, [startDay, startMonth, startYear, endDay, endMonth, endYear])


    useEffect(() => {
        var startMonthNumeral =  monthMap[startMonth] 
        var startTimeString = startYear + '-' + startMonthNumeral + '-' + startDay + 'T12:00:00Z'
        var endMonthNumeral =  monthMap[endMonth]
        var endTimeString = endYear + '-' + endMonthNumeral + '-' + endDay + 'T12:00:00Z'
    
        const parameters = JSON.stringify({
            start_date: startTimeString,
            end_date: endTimeString,
            activity_type: selectedActivityType
        })
        var url = `/activity-summary/${localStorage.getItem('community-id')}/?start_date=${startTimeString}&end_date=${endTimeString}&activity_type=${selectedActivityType}`
        console.log(url)

        axios
            .get(url, {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(
                (response) => {
                    setActivitySummaries(response.data)
                },
                (error) => {
                    console.log(error)
                }
            )
      }, [startDay, startMonth, startYear, endDay, endMonth, endYear, selectedActivityType])

    return (
        <div>
            <CommunityNavbar />
            <Container style={containerStyle}>
                <Columns isMultiline={true}>
                    <Columns.Column size={3}>
                        <SideBar />
                    </Columns.Column>
                    <Columns.Column size={9}>
                        <Columns>
                            <Columns.Column size={4}>
                                <Heading size={4}>Activity Report</Heading>
                            </Columns.Column>
                            <Columns.Column size={4}>
                                <Button
                                    style={{
                                        boxShadow: '1px 1px 3px 2px rgba(0,0,0,0.1)',
                                    }}
                                    color='primary'
                                    fullwidth={true}
                                    onClick={() => generatePDF
                                        (
                                            activities,
                                            {
                                                'start_day': startDay,
                                                'start_month': startMonth,
                                                'start_year': startYear,
                                                'end_day': endDay,
                                                'end_month': endMonth,
                                                'end_year': endYear,
                                                'search': search,
                                                'activity_type': selectedActivityType,
                                            }
                                        )
                                    }
                                >
                                    Export Report PDF (Detailed)
                                </Button>
                            </Columns.Column>
                            <Columns.Column size={4}>
                                <Button
                                    style={{
                                        boxShadow: '1px 1px 3px 2px rgba(0,0,0,0.1)',
                                    }}
                                    color='primary'
                                    fullwidth={true}
                                    onClick={() => generatePDFSummary
                                        (
                                            activitySummaries,
                                            {
                                                'start_day': startDay,
                                                'start_month': startMonth,
                                                'start_year': startYear,
                                                'end_day': endDay,
                                                'end_month': endMonth,
                                                'end_year': endYear,
                                                'search': search,
                                                'activity_type': selectedActivityType,
                                            }
                                        )
                                    }
                                >
                                    Export Report PDF (Summary)
                                </Button>
                            </Columns.Column>
                        </Columns>
                        <Container style={formContainerStyle}>
                            <Columns>
                                <Columns.Column size={8}>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder='Search activities by name'
                                        style={{ marginBottom: '3%' }}
                                    />
                                </Columns.Column>
                                <Columns.Column size={4}>
                                    <Field>
                                        <Control>
                                            <Select
                                                onChange={(e) => setSelectedActivityType(e.target.value)}
                                                name='selectedActivityType'
                                                value={selectedActivityType}
                                            >
                                                {activityTypes.map((type) => (<option>{type}</option>))}
                                            </Select>
                                        </Control>
                                    </Field>
                                </Columns.Column>
                            </Columns>
                            <Columns style={{ marginTop: '-3%', marginBottom: '3%' }}>
                                <Columns.Column size={5}>
                                    <Field>
                                        <Label>Start Date</Label>
                                        <Control>
                                            <Select
                                                onChange={(e) => setStartMonth(e.target.value)}
                                                name='startMonth'
                                                value={startMonth}
                                                style={{ marginRight: '10px' }}
                                            >
                                                {months.map((m) => (
                                                    <option>{m}</option>
                                                ))}
                                            </Select>
                                            <Select
                                                onChange={(e) => setStartDay(e.target.value)}
                                                name='startDay'
                                                value={startDay}
                                                style={{ marginRight: '10px' }}
                                            >
                                                {count.slice(0, 31).map((d) => (
                                                    <option>{d}</option>
                                                ))}
                                            </Select>
                                            <Select
                                                onChange={(e) => setStartYear(e.target.value)}
                                                name='startYear'
                                                value={startYear}
                                            >
                                                {years.map((y) => (
                                                    <option>{y}</option>
                                                ))}
                                            </Select>
                                        </Control>
                                    </Field>
                                </Columns.Column>
                                <Columns.Column size={5}>
                                    <Field>
                                        <Label>End Date</Label>
                                        <Control>
                                            <Select
                                                onChange={(e) => setEndMonth(e.target.value)}
                                                name='endMonth'
                                                value={endMonth}
                                                style={{ marginRight: '10px' }}
                                            >
                                                {months.map((m) => (
                                                    <option>{m}</option>
                                                ))}
                                            </Select>
                                            <Select
                                                onChange={(e) => setEndDay(e.target.value)}
                                                name='endDay'
                                                value={endDay}
                                                style={{ marginRight: '10px' }}
                                            >
                                                {count.slice(0, 31).map((d) => (
                                                    <option>{d}</option>
                                                ))}
                                            </Select>
                                            <Select
                                                onChange={(e) => setEndYear(e.target.value)}
                                                name='endYear'
                                                value={endYear}
                                            >
                                                {years.map((y) => (
                                                    <option>{y}</option>
                                                ))}
                                            </Select>
                                        </Control>
                                    </Field>
                                </Columns.Column>
                            </Columns>

                            <Table id='center-table'>
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Time</th>
                                        <th>Volunteer Status</th>
                                        <th>Volunteer Time/Person</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.filter(
                                        (a) =>
                                            (search === '' || (a.title).toLowerCase().includes(search.toLowerCase()))
                                            &&
                                            (selectedActivityType === 'Filter by Activity Type' || a.activity_type === selectedActivityType)
                                            &&
                                            isDateWithinRange(a.start_time)
                                    ).length > 0 ? (
                                            activities.filter(
                                                (a) =>
                                                    (search === '' || (a.title).toLowerCase().includes(search.toLowerCase()))
                                                    &&
                                                    (selectedActivityType === 'Filter by Activity Type' || a.activity_type === selectedActivityType)
                                                    &&
                                                    (isDateWithinRange(a.start_time))
                                            )
                                                .map((a) => (
                                                    <tr key={a.id}>
                                                        <td>
                                                            <strong>{a.title}</strong> <br />{a.activity_type}
                                                        </td>
                                                        <td>
                                                            {moment(a.start_time).format('LL')}<br />
                                                            Between {moment(a.start_time).add(new Date(a.start_time).getTimezoneOffset(), 'm').format('LT')}{' '}
                                                            and {moment(a.end_time).add(new Date(a.start_time).getTimezoneOffset(), 'm').format('LT')}
                                                        </td>
                                                        <td>
                                                            {a.volunteers.length}/{a.num_volunteers_needed} volunteers
                                                        </td>
                                                        {a.activity_type !== 'Occasion' ?
                                                            (<td>{a.est_hours} hours <br />{a.est_minutes} minutes</td>) :
                                                            (<td>N/A</td>)}
                                                        {a.is_active ?
                                                            (<td> Active</td>)
                                                            :
                                                            (<td>Inactive</td>)
                                                        }
                                                    </tr>
                                                ))
                                        ) : (
                                            <p className='has-text-grey-light' style={noteStyle}>
                                                No activities match this search.
                                            </p>
                                        )}
                                </tbody>
                            </Table>
                        </Container>
                    </Columns.Column>
                </Columns>
            </Container>
        </div>
    )
}
