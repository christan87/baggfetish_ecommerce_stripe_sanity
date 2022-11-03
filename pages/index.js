import React from 'react'

import { client } from '../lib/client';
import { Product, HeroBanner, FooterBanner } from '../components';

const Home = ({products, bannerData}) => {
  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <div className='products-heading'> 
        {/* Best Selling Prodects Section Begin */}
        <h2>Best Selling Products</h2>
        <p>Available While Supplies Last</p>
      </div>

      {/* Loop over Products */}
      <div className='products-container'>
        {
          products?.map((product) => <Product key={product.id} product={product} />)
        }
      </div>
      {/* Best Selling Prodects Section End */}
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return{
    props: {products, bannerData}
  }
}

export default Home;
