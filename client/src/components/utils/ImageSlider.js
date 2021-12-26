import React from 'react'
import { Carousel } from 'antd'

const ImageSlider = (props) => {
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, i) => (
                    <div key={i}>
                        <img src={`http://localhost:5000/${image}`} alt='productImage' style={{width:'100%', maxHeight:'150px'}} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
