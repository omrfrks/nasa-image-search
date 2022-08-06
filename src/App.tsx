import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input, Dropdown, Menu, Button, Divider, Card, Alert, Col, Row, Skeleton, Pagination } from 'antd'
import { HomeOutlined, CameraOutlined } from '@ant-design/icons'
import { generateYearsBetween, currentYear } from './utils'
import { Link } from 'react-router-dom'
import { searchResults } from './interfaces'
import { BASE_URL } from './constants'

const { Search } = Input

function App() {
  const setYears = (type: string, key: string) => {
    const selectedYear = Number(key)
    if (type === 'start') {
      setSelectedStartYear(selectedYear)
      setEndYears(createYearsMenu(selectedYear, currentYear, 'end'))
    } else {
      setSelectedEndYear(selectedYear)
      setStartYears(createYearsMenu(1900, selectedYear, 'start'))
    }
  }

  const createYearsMenu = (start: number, end: number, type: string) => {
    const years = generateYearsBetween(start, end)
    const items = years.map((year) => {
      return { label: year, key: year }
    })
    return <Menu items={items} onClick={(e) => setYears(type, e.key)} />
  }

  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<searchResults | null>(null)
  const [searchResultsLoading, setSearchResultsLoading] = useState(false)
  const [searchResultsError, setSearchResultsError] = useState('')
  const [selectedStartYear, setSelectedStartYear] = useState(1900)
  const [selectedEndYear, setSelectedEndYear] = useState(currentYear)
  const [startYears, setStartYears] = useState(createYearsMenu(1900, currentYear, 'start'))
  const [endYears, setEndYears] = useState(createYearsMenu(1900, currentYear, 'end'))

  // if user gets back to the page, get the latest search results
  useEffect(() => {
    window.onpopstate = () => {
      setSearchResults(
        localStorage.getItem('searchResults') ? JSON.parse(localStorage.getItem('searchResults') as string) : {}
      )
    }
  }, [])

  const onPaginationChange = (page: number) => {
    if (searchResultsError) {
      setSearchResultsError('')
    }
    setSearchResultsLoading(true)
    if(searchResults && !searchResults.href.includes('https')) {
      searchResults.href = searchResults.href.replace('http://','https://')
      setSearchResults(searchResults)
    }
    axios
      .get(`${searchResults && searchResults.href}&page=${page}`)
      .then((res) => {
        setSearchResults(res.data.collection)
        setSearchResultsLoading(false)
      })
      .catch((err) => {
        setSearchResultsError(err.message)
        setSearchResultsLoading(false)
      })
  }

  const onSearch = (value: string) => {
    if (value === '') {
      return
    }
    if (searchResultsError) {
      setSearchResultsError('')
    }
    setSearchValue(value)
    setSearchResultsLoading(true)
    const url = `${BASE_URL}search?q=${value}&media_type=image&year_start=${selectedStartYear}&year_end=${selectedEndYear}`
    axios
      .get(url)
      .then((res) => {
        const results = res.data.collection
        setSearchResults(results)
        localStorage.setItem('searchResults', JSON.stringify(results))
        setSearchResultsLoading(false)
        if (results.items.length === 0) {
          setSearchResultsError('No results found')
        }
      })
      .catch((err) => {
        setSearchResultsError(err.response?.data.reason)
        setSearchResultsLoading(false)
      })
  }

  return (
    <div className="App">
      <Search placeholder="Search for nasa images" onSearch={onSearch} enterButton />
      <Dropdown
        overlay={startYears}
        trigger={['click']}
        overlayStyle={{ maxHeight: '30vh', overflowY: 'scroll', border: '1px solid #40a9ff' }}
      >
        <Button>{selectedStartYear}</Button>
      </Dropdown>
      <Dropdown
        overlay={endYears}
        trigger={['click']}
        overlayStyle={{ maxHeight: '30vh', overflowY: 'scroll', border: '1px solid #40a9ff' }}
      >
        <Button>{selectedEndYear}</Button>
      </Dropdown>
      {searchResults && searchResults.items?.length > 0 && (
        <Divider>
          Search Results {searchValue ? 'for ' + searchValue : ''} between {selectedStartYear} and {selectedEndYear}{' '}
          years
        </Divider>
      )}
      {searchResultsError && <Alert message={searchResultsError} type="error" />}
      <Row gutter={16}>
        {searchResultsLoading &&
          Array(12)
            .fill(0)
            .map((_, i) => (
              <Col key={i} xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card
                  hoverable
                  style={{
                    width: 300,
                    height: 500,
                    display: 'inline-block',
                    margin: '10px',
                    textAlign: 'left',
                    overflowWrap: 'anywhere',
                  }}
                  cover={<Skeleton.Image />}
                >
                  <Skeleton active />
                </Card>
              </Col>
            ))}
        {searchResults &&
          searchResults.items &&
          searchResults.items.map((result: any) => {
            return (
              <Col xs={24} sm={24} md={8} lg={8} xl={8} key={result.data[0].nasa_id}>
                <Link to={`/show/${result.data[0].nasa_id}`}>
                  <Card
                    hoverable
                    style={{
                      width: 400,
                      height: 500,
                      display: 'inline-block',
                      margin: '10px',
                      textAlign: 'left',
                      overflowWrap: 'anywhere',
                    }}
                    cover={<img alt={result.data[0].description} src={result.links[0].href} height="200" />}
                  >
                    <h2>{result.data[0].title}</h2>
                    <Divider />
                    <span>
                      <HomeOutlined /> {result.data[0].center || 'No Data'}
                    </span>
                    <Divider />
                    <span>
                      <CameraOutlined /> {result.data[0].photographer || 'No Data'}
                    </span>
                  </Card>
                </Link>
              </Col>
            )
          })}
      </Row>
      {searchResults && searchResults.metadata?.total_hits > 0 && (
        <Pagination
          onChange={onPaginationChange}
          showSizeChanger={false}
          total={searchResults.metadata.total_hits}
          defaultPageSize={100}
        />
      )}
    </div>
  )
}

export default App
