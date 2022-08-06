import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Descriptions, Tag, Carousel, Image } from 'antd'
import { searchResult } from './interfaces'
import { BASE_URL } from './constants'
function Show() {
  const { nasaId } = useParams()
  const [result, setResult] = useState<searchResult | null>(null)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    axios.get(`${BASE_URL}search?nasa_id=${nasaId}`).then((res) => {
      const result = res.data.collection.items[0]
      setResult(result)
      axios.get(result.href).then((res) => {
        const result = res.data
        const uniqueImages: any = {}
        result
          .filter((image: string) => image.endsWith('.jpg'))
          .forEach((image: string) => {
            const imageBase = image.split('~')[0]
            if (!uniqueImages[imageBase]) {
              uniqueImages[imageBase] = image
            }
          })
        setImages(Object.values(uniqueImages))
      })
    })
  }, [nasaId])

  return (
    <div className="container">
      {result?.links && (
        <Descriptions title={result.data[0].title} bordered column={{ xs: 1, sm: 1, md: 3 }} layout="vertical">
          <Descriptions.Item label="Images" style={{ width: '500px' }}>
            <Carousel>
              {images.map((image: string) => (
                <Image key={image} src={image} alt={result.data[0].title} />
              ))}
            </Carousel>
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {result.data[0].keywords
              ? result.data[0].keywords.map((tag: string) => <Tag key={tag}>{tag}</Tag>)
              : 'No Tag'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">{result.data[0].center || 'No Location'}</Descriptions.Item>
          <Descriptions.Item label="Photographer">{result.data[0].photographer || 'No Photographer'}</Descriptions.Item>
          <Descriptions.Item label="Description">{result.data[0].description || 'No Description'}</Descriptions.Item>
          <Descriptions.Item label="Date">
            {result.data[0].date_created ? new Date(result.data[0].date_created).toLocaleString() : 'No Date'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  )
}
export default Show
